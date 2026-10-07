# SCSS 작성 가이드

이 문서는 BMI Calculator 프로젝트에서 SCSS를 리팩터링하며 정한 규칙입니다. 다음 프로젝트에서도 같은 기준으로 작성할 수 있도록 정리했습니다. 레이아웃 클래스(`l-`)의 역할은 [pattern.md](pattern.md)를 참고하세요.

## 핵심 원칙 요약

1. 중첩은 **최대 3단계**까지만 합니다. HTML 구조를 그대로 따라 쓰지 않습니다.
2. 스타일은 **클래스**에 연결합니다. ID, `aria-*` 같은 속성, 태그 선택자에는 연결하지 않습니다.
3. 속성은 **정해진 순서**로 씁니다.
4. 미디어 쿼리는 **해당 규칙 안에** 넣습니다.
5. 값이 달라지는 묶음은 `@mixin`, 값이 고정된 묶음은 `%placeholder`로 만듭니다.
6. 두 번 이상 쓰는 값은 **변수(토큰)**로 뺍니다.
7. 리팩터링한 뒤에는 **computed style을 비교**해 화면이 그대로인지 확인합니다.

---

## 1. 폴더 구조 (7-1 패턴을 프로젝트 규모에 맞게 줄인 형태)

```text
src/scss/
├── abstracts/        # CSS를 출력하지 않는 코드
│   ├── _index.scss   # variables, mixins를 @forward
│   ├── _variables.scss
│   └── _mixins.scss
├── base/             # 폰트, 리셋, 전역 기본값
├── layout/           # Every Layout 기본 요소(l-stack, l-grid 등), 페이지 그리드
├── components/       # 여러 곳에서 재사용하는 컴포넌트, 공통 텍스트 스타일
├── pages/            # 특정 페이지·섹션 전용 스타일
├── utilities/        # u-sr-only 같은 유틸리티 클래스
└── style.scss        # 진입점: @use만 나열한다
```

### 진입점은 불러오기만 한다

`@use`로 불러온 순서대로 CSS가 출력되므로, **불러오는 순서가 곧 캐스케이드 순서**입니다. 유틸리티는 마지막에 둡니다.

```scss
// style.scss
@use 'base/fonts';
@use 'base/reset';
@use 'base/base';

@use 'layout/every-layout';
@use 'layout/page';

@use 'components/typography';
@use 'components/calculator';

@use 'pages/hero';
@use 'pages/result';

@use 'utilities/utilities'; // 같은 명시도에서 다른 규칙을 이기도록 마지막에
```

### 파셜에서는 abstracts만 불러온다

```scss
// pages/_hero.scss
@use '../abstracts' as *;
```

- `abstracts`는 CSS를 출력하지 않으므로 필요한 파셜에서 각자 불러옵니다.
- 파셜 안에서 `reset`, `layout`처럼 CSS를 출력하는 파셜을 다시 `@use`하지 않습니다. 의존 관계와 출력 순서가 헷갈리게 됩니다.
- `@import`는 사용 중단(deprecated)되었으므로 `@use`와 `@forward`만 씁니다.

---

## 2. 클래스 이름 규칙

| 접두사 | 역할 | 예 |
| --- | --- | --- |
| `l-` | 배치·간격만 담당 (생김새 없음) | `l-stack`, `l-grid--result`, `l-limitations__race` |
| `c-` | 컴포넌트의 생김새 | `c-tip`, `c-tip__icon`, `c-title--section` |
| `u-` | 한 가지 일만 하는 유틸리티 | `u-sr-only`, `u-hidden` |
| `is-` | JavaScript가 바꾸는 상태 | `is-empty`, `is-active` |

BEM 형식을 따릅니다: `block__element--modifier`

- 요소 이름에 오타가 없는지 HTML과 SCSS 양쪽에서 확인합니다. (실제 사례: `c-hreo__image`)
- 같은 블록의 변형은 modifier로 구분합니다. ID로 구분하지 않습니다.

```html
<!-- ✗ ID로 구분 -->
<fieldset class="c-fieldset" id="metric-fields">

<!-- ✓ modifier로 구분 (id는 JavaScript와 label 연결용으로만 남긴다) -->
<fieldset class="c-fieldset c-fieldset--metric" id="metric-fields">
```

---

## 3. 중첩은 최대 3단계

HTML 구조를 그대로 따라 중첩하면 다음과 같은 문제가 생깁니다.

