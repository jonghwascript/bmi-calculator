# The A11Y Project 접근성 체크리스트 (한국어)

> 출처: [The A11Y Project — Checklist](https://www.a11yproject.com/checklist/)
> WCAG 2.2의 A·AA 수준을 주로 다루는 요약 체크리스트입니다. 모든 접근성 이슈를 다루지는 않으며, 이 항목을 모두 지킨다고 해서 "100% 접근성"이 보장되지는 않습니다.

총 64개 항목 / 16개 분류

## 목차

- [콘텐츠 (Content)](#콘텐츠-content) (3)
- [전역 코드 (Global code)](#전역-코드-global-code) (9)
- [키보드 (Keyboard)](#키보드-keyboard) (3)
- [이미지 (Images)](#이미지-images) (4)
- [제목 (Headings)](#제목-headings) (4)
- [목록 (Lists)](#목록-lists) (1)
- [컨트롤 (Controls)](#컨트롤-controls) (6)
- [표 (Tables)](#표-tables) (3)
- [폼 (Forms)](#폼-forms) (6)
- [미디어 (Media)](#미디어-media) (3)
- [비디오 (Video)](#비디오-video) (2)
- [오디오 (Audio)](#오디오-audio) (1)
- [화면 표현 (Appearance)](#화면-표현-appearance) (6)
- [애니메이션 (Animation)](#애니메이션-animation) (3)
- [색 대비 (Color contrast)](#색-대비-color-contrast) (6)
- [모바일과 터치 (Mobile and touch)](#모바일과-터치-mobile-and-touch) (4)

---

## 콘텐츠 (Content)

콘텐츠는 사이트에서 가장 중요한 부분입니다.

- [ ] **쉬운 표현을 쓰고, 비유·관용구·복잡한 은유는 피한다.**
  - WCAG: [3.1.5 Reading Level](https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html)
  - [중학교 2학년 수준의 읽기 난이도](https://datayze.com/readability-analyzer.php)로 작성하세요.
  - 원문: "Use plain language and avoid figures of speech, idioms, and complicated metaphors." · [링크](https://www.a11yproject.com/checklist/#use-plain-language-and-avoid-figures-of-speech-idioms-and-complicated-metaphors)
- [ ] **`button`, `a`, `label` 요소의 내용은 고유하고 설명적으로 작성한다.**
  - WCAG: [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
  - "여기를 클릭", "더 보기" 같은 표현은 아무 맥락도 주지 못합니다. 어떤 사용자는 페이지의 버튼·링크 목록만 뽑아서 탐색하는데, 이때 그 텍스트만으로 이동하거나 실행했을 때 무슨 일이 일어나는지 알 수 있어야 합니다.
  - 원문: "Make sure that `button`, `a`, and `label` element content is unique and descriptive." · [링크](https://www.a11yproject.com/checklist/#make-sure-that-button-a-and-label-element-content-is-unique-and-descriptive)
- [ ] **좌횡서(LTR) 언어는 왼쪽 정렬, 우횡서(RTL) 언어는 오른쪽 정렬을 사용한다.**
  - WCAG: [1.4.8 Visual Presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
  - 가운데 정렬이나 양쪽 정렬된 텍스트는 읽기 어렵습니다.
  - 원문: "Use left-aligned text for left-to-right (LTR) languages, and right-aligned text for right-to-left (RTL) languages." · [링크](https://www.a11yproject.com/checklist/#use-left-aligned-text-for-left-to-right-ltr-languages-and-right-aligned-text-for-right-to-left-rtl-languages)

## 전역 코드 (Global code)

전역 코드는 웹사이트나 웹앱 전체에 영향을 주는 코드입니다.

- [ ] **HTML의 유효성을 검사한다.**
  - WCAG: [4.1.1 Parsing](https://www.w3.org/WAI/WCAG22/Understanding/parsing.html)
  - [유효한 HTML](https://validator.w3.org/nu/)은 모든 브라우저와 보조 기술에서 일관되고 예측 가능한 경험을 제공하는 데 도움이 됩니다.
  - 원문: "Validate your HTML." · [링크](https://www.a11yproject.com/checklist/#validate-your-html)
- [ ] **`html` 요소에 `lang` 속성을 지정한다.**
  - WCAG: [3.1.1 Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)
  - 스크린 리더 같은 보조 기술이 [콘텐츠를 올바르게 발음](https://github.com/FreedomScientific/VFO-standards-support/issues/188)하는 데 도움이 됩니다.
  - 원문: "Use a `lang` attribute on the `html` element." · [링크](https://www.a11yproject.com/checklist/#use-a-lang-attribute-on-the-html-element)
- [ ] **페이지나 화면마다 고유한 `title`을 제공한다.**
  - WCAG: [2.4.2 Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html)
  - 문서의 `head` 안에 있는 `title` 요소는 보조 기술이 가장 먼저 읽어주는 정보인 경우가 많습니다. 이제부터 탐색할 페이지가 어떤 페이지인지 알려줍니다.
  - 원문: "Provide a unique `title` for each page or view." · [링크](https://www.a11yproject.com/checklist/#provide-a-unique-title-for-each-page-or-view)
- [ ] **뷰포트 확대(zoom)를 막지 않는다.**
  - WCAG: [1.4.4 Resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
  - 어떤 사람은 읽을 수 있을 만큼 글자를 키워야 합니다. 네이티브 앱 같은 경험을 주는 웹앱이라도 이를 막아서는 안 됩니다. 네이티브 앱조차 OS의 텍스트 크기 설정을 따라야 합니다.
  - 원문: "Ensure that viewport zoom is not disabled." · [링크](https://www.a11yproject.com/checklist/#ensure-that-viewport-zoom-is-not-disabled)
- [ ] **중요한 콘텐츠 영역은 랜드마크 요소로 표시한다.**
  - WCAG: [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
  - [랜드마크 영역](https://www.w3.org/TR/wai-aria-practices/examples/landmarks/HTML5.html)은 페이지의 레이아웃과 주요 영역을 전달하고, 그 영역으로 빠르게 이동할 수 있게 해줍니다. 예를 들어 사이트 내비게이션은 `nav`로 감싸고, 페이지의 주요 콘텐츠는 `main`에 담습니다.
  - 원문: "Use landmark elements to indicate important content regions." · [링크](https://www.a11yproject.com/checklist/#use-landmark-elements-to-indicate-important-content-regions)
- [ ] **콘텐츠 흐름을 선형으로 유지한다.**
  - WCAG: [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
  - `0`이나 `-1`이 아닌 `tabindex` 값은 제거하세요. 링크나 `button`처럼 원래 포커스를 받을 수 있는 요소에는 `tabindex`가 필요 없습니다. 원래 포커스를 받지 못하는 요소에는 아주 특수한 경우가 아니면 `tabindex`를 붙이지 마세요.
  - 원문: "Ensure a linear content flow." · [링크](https://www.a11yproject.com/checklist/#ensure-a-linear-content-flow)
- [ ] **`autofocus` 속성 사용을 피한다.**
  - WCAG: [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
  - 시각장애인이나 저시력 사용자는 동의 없이 포커스가 옮겨지면 방향 감각을 잃을 수 있습니다. 또한 운동 조절에 어려움이 있는 사용자에게는 자동 포커스된 영역을 빠져나와 다른 곳으로 이동하는 추가 작업이 생기므로 부담이 됩니다.
  - 원문: "Avoid using the `autofocus` attribute." · [링크](https://www.a11yproject.com/checklist/#avoid-using-the-autofocus-attribute)
- [ ] **세션 타임아웃을 연장할 수 있게 한다.**
  - WCAG: [2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)
  - 세션 타임아웃을 아예 없앨 수 없다면, 종료되기 훨씬 전에 사용자가 쉽게 끄거나 조정하거나 연장할 수 있게 해주세요.
  - 원문: "Allow extending session timeouts." · [링크](https://www.a11yproject.com/checklist/#allow-extending-session-timeouts)
- [ ] **`title` 속성 툴팁을 제거한다.**
  - WCAG: [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
  - [`title` 속성에는 여러 문제가 있어](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title#Accessibility_concerns) 모든 사용자가 접근해야 하는 중요한 정보에는 쓰면 안 됩니다. 허용할 만한 용도는 `iframe` 요소에 어떤 콘텐츠가 들어있는지 레이블을 붙이는 정도입니다.
  - 원문: "Remove `title` attribute tooltips." · [링크](https://www.a11yproject.com/checklist/#remove-title-attribute-tooltips)

## 키보드 (Keyboard)

인터페이스와 콘텐츠는 키보드만으로 조작하고 탐색할 수 있어야 합니다. 마우스를 쓸 수 없는 사람도 있고, 호버나 정밀한 클릭이 불가능한 보조 기술을 쓰는 사람도 있습니다.

- [ ] **키보드로 이동하는 인터랙티브 요소에 눈에 보이는 포커스 스타일을 제공한다.**
  - WCAG: [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
  - 키보드, [스위치](https://axesslab.com/switches/), 음성 제어, 스크린 리더로 탐색하는 사람이 지금 페이지의 어디에 있는지 알 수 있나요?
  - 원문: "Make sure there is a visible focus style for interactive elements that are navigated to via keyboard input." · [링크](https://www.a11yproject.com/checklist/#make-sure-there-is-a-visible-focus-style-for-interactive-elements-that-are-navigated-to-via-keyboard-input)
- [ ] **키보드 포커스 순서가 시각적 레이아웃과 일치하는지 확인한다.**
  - WCAG: [1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)
  - 키보드나 스크린 리더로 탐색하는 사람이 예측 가능한 방식으로 페이지를 이동할 수 있나요?
  - 원문: "Check to see that keyboard focus order matches the visual layout." · [링크](https://www.a11yproject.com/checklist/#check-to-see-that-keyboard-focus-order-matches-the-visual-layout)
- [ ] **보이지 않는데 포커스를 받는 요소를 제거한다.**
  - WCAG: [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
  - 지금 발견되어서는 안 되는 요소는 포커스를 받지 못하게 하세요. 닫혀 있는 드롭다운 메뉴, 화면 밖의 내비게이션, 비활성 모달 등이 여기 해당합니다.
  - 원문: "Remove invisible focusable elements." · [링크](https://www.a11yproject.com/checklist/#remove-invisible-focusable-elements)

## 이미지 (Images)

이미지는 대부분의 웹사이트에서 흔한 요소입니다. 모든 사람이 즐길 수 있게 하세요.

- [ ] **모든 `img` 요소에 `alt` 속성을 넣는다.**
  - WCAG: [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
  - `alt` 속성(대체 텍스트)은 이미지를 볼 수 없는 사람에게 이미지 설명을 제공합니다. `alt`가 없으면 스크린 리더가 이미지의 파일명과 경로를 대신 읽어주는데, 이는 이미지의 내용을 전달하지 못합니다.
  - 원문: "Make sure that all `img` elements have an `alt` attribute." · [링크](https://www.a11yproject.com/checklist/#make-sure-that-all-img-elements-have-an-alt-attribute)
- [ ] **장식용 이미지에는 빈 `alt` 값(null alt)을 사용한다.**
  - WCAG: [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
  - null `alt`는 빈 `alt`라고도 하며, `alt` 속성의 따옴표 사이에 아무 내용도 넣지 않은 것입니다. 장식용 이미지는 사이트의 전체 의미를 이해하는 데 필요한 정보를 전달하지 않습니다. 과거에는 장식이나 [스페이서 GIF](https://en.wikipedia.org/wiki/Spacer_GIF)에 쓰였지만, 요즘 웹사이트·웹앱에서는 드뭅니다.
  - 원문: "Make sure that decorative images use null `alt` (empty) attribute values." · [링크](https://www.a11yproject.com/checklist/#make-sure-that-decorative-images-use-null-alt-empty-attribute-values)
- [ ] **차트, 그래프, 지도 같은 복잡한 이미지에는 텍스트 대체 수단을 제공한다.**
  - WCAG: [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
  - 지도의 지점이나 순서도의 각 단계를 나열한 일반 텍스트가 있나요? 눈에 보이는 정보를 모두 설명하세요. 그래프 축, 데이터 포인트와 레이블, 그리고 그 그래픽이 전달하려는 전체 요지까지 포함합니다.
  - 원문: "Provide a text alternative for complex images such as charts, graphs, and maps." · [링크](https://www.a11yproject.com/checklist/#provide-a-text-alternative-for-complex-images-such-as-charts-graphs-and-maps)
- [ ] **텍스트가 포함된 이미지는 대체 텍스트에 그 텍스트를 포함시킨다.**
  - WCAG: [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
  - 예를 들어 FedEx 로고의 `alt` 값은 "FedEx"여야 합니다.
  - 원문: "For images containing text, make sure the alt description includes the image's text." · [링크](https://www.a11yproject.com/checklist/#for-images-containing-text-make-sure-the-alt-description-includes-the-images-text)

## 제목 (Headings)

제목 요소(h1, h2, h3 등)는 페이지 콘텐츠를 관련 있는 "덩어리"로 나눠줍니다. 보조 기술 사용자가 페이지의 의미를 이해하는 데 대단히 중요합니다.

- [ ] **콘텐츠를 소개할 때 제목 요소를 사용한다.**
  - WCAG: [2.4.6 Headings or Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)
  - 제목 요소는 문서 개요를 구성합니다. 순수하게 시각적 디자인 목적으로 쓰면 안 됩니다.
  - 원문: "Use heading elements to introduce content." · [링크](https://www.a11yproject.com/checklist/#use-heading-elements-to-introduce-content)
- [ ] **페이지(또는 화면)당 `h1` 요소는 하나만 사용한다.**
  - WCAG: [2.4.6 Headings or Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)
  - `h1`은 그 페이지의 최상위 목적을 전달해야 합니다. 페이지마다 바뀌지 않는 제목(예: 사이트 이름)에는 `h1`을 쓰지 마세요.
  - 원문: "Use only one `h1` element per page or view." · [링크](https://www.a11yproject.com/checklist/#use-only-one-h1-element-per-page-or-view)
- [ ] **제목 요소는 논리적인 순서로 작성한다.**
  - WCAG: [2.4.6 Headings or Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)
  - [제목 요소의 순서](https://webdesign.tutsplus.com/articles/the-importance-of-heading-levels-for-assistive-technology--cms-31753)는 콘텐츠의 "깊이"에 따라 내려가야 합니다. 예를 들어 첫 `h3`이 나오기 전에 `h4`가 등장해서는 안 됩니다. [headingsMap](https://www.a11yproject.com/resources/#headingsmap) 같은 도구로 점검할 수 있습니다.
  - 원문: "Heading elements should be written in a logical sequence." · [링크](https://www.a11yproject.com/checklist/#heading-elements-should-be-written-in-a-logical-sequence)
- [ ] **제목 레벨을 건너뛰지 않는다.**
  - WCAG: [2.4.6 Headings or Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)
  - 예를 들어 `h3`을 건너뛰고 `h2`에서 `h4`로 가지 마세요. 특정 시각 효과 때문에 레벨을 건너뛰고 있다면, 대신 CSS 클래스를 사용하세요.
  - 원문: "Don't skip heading levels." · [링크](https://www.a11yproject.com/checklist/#dont-skip-heading-levels)

## 목록 (Lists)

목록 요소는 항목들이 서로 관련되어 있는지, 순서가 있는지, 몇 개가 있는지를 알려줍니다.

- [ ] **목록 성격의 콘텐츠에는 목록 요소(`ol`, `ul`, `dl`)를 사용한다.**
  - WCAG: [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
  - 관련된 콘텐츠 묶음, 그리드 형태로 나열된 항목, 나란히 놓인 `a` 요소들이 여기 해당할 수 있습니다.
  - 원문: "Use list elements (`ol`, `ul`, and `dl` elements) for list content." · [링크](https://www.a11yproject.com/checklist/#use-list-elements-ol-ul-and-dl-elements-for-list-content)

## 컨트롤 (Controls)

컨트롤은 링크·버튼처럼 어딘가로 이동하거나 동작을 수행하게 하는 인터랙티브 요소입니다.

- [ ] **링크에는 `a` 요소를 사용한다.**
  - WCAG: [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
  - 링크에는 SPA에서도 항상 `href` 속성이 있어야 합니다. `href`가 없으면 보조 기술에 링크로 제대로 노출되지 않습니다. `href` 대신 `onclick` 이벤트만 쓴 링크가 대표적인 나쁜 예입니다.
  - 원문: "Use the `a` element for links." · [링크](https://www.a11yproject.com/checklist/#use-the-a-element-for-links)
- [ ] **링크가 링크로 인식되게 한다.**
  - WCAG: [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
  - 색만으로는 링크임을 나타내기에 충분하지 않습니다. 밑줄은 널리 쓰이고 누구나 이해하는 링크 표시 방법입니다.
  - 원문: "Ensure that links are recognizable as links." · [링크](https://www.a11yproject.com/checklist/#ensure-that-links-are-recognizable-as-links)
- [ ] **컨트롤에 `:focus` 상태를 제공한다.**
  - WCAG: [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
  - 눈에 보이는 포커스 스타일은 어떤 인터랙티브 요소에 키보드 포커스가 있는지 알려줍니다. 그래야 버튼을 누르거나 링크로 이동할 수 있다는 것을 알 수 있습니다.
  - 원문: "Ensure that controls have `:focus` states." · [링크](https://www.a11yproject.com/checklist/#ensure-that-controls-have-focus-states)
- [ ] **버튼에는 `button` 요소를 사용한다.**
  - WCAG: [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
  - 버튼은 데이터를 전송하거나, 키보드 포커스를 이동시키지 않는 화면 내 동작을 수행할 때 씁니다. `type="button"`을 지정하면 클릭 시 브라우저가 폼을 전송하려는 동작을 막을 수 있습니다.
  - 원문: "Use the `button` element for buttons." · [링크](https://www.a11yproject.com/checklist/#use-the-button-element-for-buttons)
- [ ] **스킵 링크를 제공하고, 포커스되면 보이도록 한다.**
  - WCAG: [2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
  - [스킵 링크](https://www.a11yproject.com/posts/skip-nav-links/)는 페이지의 본문으로 빠르게 이동하게 해줍니다. 사이트 주 내비게이션이나 항상 붙어 있는 검색 위젯처럼 모든 페이지에 반복되는 콘텐츠를 건너뛸 수 있습니다.
  - 원문: "Provide a skip link and make sure that it is visible when focused." · [링크](https://www.a11yproject.com/checklist/#provide-a-skip-link-and-make-sure-that-it-is-visible-when-focused)
- [ ] **새 탭이나 새 창에서 열리는 링크는 그 사실을 알린다.**
  - WCAG: [G201: Giving users advanced warning when opening a new window](https://www.w3.org/WAI/WCAG22/Techniques/general/G201)
  - 가급적 새 탭·창으로 열리는 링크는 피하세요. 꼭 필요하다면 그 동작을 모든 사용자가 알 수 있게 전달해, 링크를 누르기 전에 무슨 일이 일어날지 알 수 있게 하세요. 준수 요건은 아니지만 여러 보조 기술 사용자가 자주 불만을 제기하는 부분입니다.
  - 원문: "Identify links that open in a new tab or window." · [링크](https://www.a11yproject.com/checklist/#identify-links-that-open-in-a-new-tab-or-window)

## 표 (Tables)

표는 서로 다른 정보 사이의 관계를 이해하도록 돕는 구조화된 데이터 집합입니다.

- [ ] **표 형태의 데이터는 `table` 요소로 표현한다.**
  - WCAG: [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
  - 데이터를 행과 열로 보여줘야 하나요? 그렇다면 `table` 요소를 쓰세요.
  - 원문: "Use the `table` element to describe tabular data." · [링크](https://www.a11yproject.com/checklist/#use-the-table-element-to-describe-tabular-data)
- [ ] **표 헤더에는 `th` 요소를 사용하고, 적절한 `scope` 속성을 지정한다.**
  - WCAG: [4.1.1 Parsing](https://www.w3.org/WAI/WCAG22/Understanding/parsing.html)
  - [표의 복잡도](https://www.w3.org/WAI/tutorials/tables/)에 따라 열 헤더에는 `scope="col"`, 행 헤더에는 `scope="row"`를 쓰는 것도 고려하세요. 여전히 많은 보조 기술이 `scope` 속성으로 표 구조를 파악하고 설명합니다.
  - 원문: "Use the `th` element for table headers (with appropriate `scope` attributes)." · [링크](https://www.a11yproject.com/checklist/#use-the-th-element-for-table-headers-with-appropriate-scope-attributes)
- [ ] **표의 제목은 `caption` 요소로 제공한다.**
  - WCAG: [2.4.6 Headings or Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)
  - `caption`은 그 표가 어떤 정보를 담고 있는지 설명해야 합니다.
  - 원문: "Use the `caption` element to provide a title for the table." · [링크](https://www.a11yproject.com/checklist/#use-the-caption-element-to-provide-a-title-for-the-table)

## 폼 (Forms)

폼은 사용자가 정보를 입력해 처리하게 해줍니다. 메시지 전송이나 주문 같은 것이 여기 포함됩니다.

- [ ] **폼의 모든 입력 요소를 대응하는 `label` 요소와 연결한다.**
  - WCAG: [3.2.2 On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html)
  - `for`/`id` 짝을 사용하면 브라우저와 보조 기술에서 가장 높은 수준의 지원을 보장할 수 있습니다.
  - 원문: "All inputs in a form are associated with a corresponding `label` element." · [링크](https://www.a11yproject.com/checklist/#all-inputs-in-a-form-are-associated-with-a-corresponding-label-element)
- [ ] **필요한 곳에 `fieldset`과 `legend` 요소를 사용한다.**
  - WCAG: [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
  - 폼에 관련 입력 요소가 여러 묶음으로 나뉘어 있나요? `fieldset`으로 묶고, `legend`로 그 묶음이 무엇을 위한 것인지 레이블을 붙이세요.
  - 원문: "Use `fieldset` and `legend` elements where appropriate." · [링크](https://www.a11yproject.com/checklist/#use-fieldset-and-legend-elements-where-appropriate)
- [ ] **적절한 입력 요소에 `autocomplete`를 사용한다.**
  - WCAG: [1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
  - 이름, 주소, 전화번호처럼 흔히 요구되는 정보를 더 빠르고 쉽고 정확하게 채울 수 있는 [수단을 제공](https://www.w3.org/TR/html52/sec-forms.html#sec-autofill)하세요.
  - 원문: "Inputs use `autocomplete` where appropriate." · [링크](https://www.a11yproject.com/checklist/#inputs-use-autocomplete-where-appropriate)
- [ ] **폼 제출 후 입력 오류를 폼 위쪽에 목록으로 보여준다.**
  - WCAG: [3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
  - 보조 기술 사용자가 폼에 어떤 문제가 있는지 한눈에 파악할 수 있게 해줍니다. 입력 요소가 많은 큰 폼일수록 중요합니다. 각 오류 항목에서 해당 입력 필드로 이동하는 링크도 함께 제공하세요.
  - 원문: "Make sure that form input errors are displayed in list above the form after submission." · [링크](https://www.a11yproject.com/checklist/#make-sure-that-form-input-errors-are-displayed-in-list-above-the-form-after-submission)
- [ ] **오류 메시지를 해당 입력 요소와 연결한다.**
  - WCAG: [3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
  - [`aria-describedby` 사용](https://developer.paciellogroup.com/blog/2018/09/describing-aria-describedby/) 같은 기법을 쓰면 보조 기술 사용자가 입력 요소와 그에 연결된 오류 메시지의 관계를 쉽게 이해할 수 있습니다.
  - 원문: "Associate input error messaging with the input it corresponds to." · [링크](https://www.a11yproject.com/checklist/#associate-input-error-messaging-with-the-input-it-corresponds-to)
- [ ] **오류·경고·성공 상태를 색만으로 표시하지 않는다.**
  - WCAG: [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
  - 색각 이상이 있거나 저시력인 사람, 색에 대한 문화적 인식이 다른 사람은 색만으로는 상태 변화를 보지 못하거나 그 의미를 이해하지 못할 수 있습니다.
  - 원문: "Make sure that error, warning, and success states are not visually communicated by just color." · [링크](https://www.a11yproject.com/checklist/#make-sure-that-error-warning-and-success-states-are-not-visually-communicated-by-just-color)

## 미디어 (Media)

미디어에는 녹화·녹음된 영상과 음성, 라이브 영상과 음성이 포함됩니다.

- [ ] **미디어가 자동 재생되지 않게 한다.**
  - WCAG: [1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html)
  - 예상치 못한 영상과 소리는 주의를 흩뜨리고 방해가 되며, 특히 ADHD 같은 인지적 장애가 있는 경우 더 그렇습니다. 어떤 자동 재생 영상과 애니메이션은 전정기관 장애나 발작의 유발 요인이 될 수 있습니다.
  - 원문: "Make sure that media does not autoplay." · [링크](https://www.a11yproject.com/checklist/#make-sure-that-media-does-not-autoplay)
- [ ] **미디어 컨트롤에 적절한 마크업을 사용한다.**
  - WCAG: [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
  - 예를 들어 음소거 버튼이 활성화되었을 때 [눌림 토글 상태](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-pressed)를 갖게 하거나, 볼륨 슬라이더에 `<input type="range">`를 쓰는 것입니다.
  - 원문: "Ensure that media controls use appropriate markup." · [링크](https://www.a11yproject.com/checklist/#ensure-that-media-controls-use-appropriate-markup)
- [ ] **모든 미디어를 일시정지할 수 있는지 확인한다.**
  - WCAG: [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
  - 모든 미디어 요소에 전역 일시정지 기능을 제공하세요. 키보드가 있는 기기라면 Space 키로 재생을 멈출 수 있어야 합니다. 단, 폼 컨트롤에 포커스가 없을 때 Space 키가 페이지를 스크롤하는 기본 동작을 방해하지 않도록 하세요.
  - 원문: "Check to see that all media can be paused." · [링크](https://www.a11yproject.com/checklist/#check-to-see-that-all-media-can-be-paused)

## 비디오 (Video)

비디오에 한정된 점검 항목입니다.

- [ ] **자막이 있는지 확인한다.**
  - WCAG: [1.2.2 Captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html)
  - 자막이 있으면 영상의 소리를 들을 수 없는 사람도 내용을 이해할 수 있습니다.
  - 원문: "Confirm the presence of captions." · [링크](https://www.a11yproject.com/checklist/#confirm-the-presence-of-captions)
- [ ] **발작 유발 요소를 제거한다.**
  - WCAG: [2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
  - 특정한 섬광이나 깜빡임 애니메이션은 발작을 유발합니다.
  - 원문: "Remove seizure triggers." · [링크](https://www.a11yproject.com/checklist/#remove-seizure-triggers)

## 오디오 (Audio)

오디오에 한정된 점검 항목입니다.

- [ ] **대본(transcript)이 제공되는지 확인한다.**
  - WCAG: [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
  - 대본이 있으면 들을 수 없는 사람도 음성 콘텐츠를 이해할 수 있습니다. 또한 자신에게 편한 속도로 내용을 소화할 수 있게 해줍니다.
  - 원문: "Confirm that transcripts are available." · [링크](https://www.a11yproject.com/checklist/#confirm-that-transcripts-are-available)

## 화면 표현 (Appearance)

여러 상황에서 콘텐츠가 어떻게 보이는지에 관한 항목입니다.

- [ ] **특수 브라우징 모드에서 콘텐츠를 확인한다.**
  - WCAG: [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
  - [Windows 고대비 모드나 색 반전](https://www.a11yproject.com/posts/operating-system-and-browser-accessibility-display-modes/) 같은 모드를 켜보세요. 콘텐츠가 여전히 읽히나요? 아이콘, 테두리, 링크, 폼 필드 같은 요소가 그대로 보이나요? 전경과 배경을 구분할 수 있나요?
  - 원문: "Check your content in specialized browsing modes." · [링크](https://www.a11yproject.com/checklist/#check-your-content-in-specialized-browsing-modes)
- [ ] **텍스트 크기를 200%로 키워본다.**
  - WCAG: [1.4.4 Resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
  - 콘텐츠를 여전히 읽을 수 있나요? 글자를 키웠을 때 콘텐츠가 서로 겹치지는 않나요?
  - 원문: "Increase text size to 200%." · [링크](https://www.a11yproject.com/checklist/#increase-text-size-to-200percent)
- [ ] **콘텐츠 사이의 적절한 근접성이 유지되는지 재확인한다.**
  - WCAG: [1.3.3 Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html)
  - [빨대 테스트](https://scottvinkle.com/blogs/work/proximity-and-zoom)로, 화면 확대 소프트웨어를 쓰는 사람도 모든 콘텐츠를 쉽게 찾을 수 있는지 확인하세요.
  - 원문: "Double-check that good proximity between content is maintained." · [링크](https://www.a11yproject.com/checklist/#double-check-that-good-proximity-between-content-is-maintained)
- [ ] **정보를 색만으로 전달하지 않는다.**
  - WCAG: [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
  - 전부 흑백으로 바꿔도 본문 속 링크가 어디 있는지 알 수 있나요?
  - 원문: "Make sure color isn't the only way information is conveyed." · [링크](https://www.a11yproject.com/checklist/#make-sure-color-isnt-the-only-way-information-is-conveyed)
- [ ] **안내를 시각 정보나 소리에만 의존하지 않는다.**
  - WCAG: [1.3.3 Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html)
  - "오른쪽에 있는" 같은 위치나 "신호음이 울린 뒤" 같은 소리 설명에만 기대지 말고, 실제 영역 이름과 요소 이름을 함께 써서 안내하세요.
  - 원문: "Make sure instructions are not visual or audio-only." · [링크](https://www.a11yproject.com/checklist/#make-sure-instructions-are-not-visual-or-audio-only)
- [ ] **단순하고 명확하며 일관된 레이아웃을 사용한다.**
  - WCAG: [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
  - 복잡한 레이아웃은 이해하기도 쓰기도 어렵습니다.
  - 원문: "Use a simple, straightforward, and consistent layout." · [링크](https://www.a11yproject.com/checklist/#use-a-simple-straightforward-and-consistent-layout)

## 애니메이션 (Animation)

스스로 움직이거나, 사용자가 컨트롤을 조작했을 때 움직이는 콘텐츠입니다.

- [ ] **애니메이션은 은은하게 만들고, 과도하게 깜빡이지 않게 한다.**
  - WCAG: [2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
  - 특정한 섬광이나 깜빡임 애니메이션은 발작을 유발합니다. 그 외의 경우에도 주의를 흩뜨리고 방해가 되며, 특히 ADHD 같은 인지적 장애가 있는 경우 더 그렇습니다.
  - 원문: "Ensure animations are subtle and do not flash too much." · [링크](https://www.a11yproject.com/checklist/#ensure-animations-are-subtle-and-do-not-flash-too-much)
- [ ] **배경 영상을 일시정지할 수단을 제공한다.**
  - WCAG: [2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  - 배경 영상은 주의를 흩뜨립니다. 그 위에 콘텐츠를 얹었다면 더욱 그렇습니다.
  - 원문: "Provide a mechanism to pause background video." · [링크](https://www.a11yproject.com/checklist/#provide-a-mechanism-to-pause-background-video)
- [ ] **모든 애니메이션이 `prefers-reduced-motion` 미디어 쿼리를 따르게 한다.**
  - WCAG: [2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
  - "동작 줄이기" 설정이 켜져 있으면 애니메이션을 제거하세요. 개념 전달에 애니메이션이 꼭 필요하다면 재생 시간을 늦추세요.
  - 원문: "Make sure all animation obeys the `prefers-reduced-motion` media query." · [링크](https://www.a11yproject.com/checklist/#make-sure-all-animation-obeys-the-prefers-reduced-motion-media-query)

## 색 대비 (Color contrast)

[색 대비](https://www.a11yproject.com/posts/what-is-color-contrast/)는 색들이 나란히 또는 겹쳐 놓였을 때 얼마나 잘 읽히는지를 말합니다.

- [ ] **일반 크기 텍스트의 대비를 확인한다.**
  - WCAG: [1.4.3 Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  - AA 수준을 충족하려면 대비비 4.5:1이 필요합니다.
  - 원문: "Check the contrast for all normal-sized text." · [링크](https://www.a11yproject.com/checklist/#check-the-contrast-for-all-normal-sized-text)
- [ ] **큰 크기 텍스트의 대비를 확인한다.**
  - WCAG: [1.4.3 Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  - AA 수준을 충족하려면 대비비 3:1이 필요합니다.
  - 원문: "Check the contrast for all large-sized text." · [링크](https://www.a11yproject.com/checklist/#check-the-contrast-for-all-large-sized-text)
- [ ] **모든 아이콘의 대비를 확인한다.**
  - WCAG: [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
  - AA 수준을 충족하려면 대비비 3.0:1이 필요합니다.
  - 원문: "Check the contrast for all icons." · [링크](https://www.a11yproject.com/checklist/#check-the-contrast-for-all-icons)
- [ ] **입력 요소(텍스트 입력, 라디오 버튼, 체크박스 등) 테두리의 대비를 확인한다.**
  - WCAG: [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
  - AA 수준을 충족하려면 대비비 3.0:1이 필요합니다.
  - 원문: "Check the contrast of borders for input elements (text input, radio buttons, checkboxes, etc.)." · [링크](https://www.a11yproject.com/checklist/#check-the-contrast-of-borders-for-input-elements-text-input-radio-buttons-checkboxes-etc)
- [ ] **이미지나 영상 위에 겹친 텍스트를 확인한다.**
  - WCAG: [1.4.3 Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  - 텍스트를 여전히 읽을 수 있나요?
  - 원문: "Check text that overlaps images or video." · [링크](https://www.a11yproject.com/checklist/#check-text-that-overlaps-images-or-video)
- [ ] **커스텀 `::selection` 색을 확인한다.**
  - WCAG: [1.4.3 Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  - [`::selection` CSS 선언](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection)에 지정한 색 대비가 충분한가요? 그렇지 않으면 텍스트를 드래그해 선택했을 때 읽지 못하는 사람이 생길 수 있습니다.
  - 원문: "Check custom `::selection` colors." · [링크](https://www.a11yproject.com/checklist/#check-custom-selection-colors)

## 모바일과 터치 (Mobile and touch)

모바일 환경에서 점검할 항목입니다.

- [ ] **사이트를 어떤 방향으로도 회전할 수 있는지 확인한다.**
  - WCAG: [1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html)
  - 사이트가 세로 방향만 허용하고 있지는 않나요?
  - 원문: "Check that the site can be rotated to any orientation." · [링크](https://www.a11yproject.com/checklist/#check-that-the-site-can-be-rotated-to-any-orientation)
- [ ] **가로 스크롤을 없앤다.**
  - WCAG: [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
  - 가로로 스크롤하게 만들면 어떤 사람에게는 어렵고, 모두에게 성가십니다.
  - 원문: "Remove horizontal scrolling." · [링크](https://www.a11yproject.com/checklist/#remove-horizontal-scrolling)
- [ ] **버튼과 링크 아이콘을 쉽게 누를 수 있게 한다.**
  - WCAG: [2.5.5 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
  - 햄버거 메뉴, 소셜 아이콘, 갤러리 뷰어 같은 터치 컨트롤이 다양한 손 크기와 스타일러스 굵기에서 쓸 만한지 확인하세요.
  - 원문: "Ensure that button and link icons can be activated with ease." · [링크](https://www.a11yproject.com/checklist/#ensure-that-button-and-link-icons-can-be-activated-with-ease)
- [ ] **인터랙티브 항목 사이에 스크롤할 여백을 충분히 둔다.**
  - WCAG: [2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
  - [수전증](https://axesslab.com/hand-tremors/) 같은 운동 조절 문제가 있는 사람은 간격이 전혀 없는 인터랙티브 항목들을 지나 스크롤하기가 매우 어려울 수 있습니다.
  - 원문: "Ensure sufficient space between interactive items in order to provide a scroll area." · [링크](https://www.a11yproject.com/checklist/#ensure-sufficient-space-between-interactive-items-in-order-to-provide-a-scroll-area)

---

## WCAG 준수 수준

| 수준 | 의미 |
| --- | --- |
| **A: Essential** | 충족하지 않으면 보조 기술이 페이지를 읽거나 이해하거나 완전히 조작하지 못할 수 있음 |
| **AA: Ideal Support** | 다수의 [정부·공공기관 웹사이트](https://www.w3.org/WAI/policies/)에서 요구하는 수준. A11Y Project가 목표로 하는 수준 |
| **AAA: Specialized Support** | 특정 사용자층을 대상으로 하는 영역에 주로 적용 |

준수 수준이 높다고 해서 반드시 구현 난이도가 높은 것은 아닙니다.
