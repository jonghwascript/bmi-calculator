// ==========================================
// 모바일 내비게이션 메뉴
// 햄버거 버튼으로 열고, 닫기 버튼·배경·Esc로 닫는다.
// 열린 동안 본문은 inert로 막고 Tab 포커스를 메뉴 안에 가둔다.
// ==========================================
function initNavigation($) {
  const $menuToggle = $('.c-header__menu-toggle');
  const $nav = $('#primary-nav');
  const $overlay = $('.c-header__backdrop');
  const $mainContent = $('#main');
  const $closeButton = $nav.find('.c-nav__close');
  const $body = $('body');

  // 필수 요소가 없으면 다른 기능에 영향을 주지 않도록 초기화를 건너뛴다.
  if (!$menuToggle.length || !$nav.length || !$closeButton.length) return;

  const desktop = window.matchMedia('(min-width: 1024px)');
  let isOpen = false;
  let hideNavTimer = 0;

  // 메뉴의 열림 상태와 클래스·ARIA·inert·포커스를 한 곳에서 동기화한다.
  function setMenuOpen(open, { restoreFocus = true } = {}) {
    const wasOpen = isOpen;
    open = open && !desktop.matches;
    isOpen = open;
    if (open) {
      clearTimeout(hideNavTimer);
      $nav.prop('hidden', false);
      // 숨김 해제 직후 오프스크린 시작 위치를 확정해 열림 전환을 유지한다.
      $nav[0].offsetWidth;
    }
    $nav.toggleClass('is-active', open);
    $body.toggleClass('no-scroll', open);
    $menuToggle.attr('aria-expanded', String(open));
    $mainContent.prop('inert', open);

    // 포커스를 먼저 복원한 뒤 메뉴를 보조 기술과 키보드에서 숨긴다.
    if (!open && wasOpen && restoreFocus && !desktop.matches) {
      $menuToggle[0].focus({ preventScroll: true });
    }
    if (desktop.matches) {
      clearTimeout(hideNavTimer);
      $nav.prop('hidden', false);
      $nav.prop('inert', false).attr('aria-hidden', 'false');
    } else {
      $nav.prop('inert', !open).attr('aria-hidden', String(!open));
      if (!open && wasOpen) {
        // 시각적 닫힘 전환 동안에도 inert와 aria-hidden으로 탐색을 막는다.
        hideNavTimer = setTimeout(() => {
          if (!isOpen && !desktop.matches) $nav.prop('hidden', true);
        }, 300);
      } else {
        $nav.prop('hidden', true);
      }
    }
    if (open) $closeButton[0].focus({ preventScroll: true });
  }

  function syncNavigationMode() {
    const active = document.activeElement;
    // CSS가 닫기 버튼을 숨기면서 포커스가 body로 먼저 이동할 수도 있다.
    const needsDesktopFocus = desktop.matches && (
      active === $menuToggle[0] ||
      active === $closeButton[0] ||
      (isOpen && active === document.body)
    );
    // 모바일 전환 시 메뉴를 숨기기 전에 포커스를 바깥으로 옮긴다.
    if (!desktop.matches && $nav[0].contains(active)) {
      $menuToggle[0].focus({ preventScroll: true });
    }
    setMenuOpen(false, { restoreFocus: false });
    // 데스크톱에서 사라지는 열기·닫기 버튼에 포커스를 남기지 않는다.
    if (needsDesktopFocus) {
      $nav.find('a[href]').first()[0]?.focus({ preventScroll: true });
    }
  }

  desktop.addEventListener('change', syncNavigationMode);

  $menuToggle.on('click', () => setMenuOpen(!isOpen));
  $closeButton.add($overlay).on('click', () => setMenuOpen(false));

  $(document).on('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    // 포커스 트랩: 메뉴 안에서 실제로 포커스 가능한 요소만 모은다.
    const $focusable = $nav
      .find('a[href], button, input, select, textarea, [tabindex]')
      .filter(':visible:not(:disabled)')
      .filter(
        (_, element) =>
          $(element).prop('tabIndex') >= 0 &&
          !$(element).closest('[inert]').length,
      );
    const $first = $focusable.first();
    const $last = $focusable.last();
    const active = document.activeElement;

    if (!$first.length) {
      event.preventDefault();
      return;
    }

    // 포커스가 메뉴 밖에 있거나 양 끝에서 벗어나려 하면 반대쪽 끝으로 돌린다.
    if (
      !$nav.has(active).length ||
      (event.shiftKey ? $first.is(active) : $last.is(active))
    ) {
      event.preventDefault();
      (event.shiftKey ? $last : $first).trigger('focus');
    }
  });

  // 데스크톱은 항상 접근 가능, 모바일은 닫힌 상태로 시작한다.
  syncNavigationMode();
}

