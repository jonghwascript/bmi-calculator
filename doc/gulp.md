# Gulp 설치 및 실행 절차

## 1. 필요한 패키지 설치

프로젝트 루트에서 잠금 파일에 기록된 의존성을 설치한다.

```bash
npm ci
```

- `gulp`: 태스크 러너 본체
- `gulp-sass` + `sass`: SCSS → CSS 변환 (Dart Sass 사용)
- `gulp-sourcemaps`: CSS 소스맵 생성
- `gulp-file-include`: HTML의 `@@include` 처리
- `gulp-prettier` + `prettier`: 소스 파일 포맷팅
- `browser-sync`: `dist/` 개발 서버와 브라우저 자동 새로고침
- `gulp-clean-css`: `devDependencies`에 남아 있지만 현재 `gulpfile.js`에서는
  불러오거나 사용하지 않는다. 출력 CSS는 압축하지 않는다.

## 2. 현재 빌드 구성

원본 파일은 `src/`에 두고, 빌드 결과는 `dist/`에 생성한다.
`dist/`는 전체 빌드 때 삭제 후 다시 생성되므로 결과물을 직접 수정하지 않는다.

| 태스크 | 입력 및 동작 | 출력 |
| --- | --- | --- |
| `clean` | `dist/` 전체 삭제 | — |
| `scss` | `src/scss/style.scss`를 진입점으로 SCSS 컴파일 | `dist/css/style.css`, `dist/css/style.css.map` |
| `html` | `src/pages/*.html`의 HTML include 처리 | `dist/` 바로 아래 HTML 파일 |
| `static` | `src/*.json`, `src/{js,images,fonts}/**/*` 복사 | `src/` 기준 상대 경로를 유지한 `dist/` 내부 파일 |
| `build` | `clean` 완료 후 `scss`, `html`, `static` 병렬 실행 | 전체 빌드 결과 |
| 기본 태스크 | `build` 완료 후 개발 서버와 변경 감시 시작 | 브라우저에서 결과물 실시간 확인 |
| `prettier` | 지정된 소스 파일 포맷팅 | 원본 파일 덮어쓰기 |

현재 태스크 연결은 다음과 같다.

```js
const buildTask = gulp.series(
  cleanTask,
  gulp.parallel(scssTask, htmlTask, staticTask),
);

exports.clean = cleanTask;
exports.scss = scssTask;
exports.html = htmlTask;
exports.static = staticTask;
exports.prettier = prettierTask;
exports.build = buildTask;
exports.default = gulp.series(buildTask, serveTask, watchTask);
```

### HTML include 및 정적 파일

- HTML include는 `prefix: '@@'`, `basepath: '@file'` 설정을 사용한다.
  예를 들어 `src/pages/index.html`에서
  `@@include('../partials/header.html')`로 참조하려면 해당 경로에 파일을 만든다.
- HTML 빌드 입력은 `src/pages/*.html`이므로 `src/pages/` 바로 아래의 HTML만
  페이지로 출력한다. `src/partials/` 파일은 include를 통해 반영한다.
- 정적 파일은 `base: 'src'`, `encoding: false`로 복사한다.
  예를 들어 `src/images/favicon-32x32.png`는
  `dist/images/favicon-32x32.png`로 복사된다.
- JavaScript는 별도 변환이나 번들링 없이 복사한다.

## 3. 실행

프로젝트 루트에서 실행한다.

| 명령어 | 동작 |
| --- | --- |
| `npm run build` 또는 `npx gulp build` | `dist/`를 정리하고 한 번 빌드한 뒤 종료 |
| `npm run dev` 또는 `npx gulp` | 전체 빌드 후 브라우저 열기, 개발 서버와 변경 감시 유지 |
| `npm run format` 또는 `npx gulp prettier` | 포맷팅만 실행 |
| `npx gulp clean` | `dist/` 삭제 |
| `npx gulp scss` | SCSS만 컴파일 |
| `npx gulp html` | HTML만 빌드 |
| `npx gulp static` | 정적 파일만 복사 |