- 마크업에서 `div` 하나만 바꿔도 스타일이 적용되지 않습니다.
- 선택자 명시도가 높아져서 덮어쓰기가 어려워집니다.
- 이 규칙이 무엇을 꾸미는지 알려면 끝까지 읽어야 합니다.

```scss
// ✗ 리팩터링 전: 7단계, 컴파일 결과가 매우 긴 선택자
section[aria-labelledby='tips-title'] {
  .l-wrapper {
    .l-stack {
      .l-grid {
        .l-grid__item {
          .c-tip {
            .c-tip__icon { width: 64px; }
          }
        }
      }
    }
  }
}

// ✓ 리팩터링 후: 블록 기준으로 평탄하게
.c-tip {
  flex-wrap: wrap;
  gap: 32px;

  &__icon {
    width: 64px;
  }

  .c-title--card {
    @include heading(24px, 1.2);
  }
}
```

### 맥락에 따라 달라지는 스타일만 한 단계 중첩한다

같은 `.c-title--card`라도 tips에서는 24px, 카드에서는 20px이라면 부모 블록 아래에 한 단계만 중첩합니다.

```scss
.c-tip  .c-title--card { @include heading(24px, 1.2); }
.c-card .c-title--card { @include heading(20px, 1.2); }
```

### `&`로 이름을 이어 붙일 때 주의할 점

```scss
.c-title {
  &--card { }   // → .c-title--card (복합 선택자가 아니라 새 클래스)
  &.is-on { }   // → .c-title.is-on (같은 요소에 두 클래스)
  & + & { }     // → .c-title + .c-title
}
```

---

## 4. 선택자 규칙

| 피할 것 | 이유 | 대신 쓸 것 |
| --- | --- | --- |
| `#limitations-title` | 명시도가 매우 높고 재사용할 수 없음 | `.c-title--section` |
| `section[aria-labelledby='result-title']` | ARIA 값을 바꾸면 스타일까지 깨짐 | `.c-result` |
| `fieldset.c-fieldset:nth-of-type(1)` | 순서가 바뀌면 다른 요소에 적용됨 | `.l-cluster--units` |
| 전역 `header`, `p` | 다른 섹션까지 영향을 줌 | `.c-hero__header` |
| `label[for='unit-metric']` | 연결용 속성에 의존함 | `.c-radio` |

`:has()`처럼 상태를 표현하는 선택자는 사용해도 됩니다.

```scss
.c-radio:has(.c-radio__input:checked) .l-cluster--radio::before { ... }
```

---

## 5. 선언 순서

한 규칙 안에서는 아래 순서로 씁니다.

1. 사용자 정의 속성: `--space`, `--padding`
2. 위치·배치: `content`(가상 요소), `position`, `inset`, `z-index`, `display`, `flex-*`, `grid-*`, `gap`, `align-*`, `justify-*`
3. 크기·간격: `width`, `height`, `aspect-ratio`, `margin`, `padding`
4. 외형: `border`, `border-radius`, `background`
5. 타이포그래피: `@include font-style()`, `color`, `letter-spacing`, `text-align`
6. 효과: `opacity`, `transform`, `transition`, `box-shadow`
7. 상태·가상 요소: `&:hover`, `&:focus-visible`, `&::before`
8. 미디어 쿼리: `@include mq(...)`
9. 자식 요소: `&__element`, `.child`

```scss
.l-cluster--radio {
  --space: 16px;                 // 1. 사용자 정의 속성
  justify-content: space-around; // 2. 배치

  &::before {                    // 7. 가상 요소
    content: '';
    display: block;
    width: 31px;
    height: 31px;
    border: 1px solid $grey-500;
    border-radius: 50%;
  }

  @include mq('tablet') {        // 8. 미디어 쿼리
    justify-content: initial;
  }
}
```

> `--space`는 반드시 블록 맨 위에 둡니다. 미디어 쿼리 아래에 두면 재정의되는 값처럼 보여 읽는 사람이 헷갈립니다.

---

## 6. 반응형: 미디어 쿼리는 규칙 안에 넣는다

- 모바일 우선(mobile-first)으로 작성합니다. 기본 스타일이 모바일이고, `mq('tablet')`와 `mq('desktop')`로 확장합니다.
- 분기점은 `$breakpoints` 맵 한 곳에서만 관리합니다.

```scss
// abstracts/_variables.scss
$breakpoints: (
  'tablet': 768px,
  'desktop': 1024px,
);

// 사용
.c-calculator {
  width: min(clamp(20.5rem, calc(-0.85rem + 91.094vw), 42.875rem), 100%);

  @include mq('desktop') {
    width: 35.25rem; // 564px
  }
}
```