// ==========================================
// 상품 이미지 갤러리 (Slick 캐러셀)
// ==========================================
function initGallery($) {
  // Slick CDN 로딩에 실패해도 메뉴는 독립적으로 작동한다.
  if (typeof $.fn.slick !== 'function') return;

  const $gallery = $('.c-gallery__list');
  if (!$gallery.length) return;

  // 한 장씩 보여 주고, 기본 화살표 대신 마크업의 이전·다음 버튼을 사용한다.
  $gallery.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    prevArrow: $('.c-gallery__control--prev'),
    nextArrow: $('.c-gallery__control--next'),
    dots: false,
    speed: 300,
  });

  const $thumbs = $('.c-gallery__thumb');
  const $status = $('.c-gallery__status');

  // 현재 슬라이드에 맞춰 썸네일 활성 표시와 스크린 리더 안내를 갱신한다.
  function syncThumbs(index) {
    $thumbs.each((i, thumb) => {
      const isCurrent = i === index;
      $(thumb).toggleClass('is-active', isCurrent);
      if (isCurrent) $(thumb).attr('aria-current', 'true');
      else $(thumb).removeAttr('aria-current');
    });
    $status.text(`Image ${index + 1} of ${$thumbs.length}`);
  }

  // 화살표로 넘길 때도 갱신되도록 Slick 이벤트에서 동기화한다.
  $gallery.on('beforeChange', (_event, _slick, _currentSlide, nextSlide) =>
    syncThumbs(nextSlide),
  );

  // 썸네일을 클릭하면 data-index에 해당하는 슬라이드로 이동한다.
  $thumbs.on('click', (event) => {
    const index = Number($(event.currentTarget).attr('data-index'));
    if (Number.isNaN(index)) return;
    $gallery.slick('slickGoTo', index);
  });

  // 리사이즈 중 다음 슬라이드가 보이지 않도록 프레임당 한 번 재배치한다.
  let resizeFrame = 0;
  $(window).on('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if ($gallery.hasClass('slick-initialized')) $gallery.slick('setPosition');
    });
  });
}

// ==========================================
// 상품 이미지 라이트박스
// 네이티브 모달의 배경 접근 차단과 Esc 닫기를 사용한다.
// ==========================================
function initLightbox($) {
  const dialog = document.querySelector('.c-lightbox');
  const gallery = document.querySelector('.c-gallery__list');
  if (!dialog || !gallery) return;

  // Slick은 버튼의 조상 슬라이드에 slick-cloned를 붙인다.
  const images = Array.from(
    gallery.querySelectorAll('.c-gallery__open img'),
  ).filter((image) => !image.closest('.slick-cloned'));
  const image = dialog.querySelector('.c-lightbox__image');
  const closeButton = dialog.querySelector('.c-lightbox__close');
  const thumbs = Array.from(dialog.querySelectorAll('.c-lightbox__thumb'));
  if (!images.length || !image || !closeButton) return;

  const desktop = window.matchMedia('(min-width: 1024px)');
  let index = 0;
  let opener = null;

  function focusGalleryControl() {
    gallery.closest('.c-gallery')
      .querySelector('.c-gallery__control--next')?.focus({ preventScroll: true });
  }

  function syncImageControls() {
    gallery.querySelectorAll('.c-gallery__open').forEach((element) => {
      const hadFocus = document.activeElement === element;
      // 버튼 노드는 유지하고 모바일에서는 네이티브 disabled 상태로 비활성화한다.
      element.disabled = !desktop.matches;
      element.querySelector('.u-sr-only').hidden = !desktop.matches;
      if (desktop.matches) {
        element.setAttribute('type', 'button');
        element.setAttribute('aria-haspopup', 'dialog');
        element.setAttribute('aria-controls', dialog.id);
        const slide = element.closest('.slick-slide');
        element.tabIndex = slide
          ? (slide.classList.contains('slick-active') && !slide.classList.contains('slick-cloned') ? 0 : -1)
          : (element.contains(images[0]) ? 0 : -1);
      } else {
        element.removeAttribute('tabindex');
        element.removeAttribute('aria-haspopup');
        element.removeAttribute('aria-controls');
        if (hadFocus) focusGalleryControl();
      }
    });
  }

  // 재초기화로 생성된 복제 슬라이드에도 현재 화면의 의미를 적용한다.
  $(gallery).on('reInit', syncImageControls);
  syncImageControls();

  function showImage(nextIndex) {
    index = (nextIndex + images.length) % images.length;
    image.src = images[index].src;
    image.alt = images[index].alt;
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-active', i === index);
      if (i === index) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    dialog.querySelector('.c-lightbox__status').textContent =
      `Image ${index + 1} of ${images.length}`;
  }

  $(gallery).on('click', '.c-gallery__open', (event) => {
    if (!desktop.matches || event.currentTarget.disabled || dialog.open) return;
    opener = event.currentTarget;
    const selected = opener.querySelector('img');
    showImage(Math.max(0, images.findIndex((item) => item.src === selected.src)));
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  });

  closeButton.addEventListener('click', () => dialog.close());
  desktop.addEventListener('change', (event) => {
    if (!event.matches && dialog.open) dialog.close();
    syncImageControls();
  });
  dialog.addEventListener('close', () => {
    if (!desktop.matches) focusGalleryControl();
    else if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog.querySelector('.c-lightbox__control--prev')
    .addEventListener('click', () => showImage(index - 1));
  dialog.querySelector('.c-lightbox__control--next')
    .addEventListener('click', () => showImage(index + 1));
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => showImage(Number(thumb.dataset.index)));
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showImage(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });
}

