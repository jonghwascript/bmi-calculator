# 엔지니어링 노트

BMI Calculator를 만들며 내린 결정, 원인을 찾느라 시간이 든 문제, 검증 방법을 기록합니다. 코드만 봐서는 알기 어려운 "왜"를 남기는 문서입니다. SCSS 작성 규칙은 [scss-guide.md](scss-guide.md), 접근성 점검 항목은 [a11y-checklist.md](a11y-checklist.md)를 참고하세요.

## 목차

1. [HTML 분리 (`@@include`)](#1-html-분리-include)
2. [단위: px → rem, 분기점은 em](#2-단위-px--rem-분기점은-em)
3. [CSS Grid에서 겪은 문제](#3-css-grid에서-겪은-문제)
4. [SCSS에서 겪은 문제](#4-scss에서-겪은-문제)
5. [BMI 계산 로직](#5-bmi-계산-로직)
6. [접근성 결정](#6-접근성-결정)
7. [검증 방법과 환경 메모](#7-검증-방법과-환경-메모)
8. [남은 과제](#8-남은-과제)

---

## 1. HTML 분리 (`@@include`)

- 섹션 마크업은 `src/pages/components/*.html`로 나누고 `index.html`에서 `@@include`로 불러옵니다.
- `gulp-file-include`의 `basepath`가 `'@file'`이므로 **경로는 include를 쓰는 파일 기준**입니다. `hero.html` 안에서 계산기를 부를 때 `./calculator.html`로 쓰는 이유입니다.
- 결과물은 `dist/index.html` 하나로 합쳐집니다. 이미지·CSS 경로는 **합쳐진 `dist/index.html` 기준**으로 씁니다(`./images/...`).
- 파일 이름 규칙이 섞여 있습니다: `c-tips.html`만 `c-` 접두사가 있고 나머지(`hero`, `result`, `limitations`, `calculator`)는 없습니다.

## 2. 단위: px → rem, 분기점은 em

### 크기는 rem

글꼴·여백·간격을 rem으로 바꾸고 원래 px 값을 주석으로 남겼습니다(1rem = 16px 기준). 사용자가 브라우저 기본 글꼴 크기를 키우면 함께 커집니다.

### 분기점은 em으로 바꿔야 했다

크기만 rem으로 바꾸고 분기점을 px로 두면, 글꼴을 키웠을 때 **레이아웃은 데스크톱 그대로인데 내용만 두 배**가 되어 가로로 넘칩니다.

| 조건 (Chrome) | px 분기점 | em 분기점 |
| --- | --- | --- |
| 기본 글꼴 32px, 1024~1440px 화면 | 문서 너비 2200px | 넘침 없음 |

- `mq()` mixin이 px 값을 em으로 바꿔 출력합니다(`768px` → `48em`, `1024px` → `64em`).
- **미디어 쿼리의 em은 `html { font-size }`가 아니라 브라우저 기본 글꼴 크기 기준**입니다. 그래서 개발자 도구에서 `html`의 `font-size`만 바꿔서는 이 동작을 재현할 수 없습니다. [7. 검증 방법](#7-검증-방법과-환경-메모)을 참고하세요.

### 고정 너비는 줄어들 수 있게

디자인 값을 고정 너비로 쓰면 분기점 바로 위에서 넘칩니다. 예: result 데스크톱 열 `468px + 131px + 465px = 1064px`가 1024px 화면의 컨테이너보다 넓어 1024~1100px에서 가로 스크롤이 생겼습니다.

```scss
// 최대값은 디자인 그대로, 공간이 부족하면 줄어든다.
grid-template-columns: minmax(0, 29.25rem) minmax(0, 29.0625rem);
column-gap: clamp(2rem, 8vw, 8.1875rem);
```

### 가장자리 여백은 화면 너비로 상한을 둔다

여백까지 모두 rem이면 글꼴을 키운 좁은 화면에서 여백이 텍스트 자리를 차지합니다. 375px에서 기본 글꼴을 32px로 키우면 입력 칸 하나에 페이지·계산기 박스·입력 칸 박스의 좌우 여백이 세 겹(296px)으로 쌓여, 입력 칸이 58px까지 줄고 문서가 408px로 넘쳤습니다.

```scss
// abstracts/_variables.scss — 375px × 6.4% = 24px
$space-gutter: min(1.5rem, 6.4vw);
```

- 페이지(`--gutter-inline`), 계산기 박스(`--padding`), 입력 칸 박스(`padding`)에 씁니다.
- 기본 글꼴에서는 375px 이상 어디서나 24px라 디자인과 같습니다. 글꼴을 키우면 넓은 화면에서는 여백도 커지고, 좁은 화면에서는 화면 너비의 6.4%에서 멈춥니다.
- `clamp(1rem, …, 1.5rem)`은 최솟값 `1rem`도 글꼴을 따라 커지므로 효과가 작습니다.
- **페이지 여백을 상쇄하는 음수 여백도 같은 값을 써야 합니다.** 결과 사진과 tips가 고정 `-24px`로 상쇄하던 때, 여백만 바꾸자 320px에서 페이지 여백(20.48px)과 어긋나 기본 글꼴에서도 324px로 넘쳤습니다. 지금은 `calc(-1 * var(--gutter-inline))`로 상쇄합니다.
- `min()`처럼 브라우저가 계산하는 값에 `(-$space-gutter)`를 쓰면 Sass가 `Undefined operation "-min(...)"` 오류를 냅니다.

| 375px, 기본 글꼴 32px | 조정 전 | 조정 후 |
| --- | --- | --- |
| 여백 + 테두리 합계 | 296px | 약 150px |
| 입력 칸 너비 | 58px | 145px |
| 문서 너비 | 408px (넘침) | 375px |

## 3. CSS Grid에서 겪은 문제

### 고정 너비 열을 가운데로: `justify-content`

열을 고정 너비로 두면 남는 공간은 기본적으로 오른쪽에 쌓입니다. 열 묶음 전체를 가운데로 옮기는 것은 컨테이너의 `justify-content: center`입니다.

| 속성 | 위치 | 정렬 대상 |
| --- | --- | --- |
| `justify-content` | 컨테이너 | 열 묶음 전체 |
| `justify-items` | 컨테이너 | 모든 자식을 각자의 칸 안에서 |
| `justify-self` | 자식 | 그 자식 하나를 자기 칸 안에서 |

### 마지막 카드 하나를 가운데로: 고정 너비 대신 4열

태블릿 limitations에서 Race 카드를 가운데 두려고 `width: 365px; justify-self: center`를 썼더니, 데스크톱까지 고정 너비가 따라갔고 다른 카드와 너비도 달랐습니다. 2열을 4열로 바꾸고 카드가 두 칸씩 차지하게 하면 고정 값 없이 너비가 정확히 맞습니다.

```scss
grid-template-columns: repeat(4, 1fr);
grid-template-areas:
  'gender gender age       age'
  'muscle muscle pregnancy pregnancy'
  '.      race   race      .';
```

### 상위 분기점에서 `grid-template-areas`를 해제한다

태블릿에서 정의한 7행짜리 `grid-template-areas`가 데스크톱에도 그대로 적용됩니다. 데스크톱에서 `grid-template-rows`를 3행으로 줄여도 **영역 정의 때문에 빈 행이 남고, 그 사이에 `row-gap`이 들어가** 섹션 아래에 빈 공간이 생깁니다. 데스크톱 블록에서 `grid-template-areas: none`으로 해제합니다.

## 4. SCSS에서 겪은 문제

### 중첩한 가상 요소에는 `&`

```scss
.c-input {
  ::placeholder { }   // ✗ .c-input ::placeholder  (자손 선택자, 적용 안 됨)
  &::placeholder { }  // ✓ .c-input::placeholder
}
```

`<input>`은 자식이 없으므로 앞쪽은 아무것도 고르지 않습니다. 문법 오류가 아니라 컴파일은 성공합니다. 컴파일된 CSS에서 선택자를 확인하세요.

- Firefox는 placeholder에 기본 투명도를 줍니다. 지정한 색을 그대로 보이게 하려면 `opacity: 1`을 함께 씁니다.
- placeholder는 input의 글꼴을 물려받으므로 크기·굵기를 다시 쓸 필요가 없습니다.

### `url()` 경로는 컴파일된 CSS 기준

CSS는 `dist/css/style.css`로 출력되므로 이미지는 `url('../images/...')`입니다. `../../images/`는 `dist` 바깥을 가리켜 이미지가 표시되지 않았습니다. 폰트(`../fonts/`)와 같은 기준입니다.

### 우선순위 때문에 효과 없는 규칙

`@each`로 만든 `.l-limitations__*`(0,1,0)에 넣은 `display: none`은, 중첩 규칙 `.l-grid--limitations .l-limitations__*`(0,2,0)의 `display: block`에 밀려 효과가 없었습니다. 같은 속성을 여러 곳에서 다루면 우선순위를 먼저 확인합니다.

### `position: absolute`의 기준

`.l-grid--page::before`(히어로 배경)는 `position: absolute`입니다. 부모의 `position: relative`를 없애면 기준이 페이지 컨테이너에서 초기 컨테이닝 블록(뷰포트 크기)으로 바뀌어, `width: 70%`도 뷰포트 기준이 됩니다. 현재는 이 동작을 전제로 합니다.

## 5. BMI 계산 로직

코드: `src/js/main.js`의 `initBmiCalculator()`

### 공식

| 단위 | 키 | 몸무게 | BMI |
| --- | --- | --- | --- |
| Metric | cm ÷ 100 = m | kg | kg ÷ m² |
| Imperial | ft × 12 + in = in | st × 14 + lbs = lbs | 703 × lbs ÷ in² |

- 판정: 18.5 미만 저체중, 25 미만 정상, 30 미만 과체중, 그 이상 비만
- 정상 체중 범위: 같은 키에서 BMI 18.5와 24.9가 되는 몸무게

### 입력 처리 결정

- Imperial의 `in`, `lbs`는 비워 두면 0으로 봅니다(예: 5ft만 입력해도 계산).
- 빈 칸은 미입력(Welcome 상태), 0·음수는 오류 메시지로 구분합니다.
- `type="number"` input은 숫자가 아닌 값을 넣으면 `value`가 `''`가 됩니다. 그래서 "abc"는 오류가 아니라 미입력으로 처리됩니다.
- 폼에 제출 버튼이 없지만 `submit`은 막아 두었습니다(새로고침 방지).

### 갱신 시점 (디바운스)

- 숫자 입력은 마지막 입력 후 `UPDATE_DELAY`(500ms) 뒤에 한 번만 갱신합니다. 결과 `<output>`이 `aria-live` 영역이라, 글자마다 갱신하면 스크린 리더가 매번 읽기 때문입니다.
- 단위 전환은 즉시 갱신하고 대기 중인 갱신은 취소합니다.
- **라디오는 `change`와 함께 `input` 이벤트도 보냅니다.** `input` 처리에서 라디오를 제외하지 않으면 같은 결과가 0.5초 뒤 한 번 더 갱신됩니다.

## 6. 접근성 결정

### 숨긴 라디오의 포커스 표시

라디오는 `u-sr-only`로 숨기고 동그라미는 `::before`로 그립니다. 포커스를 받는 실제 input이 1×1px로 잘려 있어 브라우저 기본 포커스 링이 보이지 않으므로, 보이는 라벨에 표시합니다.

```scss
.c-radio:has(.c-radio__input:focus-visible) {
  outline: 2px solid $blue-500;
  outline-offset: 4px;
}
```

### 그라디언트 위 본문 색 `$grey-600`

`$grey-500`(#5e6e85)은 흰 배경에서는 5.19:1이지만, `$gradient-sky` 시작색 #D6E6FE 위에서는 **4.11:1**로 본문 기준(4.5:1)에 못 미칩니다. 그라디언트 위 본문(hero, tips)에만 `$grey-600`(#566579, 4.70:1)을 씁니다. 디자인 팔레트에 없는 색이므로 디자인 변경 시 함께 확인합니다.

| 조합 | 대비 |
| --- | --- |
| `$grey-500` / 흰색 | 5.19 |
| `$grey-500` / #D6E6FE | 4.11 ✗ |
| `$grey-600` / #D6E6FE | 4.70 |
| 흰색 / `$blue-500` (결과 패널) | 5.10 |
| `$blue-900` / #D6E6FE | 10.11 |

### 긴 제목 줄바꿈

글꼴을 키운 좁은 화면에서 h1의 "Calculator" 한 단어가 열보다 넓어져 계산기까지 밀어냈습니다. `.c-title--hero`에 `overflow-wrap: anywhere`를 줍니다.

## 7. 검증 방법과 환경 메모

### 명령

| 목적 | 명령 |
| --- | --- |
| JS 문법 | `node --check src/js/main.js` |
| SCSS 컴파일만 | `node -e "require('sass').compile('src/scss/style.scss')"` |
| 빌드 | `npm run build` (`dist` 정리 후 재생성) |
| 공백 오류 | `git diff --check` |

`npm test`는 실제 테스트가 없는 placeholder입니다.

### 브라우저 측정

- `npm run dev`는 HTTP 서버를 띄우지 않습니다. `dist`를 정적 서버로 띄워 확인합니다. 이 PC의 `python`은 Microsoft Store 연결용 실행 파일이라 동작하지 않으므로 Node로 띄웁니다.
- `node_modules`에 Playwright가 있어 `channel: 'chrome'`으로 설치된 Chrome을 띄울 수 있습니다. Playwright용 Firefox는 설치되어 있지 않습니다.
- **텍스트 200% 재현**: `html`의 `font-size`가 아니라 브라우저 기본 글꼴 크기를 바꿔야 em 분기점까지 재현됩니다. Chrome 프로필의 `Default/Preferences`에 다음을 넣고 `launchPersistentContext`로 띄웁니다.

  ```json
  { "webkit": { "webprefs": { "default_font_size": 32 } } }
  ```

- **가로 넘침 판정**: `document.scrollingElement.scrollWidth`와 `clientWidth`를 비교하고, 넘치는 요소 중 가장 깊은 요소를 찾아 원인을 좁힙니다.
- 측정 너비: 320(400% 확대 기준), 375, 767/768, 1023/1024, 1100, 1280, 1440px

### 백그라운드 탭에서는 결과가 다르다

Claude in Chrome 확장으로 연 탭이 백그라운드(`document.visibilityState === 'hidden'`)이면:

- `:focus`가 적용되지 않아 포커스 스타일을 측정할 수 없습니다.
- 타이머가 지연되어 디바운스·`setTimeout` 대기가 시간 초과됩니다.
- 스크린샷이 실패할 수 있습니다.

포커스·타이밍 검증은 Playwright로 키보드(`Tab`, 화살표)를 직접 눌러 확인합니다.

## 8. 남은 과제

| 항목 | 내용 |
| --- | --- |
| 텍스트 200% + 320px | 문서 너비 360px로 넘침(hero 영역). 320px 너비(WCAG 1.4.10 Reflow 기준, 기본 글꼴)와 375px 텍스트 200%는 통과. 원인 요소 미확인 |
| Imperial 범위 표기 | 반올림 사용. 마크업 예시 문구(`9st 6lbs - 12st 10lbs`)와 1lb 차이. 디자인 시안(`preview.jpg`)과 대조 필요 |
| 로고 링크 | 이름은 "home"인데 같은 페이지 h1로 이동 |
| 스킵 링크 | `.c-skip-link` CSS만 있고 요소 없음 (한 페이지·반복 메뉴 없음이라 필수 아님) |
| 결과 사진 위치 | 1024px에서 `.l-result__photo` 음수 여백으로 화면 왼쪽 끝에 붙음 |
| 미검증 | Firefox, 모바일 실기기, 스크린 리더, 고대비 모드 |