`mq()` 믹스인은 맵에 없는 이름이 들어오면 `@error`로 컴파일을 중단시킵니다. 오타가 조용히 무시되지 않습니다.

---

## 7. mixin, placeholder, 클래스 중 무엇을 쓸지

| 상황 | 도구 | 예 |
| --- | --- | --- |
| 인자에 따라 값이 달라짐 | `@mixin` | `heading($size, $line-height)`, `mq($device)` |
| 완전히 같은 고정 스타일을 한 파일 안에서 여러 선택자가 공유 | `%placeholder` + `@extend` | `%text-label` |
| HTML에서 직접 조합해 쓰는 스타일 | 클래스 | `.c-paragraph`, `.u-sr-only` |

```scss
// 값이 달라지는 묶음 → mixin
@mixin heading($size, $line-height) {
  @include font-style($size, 600, $line-height);
  letter-spacing: -5%;
}

// 고정 묶음 → placeholder (같은 파일 안에서 정의하고 사용)
%text-label {
  @include font-style(14px, 400, 1.5);
  color: $grey-500;
}

.c-field__label    { @extend %text-label; }
.c-fieldset__title { @extend %text-label; }
```

주의할 점:
- **mixin은 호출할 때마다 선언이 복사됩니다.** 같은 묶음을 수십 번 쓴다면 공통 클래스를 만드는 편이 나은지 따져 봅니다.
- **`@extend`는 선택자를 placeholder가 정의된 위치로 모읍니다.** 출력 위치와 명시도가 달라지므로 같은 파일 안에서만 쓰고, 미디어 쿼리 안에서는 쓰지 않습니다.
- 색처럼 맥락마다 달라지는 값은 mixin 안에 고정하지 말고 호출하는 쪽에서 지정합니다.

---

## 8. 변수(토큰)

- 이름은 **소문자 kebab-case**로 씁니다: `$blue-900` (✗ `$Blue-900`, `$White`)
- 두 번 이상 쓰는 값은 변수로 뺍니다.

```scss
$gradient-sky: linear-gradient(135deg, #ffffff 0%, #d6e6fe 100%, #253347 100%);
$section-gutter: 24px;
```

- 변수로 계산한 값의 부호를 바꿀 때는 괄호로 감쌉니다: `margin-inline: (-$section-gutter);`
- `rem`과 `px` 중 하나를 프로젝트 초기에 정해 통일합니다. 섞어 쓸 수밖에 없다면 `// 24px`처럼 환산값을 주석으로 남깁니다.

---

## 9. 반복은 `@each`로

```scss
// ✗ 거의 같은 블록 6개
.l-limitations__title  { @include mq('tablet') { grid-area: title; } }
.l-limitations__gender { @include mq('tablet') { grid-area: gender; } }
// ...

// ✓
@each $area in title, gender, age, muscle, pregnancy, race {
  .l-limitations__#{$area} {
    @include mq('tablet') {
      grid-area: $area;
    }
  }
}
```

반복문은 생성되는 클래스 이름이 HTML에 실제로 있을 때만 씁니다. 코드 검색(grep)에 걸리지 않으므로, 반복문 위에 무엇을 만드는지 주석으로 적습니다.

---

## 10. 주석과 정리

- 주석에는 **왜** 그렇게 했는지를 씁니다. 코드를 읽으면 알 수 있는 **무엇**은 쓰지 않습니다.
  - ✗ `// flex 좌우`
  - ✓ `// 모바일: 아이콘 아래로 글이 줄바꿈 / 태블릿 이상: 가로 배치`
- 주석 처리한 코드는 지웁니다. 이전 코드는 Git 기록에 남아 있습니다.
- 빈 규칙(`.c-hero {}`)은 지웁니다.
- 파일 안의 큰 구역은 구분선 주석으로 나눕니다.

```scss
// ------------------------------------------
// 입력 필드
// ------------------------------------------
```

---

## 11. 리팩터링 후 검증 절차

SCSS 리팩터링은 문법 검사만으로는 화면이 바뀌었는지 알 수 없습니다. 선택자를 평탄하게 만들면 명시도가 달라져서, 이전에는 덮어쓰던 규칙이 지게 될 수 있기 때문입니다.

1. 리팩터링 전에 빌드하고 기준값을 저장합니다.
2. 리팩터링한 뒤 다시 빌드하고 같은 조건으로 값을 저장합니다.
3. 두 결과를 비교해서 달라진 속성이 의도한 것인지 하나씩 확인합니다.

