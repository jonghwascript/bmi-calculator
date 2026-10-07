// ==========================================
// 단위 체계 토글 (Metric / Imperial)
// 선택한 단위의 입력 그룹만 보이고, 숨긴 그룹은 disabled로 검증·제출에서 제외한다.
// ==========================================
function initUnitToggle() {
  const form = document.getElementById('bmi-form');
  const fieldsets = {
    metric: document.getElementById('metric-fields'),
    imperial: document.getElementById('imperial-fields'),
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

document.addEventListener('DOMContentLoaded', initUnitToggle);
