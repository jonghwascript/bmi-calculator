# SCSS 작성 가이드

이 문서는 BMI Calculator 프로젝트에서 SCSS를 리팩터링하며 정한 규칙입니다. 다음 프로젝트에서도 같은 기준으로 작성할 수 있도록 정리했습니다. 레이아웃 클래스(`l-`)의 역할은 [pattern.md](pattern.md)를 참고하세요.

## 핵심 원칙 요약

1. 중첩은 **최대 3단계**까지만 합니다. HTML 구조를 그대로 따라 쓰지 않습니다.
2. 스타일은 **클래스**에 연결합니다. ID, `aria-*` 같은 속성, 태그 선택자에는 연결하지 않습니다.
3. 속성은 **정해진 순서**로 씁니다.
4. 미디어 쿼리는 **해당 규칙 안에** 넣습니다.
5. 값이 달라지는 묶음은 `@mixin`, 값이 고정된 묶음은 `%placeholder`로 만듭니다.
6. 두 번 이상 쓰는 값은 **변수(토큰)**로 뺍니다.
7. 단위는 **"사용자가 글꼴을 키우면 함께 커져야 하는가"**로 고릅니다. 글자는 `rem`, 분기점은 `em`, 가는 선은 `px`입니다.
8. 리팩터링한 뒤에는 **computed style을 비교**해 화면이 그대로인지 확인합니다.

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
- 분기점은 `$breakpoints` 맵 한 곳에서만 관리합니다. 맵에는 시안의 px 값을 그대로 쓰고, `mq()`가 em으로 바꿔 출력합니다(`768px` → `48em`). 이유는 [9. 단위](#9-단위-rem-em-px-vw)를 참고하세요.

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
    width: min(35.25rem, 100%); // 564px, 열보다 넓어지지 않게 제한
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
$gradient-sky: linear-gradient(90deg, #d6e6fe 0%, #ebf3ff 40%, #ffffff 100%);
$space-gutter: min(1.5rem, 6.4vw);
```

- 고정 숫자 변수의 부호를 바꿀 때는 괄호로 감쌉니다: `margin-inline: (-$size);`
- `min()`, `vw`처럼 브라우저가 계산하는 값은 Sass가 부호를 바꿀 수 없으므로 `calc(-1 * …)`를 씁니다: `margin-inline: calc(-1 * var(--gutter-inline));`
- rem·em으로 바꾼 값에는 `// 24px`처럼 시안의 px 값을 주석으로 남깁니다. 어떤 단위를 쓸지는 [9. 단위](#9-단위-rem-em-px-vw)를 따릅니다.

---

## 9. 단위: rem, em, px, vw

단위를 고르는 질문은 하나입니다. **"사용자가 브라우저 글꼴 크기를 키우면 이 값도 함께 커져야 하는가?"**

| 단위 | 기준이 되는 값 | 이 프로젝트에서 쓰는 곳 |
| --- | --- | --- |
| `rem` | 루트 글꼴 크기 (브라우저 기본 글꼴, 보통 16px) | 글꼴 크기, 컴포넌트 안 간격(`--space`, `gap`), 최대 너비 |
| `em` (미디어 쿼리) | 브라우저 기본 글꼴 크기 | `mq()` 분기점 (`48em`, `64em`) |
| `em` (속성 값) | 그 요소 자신의 글꼴 크기 | 글자에 비례해야 하는 값. `.l-icon` 크기(`0.75em`), `.l-with-icon` 아이콘 간격(`0.5em`) |
| `px` | 고정 | 1px 테두리, 포커스 outline 두께·간격, 그림자, `999px` 둥근 모서리, `u-sr-only`의 1px |
| `vw` + `min()` | 화면 너비 | 가장자리 여백 `$space-gutter: min(1.5rem, 6.4vw)` |
| `%`, `fr`, `minmax()` | 부모 크기 | 그리드 열, 레이아웃 너비 |
| 단위 없음 | 그 요소의 글꼴 크기 배수 | `line-height: 1.5` |

### rem: 글자와 글자에 딸린 간격

- **글꼴 크기는 항상 `rem`**으로 씁니다. px로 쓰면 브라우저 글꼴 설정을 무시하므로 글자를 키울 수 없습니다(WCAG 1.4.4).
- 시안의 px는 16으로 나눠 바꾸고 원래 값을 주석으로 남깁니다: `2rem; // 32px`
- 글꼴 크기에는 `em`을 쓰지 않습니다. 부모의 글꼴 크기가 곱해져 중첩될수록 값이 누적됩니다.
- 여백도 rem이면 글꼴과 함께 커집니다. 넓은 화면에서는 문제가 없지만, 좁은 화면에서는 여백이 겹겹이 쌓여 글자가 들어갈 자리가 사라집니다. 화면 가장자리 여백은 아래 `vw` + `min()`을 씁니다.

### em: 미디어 쿼리, 그리고 글자에 비례하는 값

**1) 미디어 쿼리**

```scss
// abstracts/_mixins.scss
@media (min-width: math.div(map.get(v.$breakpoints, $device), 16px) * 1em) { … }
```

- 분기점을 px로 쓰면 사용자가 글꼴을 키워도 레이아웃은 데스크톱 그대로이고 내용만 커집니다. 실제로 글꼴 32px에서 1024px 화면의 문서 너비가 2200px까지 넓어졌습니다.
- 분기점을 em으로 쓰면 글꼴을 두 배로 키웠을 때 분기점도 두 배가 되어, 넓은 화면에서도 태블릿·모바일 레이아웃으로 바뀝니다.
- **미디어 쿼리의 `em`은 `html { font-size }`가 아니라 브라우저 기본 글꼴 크기 기준입니다.** 개발자 도구에서 `html`의 `font-size`만 바꾸면 이 동작을 재현할 수 없습니다. `npm run check:layout`은 브라우저 설정을 바꿔 재현합니다.

**2) 그 요소의 글자 크기에 맞춰야 하는 값**

