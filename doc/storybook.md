# Storybook 사용 안내

원본 HTML은 `src/pages/components`와 `src/pages/index.html`에서 가져옵니다. 중첩 `@@include`는 포함한 파일 기준으로 해석합니다.

## 실행

- `npm ci`: 잠금 파일 기준 의존성 설치
- `npm run storybook`: http://localhost:6006 개발 서버 실행
- `npm run build-storybook`: `storybook-static` 정적 빌드 생성
- `npm run test:storybook`: 설치된 Chrome으로 스토리 및 계산기 동작 검사

Storybook은 Gulp 빌드나 dist에 의존하지 않습니다. 원본 SCSS를 직접 가져오고 이미지와 폰트는 staticDirs로 제공합니다. Storybook 설정 변경 후에는 개발 서버를 재시작하세요.

## 구성

UI Components에는 Calculator, Hero, Result, Tips, Limitations가 있고 Pages/BMI Calculator에는 전체 페이지가 있습니다. 계산기를 포함하는 스토리는 기본 상태, Metric 결과, Imperial 입력, Imperial 결과, 잘못된 입력 상태를 제공합니다. Controls에서 단위와 입력값을 변경할 수 있으며 화면에서도 직접 입력할 수 있습니다.

Docs는 autodocs 태그로 생성합니다. 예시는 iframe에서 렌더링하여 원본 DOM ID가 충돌하지 않도록 합니다. 클래스와 접근성 속성은 원본 마크업을 유지합니다.

실제 페이지와 스토리는 `src/js/bmi-calculator.mjs`의 `initCalculator(root)`를 공유합니다. 각 래퍼 내부에서만 요소를 찾습니다. 전체 페이지는 원본 body를 사용하며 스타일과 계산 로직은 Storybook 설정 및 렌더러에서 연결합니다.

## 검증 범위

자동 검사 대상은 Chrome에서 375, 767, 768, 1023, 1024, 1440px 너비의 렌더링, 가로 넘침, 이미지 로딩, 실행 오류, HTTP 오류, 키보드 단위 전환, BMI 결과, 오류 복구입니다. Firefox, 스크린 리더, 수동 시각 비교 및 접근성 전체 준수는 별도 검증이 필요합니다.

Chromatic 배포는 이번 작업에 포함하지 않습니다.
