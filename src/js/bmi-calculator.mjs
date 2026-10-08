// ==========================================
// 단위 체계 토글 (Metric / Imperial)
// 선택한 단위의 입력 그룹만 보이고, 숨긴 그룹은 disabled로 검증·제출에서 제외한다.
// ==========================================
function initUnitToggle(root) {
  const form = root.querySelector('#bmi-form');
  const fieldsets = {
    metric: root.querySelector('#metric-fields'),
    imperial: root.querySelector('#imperial-fields'),
  };

  // 필수 요소가 없으면 다른 기능에 영향을 주지 않도록 초기화를 건너뛴다.
  if (!form || !fieldsets.metric || !fieldsets.imperial) return;

  const setActive = (fieldset, isActive) => {
    fieldset.hidden = !isActive;
    fieldset.disabled = !isActive;
    // 마크업에서 input에도 disabled가 붙어 있으므로 함께 맞춘다.
    fieldset.querySelectorAll('input').forEach((input) => {
      input.disabled = !isActive;
    });
  };

  const update = () => {
    const selected = form.querySelector('input[name="unit-system"]:checked');
    const unit = selected ? selected.value : 'metric';

    setActive(fieldsets.metric, unit === 'metric');
    setActive(fieldsets.imperial, unit === 'imperial');
  };

  form.addEventListener('change', (event) => {
    if (event.target.name === 'unit-system') update();
  });

  // 새로고침 후 브라우저가 복원한 선택 상태와 화면을 일치시킨다.
  update();
}

// ==========================================
// BMI 계산 및 결과 출력
// 입력이 바뀔 때마다 선택한 단위 체계로 BMI를 계산해 결과 패널에 표시한다.
// ==========================================
const HEALTHY_BMI = { min: 18.5, max: 24.9 };
const LBS_PER_STONE = 14;
const INCHES_PER_FOOT = 12;
const UPDATE_DELAY = 500; // ms, 마지막 입력 후 결과를 갱신하기까지 기다리는 시간
// 단위 체계별 키·몸무게 입력 칸 name
const FIELDS = {
  metric: { height: ['height-cm'], weight: ['weight-kg'] },
  imperial: { height: ['height-ft', 'height-in'], weight: ['weight-st', 'weight-lb'] },
};

