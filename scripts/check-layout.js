// ==========================================
// 레이아웃·접근성 회귀 검사
// dist를 내장 정적 서버로 띄우고 Chrome(Playwright)으로 아래 항목을 검사한다.
//   1. 화면 너비 × 브라우저 기본 글꼴 크기별 가로 넘침
//   2. 키보드 Tab으로 단위 라디오에 갔을 때 포커스 표시
//   3. 404 등 실패한 요청과 콘솔 오류
// 사용법: npm run check:layout  (빌드 후 실행)
//         node scripts/check-layout.js  (이미 빌드된 dist 사용)
// 하나라도 실패하면 종료 코드 1을 돌려준다.
// ==========================================
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');

// 기본 글꼴(16px)은 WCAG 1.4.10 Reflow 기준인 320px부터 분기점 앞뒤를 모두 확인한다.
// 32px(텍스트 200%)는 375px부터 확인한다. 320px + 200%는 기준보다 엄격한 조건이라 제외한다.
const CASES = [
  { fontSize: 16, widths: [320, 375, 767, 768, 1023, 1024, 1100, 1280, 1440] },
  { fontSize: 32, widths: [375, 767, 768, 1023, 1024, 1100, 1280, 1440] },
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

// ------------------------------------------
// 정적 서버 (빈 포트를 자동으로 고른다)
// ------------------------------------------
function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath.endsWith('/')) urlPath += 'index.html';

    const filePath = path.join(DIST_DIR, urlPath);
    // dist 밖의 파일은 내보내지 않는다.
    if (!filePath.startsWith(DIST_DIR + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end();
        return;
      }
      const type =
        MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${server.address().port}/` });
    });
  });
}

// ------------------------------------------
// 브라우저: 기본 글꼴 크기는 프로필 설정으로만 바꿀 수 있다.
// (html { font-size }를 바꾸면 rem은 커지지만 em 분기점은 그대로라 실제 설정을 재현하지 못한다.)
// ------------------------------------------
async function launchContext(fontSize) {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-layout-'));
  fs.mkdirSync(path.join(profileDir, 'Default'));
  fs.writeFileSync(
    path.join(profileDir, 'Default', 'Preferences'),
    JSON.stringify({ webkit: { webprefs: { default_font_size: fontSize } } }),
  );

  const options = { headless: true };
  let context;
  try {
    // 설치된 Chrome을 우선 사용한다.
    context = await chromium.launchPersistentContext(profileDir, {
      ...options,
      channel: 'chrome',
    });
  } catch {
    // Chrome이 없으면 Playwright Chromium으로 대체한다. (npx playwright install chromium 필요)
    context = await chromium.launchPersistentContext(profileDir, options);
  }

  const close = async () => {
    await context.close();
    fs.rmSync(profileDir, { recursive: true, force: true });
  };
  return { context, close };
}

// ------------------------------------------
// 검사 1: 가로 넘침
// 넘치는 요소 중 자식은 넘치지 않는 가장 깊은 요소를 원인 후보로 보고한다.
// ------------------------------------------
function measureOverflow(page) {
  return page.evaluate(() => {
    const root = document.scrollingElement;
    const viewport = root.clientWidth;
    const overflowing = [...document.querySelectorAll('body *')].filter(
      (el) => el.getBoundingClientRect().right > viewport + 1,
    );
    const culprits = overflowing
      .filter(
        (el) => ![...el.children].some((child) => overflowing.includes(child)),
      )
      .slice(0, 3)
      .map((el) => {
        const name =
          typeof el.className === 'string' && el.className
            ? `.${el.className.split(' ').join('.')}`
            : '';
        return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${name} (${Math.round(el.getBoundingClientRect().width)}px)`;
      });
    return { scrollWidth: root.scrollWidth, viewport, culprits };
  });
}

// ------------------------------------------
// 검사 2: 키보드 포커스
// ------------------------------------------
async function checkRadioFocus(page) {
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    const id = await page.evaluate(() => document.activeElement?.id);
    if (id === 'unit-metric' || id === 'unit-imperial') break;
  }

  return page.evaluate(() => {
    const input = document.activeElement;
    const label = input?.closest('.c-radio');
    if (!label)
      return {
        ok: false,
        detail: `Tab으로 단위 라디오에 도달하지 못함 (현재: ${input?.id || input?.tagName})`,
      };

    const style = getComputedStyle(label);
    const visible =
      style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
    return {
      ok: visible,
      detail: `#${input.id} label outline: ${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
    };
  });
}

// ------------------------------------------
// 실행
// ------------------------------------------
async function main() {
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.error(
      'dist/index.html이 없습니다. 먼저 npm run build를 실행하세요.',
    );
    process.exit(1);
  }
  const cssPath = path.join(DIST_DIR, 'css', 'style.css');
  if (!fs.existsSync(cssPath) || fs.statSync(cssPath).size === 0) {
    console.error(
      'dist/css/style.css가 없거나 비어 있습니다. 다시 빌드하세요.',
    );
    process.exit(1);
  }

  const { server, url } = await startServer();
  const failures = [];
  const log = (ok, message) => {
    console.log(`${ok ? '  ✓' : '  ✗'} ${message}`);
    if (!ok) failures.push(message);
  };

  try {
    for (const { fontSize, widths } of CASES) {
      console.log(`\n[가로 넘침] 브라우저 기본 글꼴 ${fontSize}px`);
      const { context, close } = await launchContext(fontSize);
      const page = context.pages()[0] ?? (await context.newPage());

      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url);
        const { scrollWidth, viewport, culprits } = await measureOverflow(page);
        const ok = scrollWidth <= viewport;
        log(
          ok,
          `${fontSize}px / ${width}px: 문서 ${scrollWidth}px${ok ? '' : ` > ${viewport}px → ${culprits.join(', ')}`}`,
        );
      }
      await close();
    }

    console.log('\n[키보드 포커스 · 요청 · 콘솔] 기본 글꼴, 1280px');
    const { context, close } = await launchContext(16);
    const page = context.pages()[0] ?? (await context.newPage());
    const failedRequests = [];
    const consoleErrors = [];
    page.on('response', (response) => {
      if (response.status() >= 400)
        failedRequests.push(
          `${response.status()} ${response.url().replace(url, '/')}`,
        );
    });
    page.on('requestfailed', (request) =>
      failedRequests.push(`failed ${request.url().replace(url, '/')}`),
    );
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle' });

    const focus = await checkRadioFocus(page);
    log(focus.ok, `단위 라디오 포커스 표시 — ${focus.detail}`);
    log(
      failedRequests.length === 0,
      `실패한 요청 ${failedRequests.length}건${failedRequests.length ? `: ${failedRequests.join(', ')}` : ''}`,
    );
    log(
      consoleErrors.length === 0,
      `콘솔 오류 ${consoleErrors.length}건${consoleErrors.length ? `: ${consoleErrors.join(' | ')}` : ''}`,
    );
    await close();
  } finally {
    server.close();
  }

  console.log(
    failures.length ? `\n실패 ${failures.length}건` : '\n모든 검사 통과',
  );
  process.exit(failures.length ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