- 기본 실행과 `build`에는 Prettier가 포함되지 않는다. 포맷팅은 별도로 실행한다.
- 개발 실행을 종료하려면 터미널에서 `Ctrl + C`를 누른다.
- 개발 실행 시 `dist/`를 제공하는 `http://localhost:3000`이 브라우저에서 자동으로 열린다.
  첫 화면에는 파일·폴더 목록을 표시하며, `index.html` 등 원하는 파일을 클릭해 미리본다.
  포트가 사용 중이면 다른 포트가 선택될 수 있으므로 터미널에 출력된 Local 주소를 확인한다.
- 원본을 저장하면 다시 빌드하고, `dist/` 변경을 BrowserSync가 감지해 반영한다.
  CSS는 페이지 새로고침 없이 적용하고 HTML과 JavaScript는 자동 새로고침한다.
  소스맵(`*.map`)은 브라우저 갱신 감시에서 제외한다.
- 개별 `scss`, `html`, `static` 태스크는 `dist/`를 먼저 삭제하지 않는다.

## 4. 변경 감시 범위

| 감시 대상 | 다시 실행하는 태스크 |
| --- | --- |
| `src/scss/**/*.scss` | `scssTask` |
| `src/pages/**/*.html`, `src/partials/**/*.html` | `htmlTask` |
| `src/*.json`, `src/{js,images,fonts}/**/*` | `staticTask` |

- SCSS partial 변경도 감지하지만 컴파일 진입점은 항상 `src/scss/style.scss`다.
- HTML 감시는 하위 폴더까지 포함하지만 페이지 빌드 입력은 `src/pages/*.html`이다.
- `gulpfile.js`와 Prettier 설정 파일은 감시하지 않는다. Gulp 설정 변경 후에는
  개발 명령을 다시 실행한다.
- 감시 중 Prettier는 자동 실행되지 않는다.
- 원본 파일 삭제 시 대응하는 산출물을 개별 삭제하는 처리는 없다.
  오래된 산출물을 정리하려면 `npm run build`로 전체 빌드를 다시 실행한다.

## 5. Prettier 설정

`gulp-prettier`는 `prettierTask` 내부에서 동적 `import()`로 불러온다.
프로젝트 루트의 `.prettierrc.json`에는 다음 규칙이 설정되어 있다.

```json
{ "singleQuote": true }
```

포맷 대상은 다음과 같다.

```js
const PRETTIER_GLOBS = [
  'src/**/*.html',
  'src/scss/**/*.scss',
  'src/js/**/*.js',
  'gulpfile.js',
];
```

- 루트 HTML, Markdown 문서, `dist/` 파일은 포맷 대상에 포함되지 않는다.
- `gulp.dest('.')`로 원본 파일을 덮어쓰므로 실행 후 diff를 확인한다.
- 포맷 오류는 `[prettier]` 접두사로 출력하고 오류 핸들러에서 `end`를 발생시킨다.
  오류가 발생한 파일의 포맷 완료를 의미하지 않으므로 로그를 확인하고 원인을 수정한다.

## 6. 오류 확인

### 패키지를 찾을 수 없는 경우

```text
Error: Cannot find module '패키지명'
```

1. 프로젝트 루트에서 명령을 실행했는지 확인한다.
2. 해당 패키지가 `package.json`의 `devDependencies`에 있으면 `npm ci`로 다시 설치한다.
3. 새로 사용하는 패키지가 누락되어 있으면 `npm install --save-dev <패키지명>`으로 추가한다.
4. `npm run build`로 빌드 결과를 확인한다.

과거 문서의 `Cannot find module 'gulp-clean-css'` 사례와 달리,
현재 Gulp 설정에는 해당 패키지를 불러오는 코드가 없다.

### HTML 포맷 오류

```text
PluginError [SyntaxError]: Unexpected closing tag "p"...
```

`src/` 아래 해당 HTML의 여닫는 태그를 확인하고 수정한 뒤
`npm run format`을 다시 실행한다. 현재 Prettier는 빌드 및 감시 태스크와
별도로 실행되므로 과거의 기본 태스크 내 Prettier 오류 설명과 구분한다.
