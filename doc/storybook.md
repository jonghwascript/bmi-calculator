당신은 시니어 프론트엔드 엔지니어입니다. 현재 바닐라(HTML/CSS/JS) 프로젝트에 Storybook을 초기 구성하고, 특정 컴포넌트의 스토리를 작성한 뒤, Chromatic 배포 파이프라인까지 설정해야 합니다. 아래 단계와 제약 사항에 맞춰 전체 작업 코드와 명령어를 순서대로 제공해 주세요.

1. 프로젝트 환경 및 변수

기술 스택: Vanilla HTML, CSS, JavaScript

타겟 컴포넌트 이름: [컴포넌트_이름_입력 (예: Modal, Accordion)]

전역 CSS 경로: [전역_CSS_경로_입력 (예: ./dist/css/style.css)]

타겟 JS 경로(선택): [JS_로직_경로_입력 (예: ./src/js/modal.js)]

Chromatic 토큰: [발급받은_토큰_입력]

2. 단계별 실행 지시사항

1단계: Storybook 설치 및 초기화

바닐라/HTML 환경에 맞춘 Storybook 최신 버전 설치 명령어를 제시해 주세요.

설치 후 자동 생성되는 src/stories/ 내부의 불필요한 기본 예제 파일(Button, Header, Page 등)의 삭제를 지시해 주세요.

2단계: Storybook 설정 및 전역 스타일 연동

Docs 및 코드 보기 활성화: 기획자 및 리뷰어가 Chromatic 화면에서 HTML 코드를 직접 확인할 수 있도록(.storybook/main.js에서 @storybook/addon-essentials 포함 및 docs: { autodocs: 'tag' } 등의 설정 확인/추가), 관련 설정을 명시해 주세요.

.storybook/preview.js 파일에 위에 명시한 [전역 CSS 경로]를 import하여, 프로젝트 디자인이 Storybook 도화지에 정상적으로 렌더링되도록 구성해 주세요.

3단계: 범용 컴포넌트 스토리 작성 (src/stories/[컴포넌트_이름].stories.js)
하단의 [작업할 컴포넌트 코드]를 분석하여 아래 제약사항을 100% 준수하는 스토리 파일을 작성해 주세요.

컴포넌트 분리 적절성 검토: 코드 작성 전, 제공된 코드가 재사용성, 단일 책임 원칙, 가독성 측면에서 너무 비대하지 않은지 분석해 주세요. 만약 아토믹 디자인 기준 분자(Molecule)나 유기체(Organism) 이상으로 여러 기능이 섞여 있어 분리가 필요해 보인다면, 시니어의 관점에서 어떻게 쪼개면 좋을지 짧게 코멘트해 주세요.

Docs 태그 추가 (필수): Chromatic 배포 시 'Docs' 탭과 'Show Code' 기능이 노출되도록 메타데이터(default export)에 tags: ['autodocs'] 속성을 반드시 포함할 것.

DOM 요소 반환 (필수): 단순 HTML 문자열 반환이 아닌, document.createElement()로 래퍼(Wrapper)를 생성하여 HTML을 주입한 뒤, 실제 DOM 요소 자체를 반환하는 구조로 작성할 것.

JS 로직 연동 (필수): 바닐라 환경에서 UI가 실제 동작(클릭, 토글 등)하도록 JS를 반드시 연결할 것. [타겟 JS 경로]가 제공되었다면 해당 모듈을 import하여 렌더링된 래퍼 요소에 적용하는 방식으로 작성하고, 그렇지 않다면 render 함수 내부에서 .querySelector()와 addEventListener를 직접 작성해 100% 동작 가능한 상태로 구현할 것.

마크업 보존: 제공된 코드의 BEM 클래스명 및 웹 접근성(A11y) 속성(aria-*, role 등)은 절대 임의로 축약하거나 누락하지 말 것.

Controls 세팅: Storybook 하단 패널(Controls)에서 조작 가능한 상태값(argTypes, args)을 적절히 구성할 것.

4단계: 배포 파이프라인 (Chromatic)

chromatic 개발 의존성 패키지 설치 명령어를 제시해 주세요.

package.json의 scripts에 다음 세 가지 명령어가 포함되도록 구성해 주세요:

"storybook": 로컬 개발 서버 실행

"build-storybook": 정적 빌드

"chromatic": 크로마틱 배포 (npx chromatic --project-token=...)

.gitignore 파일에 빌드 결과물인 storybook-static이 포함되도록 확인해 주세요.

3. 작업할 컴포넌트 코드
[여기에 작업할 컴포넌트의 HTML 코드 붙여넣기]
[여기에 작업할 컴포넌트의 JS 코드 붙여넣기 (있을 경우)]

### 주의사항
Storybook 설정에서 Docs(자동 문서화) 기능을 켜고 다시 Chromatic에 배포해 

## 전역 스타일 및 실시간 변경 반영
- SCSS를 사용하는 프로젝트는 빌드 결과물(dist/css/style.css)이 아닌 원본 SCSS 진입 파일(src/scss/style.scss)을 .storybook/preview.js에서 직접 import할 것.
- @storybook/html-vite와 sass 개발 의존성을 사용하여, Gulp를 별도로 실행하지 않아도 SCSS 및 하위 partial 파일의 변경이 Storybook에 즉시 반영되도록 구성할 것.
- 이미지·폰트는 .storybook/main.js의 staticDirs를 통해 원본 src 디렉터리에서 제공하고, SCSS 내부의 상대 경로도 정상 해석되는지 확인할 것.
- Storybook 실행·빌드가 dist 생성에 의존하지 않도록 불필요한 Gulp 사전 빌드 스크립트를 제거할 것. 기존 홈페이지용 Gulp 작업은 유지할 것.
- 모든 컴포넌트 스토리와 Docs에서 전역 스타일이 적용되는지 확인하고, 정적 빌드에도 CSS·이미지·폰트가 포함되는지 검증할 것.
- Storybook 설정 변경 후에는 개발 서버를 재시작해야 한다는 안내를 포함할 것.