// ==========================================
// 수량 선택과 장바구니
// 수량 증감 → Add to cart로 담기 → 헤더 카트 패널에서 확인·삭제
// 상태(quantity, items, isOpen)는 이 함수 안에서만 관리하고
// render* 함수로 화면에 반영한다.
// ==========================================
function initCart($) {
  // 수량 선택 폼
  const $form = $('.c-purchase');
  const $decrease = $form.find('.c-quantity__button--decrease');
  const $increase = $form.find('.c-quantity__button--increase');
  const $value = $form.find('.c-quantity__value');
  const $input = $form.find('#quantity-input');
  // 헤더 카트 버튼과 패널
  const $toggle = $('#cart-toggle');
  const $panel = $('#cart-panel');
  const $list = $panel.find('.c-cart__list');
  const $checkout = $panel.find('.c-cart__checkout');
  const $badge = $toggle.find('.c-badge');
  // 스크린 리더 안내용 영역
  const $status = $('#cart-status');
  const $error = $form.find('.c-purchase__error');

  if (!$form.length || !$value.length || !$toggle.length || !$panel.length)
    return;

  // 상품 정보는 이 객체를 원본으로 사용하고 본문과 장바구니에 렌더링한다.
  const product = {
    id: 'fall-limited-edition-sneakers',
    name: 'Fall Limited Edition Sneakers',
    price: 125,
    thumbnail: './images/image-product-1-thumbnail.jpg',
  };
  const $productTitle = $('.c-product__title');
  const $productPrice = $('.c-price__amount');

  let quantity = 0; // 현재 선택한 수량
  let isOpen = false; // 카트 패널 열림 여부
  const items = []; // 장바구니 항목: { id, name, price, thumbnail, quantity }

  const formatPrice = (amount) => `$${amount.toFixed(2)}`;

  function renderProduct() {
    $productTitle.text(product.name);
    $productPrice.text(formatPrice(product.price));
  }

  let errorTimer = 0;

  // 같은 문구를 다시 넣어도 role="alert"가 다시 읽히도록 비운 뒤 잠시 후 채운다.
  function showError(message) {
    clearTimeout(errorTimer);
    $error.text('');
    errorTimer = setTimeout(() => $error.text(message), 100);
  }

  // 문구를 비우면 CSS :empty 규칙으로 에러 영역이 숨겨진다.
  function clearError() {
    clearTimeout(errorTimer);
    $error.text('');
  }

  // 수량 표시, 폼 전송용 hidden input, 감소 버튼 비활성 상태를 함께 갱신한다.
  function renderQuantity() {
    const atMin = quantity === 0;
    $value.text(quantity);
    $input.val(quantity);
    // disabled 대신 aria-disabled를 써서 0일 때도 버튼에 포커스가 남게 한다.
    $decrease
      .toggleClass('is-disabled', atMin)
      .attr('aria-disabled', String(atMin));
  }

  // 배지에는 항목 수가 아니라 담긴 수량의 합계를 표시한다.
  // 숫자는 CSS가 attr(data-count)로 그리고, 0이면 배지를 숨긴다.
  function renderBadge() {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    $badge.attr('data-count', count);
    $badge
      .find('.u-sr-only')
      .text(`, ${count} ${count === 1 ? 'item' : 'items'}`);
  }

  // 장바구니 항목 하나의 <li>를 만든다.
  // 상품명 등 데이터는 .text()/.attr()로 넣어 HTML로 해석되지 않게 한다.
  function createItem(item) {
    const $remove = $(
      '<button class="c-cart__remove c-icon-button" type="button"></button>',
    )
      .attr('data-id', item.id)
      .html(
        '<svg aria-hidden="true" focusable="false" width="14" height="16"><use href="./images/icon-delete.svg"></use></svg>',
      )
      .append(
        $('<span class="u-sr-only"></span>').text(
          `Remove ${item.name} from cart`,
        ),
      );

    return $('<li class="c-cart__item l-cluster"></li>').append(
      $('<div class="c-cart__thumb l-frame"></div>').append(
        $('<img alt="" width="50" height="50">').attr('src', item.thumbnail),
      ),
      $('<div class="c-cart__info"></div>').append(
        $('<p class="c-cart__name"></p>').text(item.name),
        $('<p class="c-cart__price"></p>').append(
          $('<span class="c-cart__unit"></span>').text(
            `${formatPrice(item.price)} × ${item.quantity} `,
          ),
          $('<strong class="c-cart__total"></strong>').text(
            formatPrice(item.price * item.quantity),
          ),
        ),
      ),
      $remove,
    );
  }

  // 목록을 items 기준으로 다시 그린다.
  // 비어 있으면 CSS(:has)가 Checkout 대신 "Your cart is empty."를 보여 준다.
  function renderCart() {
    $list.empty().append(items.map(createItem));
    renderBadge();
  }

  // 패널 표시(hidden)와 버튼의 aria-expanded를 함께 바꾼다.
  // 사용자가 버튼·Esc로 닫았을 때만 포커스를 카트 버튼으로 돌려준다.
  function setCartOpen(open, { restoreFocus = false } = {}) {
    isOpen = open;
    $panel.prop('hidden', !open);
    $toggle.attr('aria-expanded', String(open));
    if(isOpen){
      $('.c-purchase__submit').addClass('u-orange-300');
    }else{
      $('.c-purchase__submit').removeClass('u-orange-300');
    }

    if (!open && restoreFocus) $toggle[0].focus({ preventScroll: true });
  }

  // 수량 감소: 0 아래로 내려가지 않는다.
  $decrease.on('click', () => {
    if (quantity === 0) return;
    quantity -= 1;
    renderQuantity();
  });

  // 수량 증가: 1 이상이 되므로 에러 문구를 지운다.
  $increase.on('click', () => {
    quantity += 1;
    renderQuantity();
    clearError();
  });

  // Add to cart: 실제 폼 전송은 막고 장바구니 상태만 갱신한다.
  $form.on('submit', (event) => {
    event.preventDefault();

    if (quantity === 0) {
      showError('Please select a quantity of at least 1.');
      return;
    }

    // 같은 상품이면 새 줄을 만들지 않고 수량만 누적한다.
    const existing = items.find((item) => item.id === product.id);
    if (existing) existing.quantity += quantity;
    else items.push({ ...product, quantity });

    renderCart();
    $status.text(`Added ${quantity} ${product.name} to cart.`);

    // 담은 뒤 선택 수량을 0으로 초기화한다.
    quantity = 0;
    renderQuantity();
  });

  // 삭제 버튼은 매번 다시 그려지므로 목록에 이벤트를 위임한다.
  $list.on('click', '.c-cart__remove', (event) => {
    const id = $(event.currentTarget).attr('data-id');
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;

    const [removed] = items.splice(index, 1);
    renderCart();
    $status.text(`Removed ${removed.name} from cart.`);

    // 삭제된 버튼에 있던 포커스를 다음 삭제 버튼이나 카트 버튼으로 옮긴다.
    const $next = $list
      .find('.c-cart__remove')
      .eq(Math.min(index, items.length - 1));
    ($next.length ? $next : $toggle).trigger('focus');
  });

  // 카트 버튼으로 열고 닫으며, Checkout을 누르면 패널을 닫는다.
  $toggle.on('click', () => setCartOpen(!isOpen));
  $checkout.on('click', () => setCartOpen(false, { restoreFocus: true }));

  $(document).on('keydown', (event) => {
    if (isOpen && event.key === 'Escape')
      setCartOpen(false, { restoreFocus: true });
  });

  // 패널 내부나 카트 버튼이 아닌 곳을 클릭하면 닫는다.
  // .hide()는 인라인 display를 남겨 다시 열리지 않으므로 setCartOpen으로 상태를 함께 바꾼다.
  // 삭제 버튼은 클릭 처리 중 DOM에서 제거되므로 closest 대신 클릭 시점의 경로로 판단한다.
  $(document).on('click', (event) => {
    if (!isOpen) return;
    const path = event.originalEvent.composedPath();
    if (path.includes($panel[0]) || path.includes($toggle[0])) return;
    setCartOpen(false);
  });

  // 초기 상태: 수량 0, 빈 장바구니, 패널 닫힘
  renderProduct();
  renderQuantity();
  renderCart();
  setCartOpen(false);
}

// 이 스크립트는 문서 하단에서 로드되므로 내비게이션 상태를 즉시 동기화한다.
initNavigation(jQuery);

// 나머지 기능은 DOM 준비 후 독립적으로 초기화한다.
jQuery(($) => {
  initGallery($);
  initLightbox($);
  initCart($);
});