- 글자 바로 옆 아이콘 크기, 버튼 안쪽 여백처럼 **그 요소의 글자와 비율을 유지해야 하는 값**에 씁니다. 예: `.c-button { padding: 0.75em 1.5em; }`. 버튼 글자 크기를 바꾸면 여백도 같은 비율로 바뀝니다.
- 이 프로젝트의 `.l-icon`(layout/_every-layout.scss)은 `0.75em`(지원 환경에서는 `1cap`)으로 아이콘을 제목 글자 크기에 맞춥니다. limitations 카드는 `.c-card .icon { width: 2rem; }`(pages/_limitations.scss)으로 이 값을 덮어써 시안의 32px로 고정합니다. 제목 크기가 바뀌어도 아이콘이 따라 커지게 하려면 덮어쓰기를 em으로 바꿉니다(20px 제목 기준 `1.6em`).
- `letter-spacing`도 글자 크기에 비례하는 값입니다. `heading` mixin의 `-5%`와 `-0.05em`은 Chrome 154에서 같은 너비로 렌더링됩니다. `%`는 비교적 최근 문법이고 Firefox에서는 확인하지 않았으므로, 지원 범위가 걱정되면 `-0.05em`을 씁니다.

### px: 커지면 오히려 어색한 값

- 1px 테두리, 포커스 outline(`2px`)과 `outline-offset`, 그림자, `999px` 둥근 모서리, `u-sr-only`의 `1px`처럼 **선과 효과**는 px로 둡니다.
- 크기가 고정된 장식 이미지(패턴 곡선 등)는 px도 괜찮습니다. 단, **글자를 담는 영역의 높이는 px로 고정하지 않습니다.** 글꼴을 키우면 글자가 영역 밖으로 넘칩니다.

### vw와 `min()`: 화면 가장자리 여백

```scss
// abstracts/_variables.scss — 375px × 6.4% = 24px
$space-gutter: min(1.5rem, 6.4vw);
```

- 기본 글꼴에서는 375px 이상 어디서나 24px라 시안과 같습니다. 글꼴을 키우면 넓은 화면에서는 여백도 커지고, 좁은 화면에서는 화면 너비의 6.4%에서 멈춥니다.
- 페이지·계산기·입력 칸·결과 패널처럼 **화면 가장자리에서 겹겹이 쌓이는 여백**에 씁니다. 새 박스를 추가할 때도 같은 값을 씁니다.
- `clamp(1rem, …, 1.5rem)`은 최솟값 `1rem`도 글꼴을 따라 커지므로 효과가 작습니다.
- 이 여백을 음수로 상쇄할 때는 `calc(-1 * var(--gutter-inline))`를 씁니다. Sass에서 `(-$space-gutter)`는 컴파일 오류입니다.

### 시안의 고정 너비는 "최대값"으로

시안의 468px 같은 고정 너비를 그대로 쓰면 분기점 바로 위에서 넘칩니다. 최대값으로만 쓰고 줄어들 수 있게 합니다.

```scss
width: min(35.25rem, 100%);                                        // 요소 너비
grid-template-columns: minmax(0, 29.25rem) minmax(0, 29.0625rem);  // 그리드 열
column-gap: clamp(2rem, 8vw, 8.1875rem);                           // 간격
```

### 단위 점검

- 바꾼 뒤에는 `npm run check:layout`으로 기본 글꼴과 32px 글꼴에서 가로 넘침을 확인합니다.
- 현재 px로 남아 있는 값은 다음과 같습니다. 고칠 때 위 기준으로 판단합니다.

| 위치 | 값 | 판단 |
| --- | --- | --- |
| `_calculator.scss` 라디오 동그라미 | `31px` | 글자 옆 컨트롤이라 `em`(약 `1.9em`) 후보 |
| `_page.scss` 데스크톱 히어로 배경 높이 | `630px` | 모바일은 `40.625rem`. 글자를 담지 않는 배경이라 px도 가능하지만 단위 통일 필요 |
| `_limitations.scss` 곡선 패턴 | `94px` × `122px` | 장식이라 px 허용 |
| `_result.scss` 곡선 패턴 높이 | `200px` | 장식이라 px 허용 |

---

## 10. 반복은 `@each`로

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

## 11. 주석과 정리

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

## 12. 리팩터링 후 검증 절차

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

## 13. 커밋 전 체크리스트

- [ ] `node -e "require('sass').compile('src/scss/style.scss')"` 통과
- [ ] 중첩 3단계 이하, ID·속성 선택자로 스타일을 연결하지 않음
- [ ] HTML 클래스와 SCSS 선택자가 일치함 (오타, 쓰지 않는 규칙, 빈 규칙 없음)
- [ ] 새로 만든 값은 변수로 뺐고, 이름은 소문자 kebab-case
- [ ] `--사용자정의속성`의 선언과 사용이 일치함 (`--sapce` 같은 오타는 문법 검사로 잡히지 않음)
- [ ] 리팩터링이라면 computed style 비교 결과를 확인하고, 달라진 항목의 이유를 기록함
- [ ] `git diff --check` 통과 (줄 끝 공백 없음)
- [ ] 직접 작성하거나 수정한 파일은 Prettier 형식에 맞음 (`singleQuote: true`)

## 14. 도구로 강제하기 (선택)

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