function initBmiCalculator(root) {
  const form = root.querySelector('#bmi-form');
  const panel = form?.querySelector('.c-bmi-result');
  const title = panel?.querySelector('.c-title--result');
  const value = root.querySelector('#bmi-result');
  const text = panel?.querySelector('.c-bmi-result__text');
  const error = root.querySelector('#bmi-error');

  if (!form || !panel || !title || !value || !text) return;

  // 빈 칸은 null, 숫자가 아니거나 음수면 NaN을 돌려 미입력과 잘못된 입력을 구분한다.
  const read = (name) => {
    const input = form.elements[name];
    if (!input || input.value.trim() === '') return null;
    const number = Number(input.value);
    return number < 0 ? NaN : number;
  };

  // 단위 체계별로 키(m 또는 in)와 몸무게(kg 또는 lbs)를 모은다.
  // imperial의 in·lbs는 비워 두면 0으로 본다. (예: 5ft만 입력)
  const getMeasurements = (unit) => {
    if (unit === 'imperial') {
      const ft = read('height-ft');
      const st = read('weight-st');
      if (ft === null || st === null) return null;

      return {
        height: ft * INCHES_PER_FOOT + (read('height-in') ?? 0),
        weight: st * LBS_PER_STONE + (read('weight-lb') ?? 0),
      };
    }

    const cm = read('height-cm');
    const kg = read('weight-kg');
    if (cm === null || kg === null) return null;

    return { height: cm / 100, weight: kg };
  };

  const calculateBmi = (unit, { height, weight }) => {
    const bmi = weight / height ** 2;
    return unit === 'imperial' ? bmi * 703 : bmi;
  };

  // 같은 키에서 정상 BMI 범위에 해당하는 몸무게를 단위 체계에 맞게 구한다.
  const getIdealRange = (unit, height) => {
    const factor = unit === 'imperial' ? 703 : 1;
    return {
      min: (HEALTHY_BMI.min * height ** 2) / factor,
      max: (HEALTHY_BMI.max * height ** 2) / factor,
    };
  };

  const formatWeight = (unit, weight) => {
    if (unit !== 'imperial') return `${weight.toFixed(1)}kgs`;

    // 반올림으로 14lbs가 되면 1st로 올린다.
    const totalLbs = Math.round(weight);
    const st = Math.floor(totalLbs / LBS_PER_STONE);
    const lbs = totalLbs % LBS_PER_STONE;
    return `${st}st ${lbs}lbs`;
  };

  const getCategory = (bmi) => {
    if (bmi < HEALTHY_BMI.min) return 'underweight';
    if (bmi < 25) return 'a healthy weight';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

  const showError = (message) => {
    if (!error) return;
    error.textContent = message;
    error.hidden = !message;
  };

  // 잘못된 칸에 aria-invalid와 오류 문구 연결(aria-describedby)을 붙이고, 나머지 칸은 되돌린다.
  // 단위 표시처럼 기존에 연결된 설명은 그대로 둔다.
  const markInvalid = (names) => {
    form.querySelectorAll('.c-input').forEach((input) => {
      const isInvalid = names.includes(input.name);
      const describedBy = (input.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter((id) => id && id !== error?.id);
      if (isInvalid && error) describedBy.push(error.id);

      input.classList.toggle('is-invalid', isInvalid);
      if (isInvalid) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      input.setAttribute('aria-describedby', describedBy.join(' '));
    });
  };

  // 음수 등 읽을 수 없는 칸, 그리고 합계가 0 이하인 키·몸무게 칸을 찾는다.
  const findInvalidFields = (unit, measurements) => {
    const fields = FIELDS[unit];
    const isFilled = (name) => read(name) !== null;
    const invalid = [...fields.height, ...fields.weight].filter(
      (name) => isFilled(name) && !Number.isFinite(read(name)),
    );

    if (measurements && invalid.length === 0) {
      if (!(measurements.height > 0)) invalid.push(...fields.height.filter(isFilled));
      if (!(measurements.weight > 0)) invalid.push(...fields.weight.filter(isFilled));
    }
    return invalid;
  };

  const renderEmpty = () => {
    panel.classList.add('is-empty');
    title.textContent = 'Welcome!';
    value.textContent = '';
    text.textContent =
      "Enter your height and weight and you'll see your BMI result here";
  };

  const renderResult = (unit, bmi, height) => {
    const range = getIdealRange(unit, height);

    panel.classList.remove('is-empty');
    title.textContent = 'Your BMI is...';
    value.textContent = bmi.toFixed(1);

    const ideal = document.createElement('span');
    ideal.textContent = `${formatWeight(unit, range.min)} - ${formatWeight(unit, range.max)}.`;
    text.replaceChildren(
      `Your BMI suggests you're ${getCategory(bmi)}. Your ideal weight is between `,
      ideal,
    );
  };

  const update = () => {
    const selected = form.querySelector('input[name="unit-system"]:checked');
    const unit = selected ? selected.value : 'metric';
    const measurements = getMeasurements(unit);
    const invalid = findInvalidFields(unit, measurements);

    markInvalid(invalid);

    // 음수는 다른 칸이 비어 있어도 바로 알린다.
    if (invalid.length > 0) {
      showError('Please enter a height and weight greater than 0.');
      renderEmpty();
      return;
    }

    showError('');
    if (!measurements) {
      renderEmpty();
      return;
    }

    renderResult(unit, calculateBmi(unit, measurements), measurements.height);
  };

  // 결과 값이 aria-live 영역이므로, 타이핑 중에는 갱신을 미뤄
  // 입력이 멈춘 뒤 한 번만 스크린 리더가 읽도록 한다.
  let timerId;
  const updateNow = () => {
    clearTimeout(timerId);
    update();
  };

  form.addEventListener('input', (event) => {
    // 라디오도 input 이벤트를 보내지만 단위 전환은 change에서 즉시 처리한다.
    if (event.target.name === 'unit-system') return;
    clearTimeout(timerId);
    timerId = setTimeout(update, UPDATE_DELAY);
  });
  form.addEventListener('change', (event) => {
    if (event.target.name === 'unit-system') updateNow();
  });
  // 제출 버튼이 없지만 Enter 등으로 제출돼 새로고침되지 않게 막는다.
  form.addEventListener('submit', (event) => event.preventDefault());

  update();
}


export function initCalculator(root = document) {
  initUnitToggle(root);
  initBmiCalculator(root);
}