비교 조건:
- 화면 너비: 각 분기점 직전·직후 (예: 767/768, 1023/1024)와 모바일·큰 데스크톱
- 상태: 토글, 라디오, 열림·닫힘처럼 화면이 달라지는 모든 상태
- 값: 모든 요소와 `::before`/`::after`의 computed style, 그리고 `getBoundingClientRect()` 위치·크기

<details>
<summary>Playwright 비교 스크립트 예시</summary>

```js
// snap.cjs — 사용: node snap.cjs out.json  (빌드된 dist/index.html 기준)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve('node_modules/@playwright/test'));

const url = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
const widths = [375, 767, 768, 1023, 1024, 1440];
const states = {
  default: async () => {},
  imperial: (page) => page.click('label[for="unit-imperial"]'), // 프로젝트에 맞게 수정
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const result = {};
  for (const w of widths) {
    for (const [name, apply] of Object.entries(states)) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(url);
      await apply(page);
      result[`${w}-${name}`] = await page.evaluate(() => {
        const out = {};
        // 요소마다 태그명과 형제 순서로 경로를 만든다. 클래스를 바꿔도 같은 요소끼리 비교된다.
        const key = (el) => {
          const parts = [];
          for (let e = el; e !== document.documentElement; e = e.parentElement) {
            parts.unshift(e.tagName.toLowerCase() + ':' + [...e.parentElement.children].indexOf(e));
          }
          return parts.join('>');
        };
        const dump = (cs) => Object.fromEntries([...cs].map((p) => [p, cs.getPropertyValue(p)]));
        for (const el of [document.body, ...document.body.querySelectorAll('*')]) {
          const r = el.getBoundingClientRect();
          out[key(el)] = { ...dump(getComputedStyle(el)), __rect: [r.x, r.y, r.width, r.height].join() };
          for (const ps of ['::before', '::after']) {
            const cs = getComputedStyle(el, ps);
            if (cs.content !== 'none' && cs.content !== 'normal') out[key(el) + ps] = dump(cs);
          }
        }
        return out;
      });
    }
  }
  await browser.close();
  fs.writeFileSync(process.argv[2], JSON.stringify(result));
})();
```

두 JSON 파일을 같은 키끼리 비교해서 값이 다른 `요소 | 속성: 이전 -> 이후` 목록을 출력하면 됩니다.

같은 빌드로 두 번 찍어 차이가 0인지 먼저 확인합니다. 0이 아니라면 애니메이션이나 폰트 로딩 같은 비결정적 요소가 있다는 뜻이니, 그것부터 해결한 뒤 비교합니다.

</details>

이 비교는 Chromium 한 가지 브라우저에서 계산된 값만 확인합니다. Firefox, 확대 200%, 키보드 조작, 스크린 리더 확인을 대신하지 않습니다.

---

## 12. 커밋 전 체크리스트

- [ ] `node -e "require('sass').compile('src/scss/style.scss')"` 통과
- [ ] 중첩 3단계 이하, ID·속성 선택자로 스타일을 연결하지 않음
- [ ] HTML 클래스와 SCSS 선택자가 일치함 (오타, 쓰지 않는 규칙, 빈 규칙 없음)
- [ ] 새로 만든 값은 변수로 뺐고, 이름은 소문자 kebab-case
- [ ] `--사용자정의속성`의 선언과 사용이 일치함 (`--sapce` 같은 오타는 문법 검사로 잡히지 않음)
- [ ] 리팩터링이라면 computed style 비교 결과를 확인하고, 달라진 항목의 이유를 기록함
- [ ] `git diff --check` 통과 (줄 끝 공백 없음)
- [ ] 직접 작성하거나 수정한 파일은 Prettier 형식에 맞음 (`singleQuote: true`)

## 13. 도구로 강제하기 (선택)

규칙을 사람이 매번 확인하지 않도록 stylelint를 추가할 수 있습니다.

```bash
npm i -D stylelint stylelint-config-standard-scss
```

`.stylelintrc.json` 예시:

```json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "max-nesting-depth": 3,
    "selector-max-id": 0,
    "block-no-empty": true,
    "scss/dollar-variable-pattern": "^[a-z][a-z0-9-]*$"
  }
}
```

이 프로젝트에는 아직 stylelint가 설치되어 있지 않습니다. 도입할 때는 기존 코드에서 나오는 경고를 먼저 정리해야 합니다.
