import { initCalculator } from '../js/bmi-calculator.mjs';

const templates = import.meta.glob('../pages/**/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

// Resolve includes relative to the including file, just like gulp-file-include.
export function resolveTemplate(path, ancestors = []) {
  if (ancestors.includes(path)) throw new Error('Circular HTML include: ' + path);
  const template = templates[path];
  if (template === undefined) throw new Error('Missing HTML template: ' + path);
  return template.replace(/@@include\(['"]([^'"]+)['"]\)/g, (_, relative) => {
    const parts = path.split('/');
    parts.pop();
    for (const part of relative.split('/')) {
      if (part === '..') parts.pop();
      else if (part !== '.') parts.push(part);
    }
    return resolveTemplate(parts.join('/'), [...ancestors, path]);
  });
}

export const calculatorArgs = {
  unit: 'metric', heightCm: '', weightKg: '',
  heightFt: '', heightIn: '', weightSt: '', weightLb: '',
};
export const calculatorArgTypes = {
  unit: { control: 'inline-radio', options: ['metric', 'imperial'] },
  ...Object.fromEntries(
    ['heightCm', 'weightKg', 'heightFt', 'heightIn', 'weightSt', 'weightLb']
      .map((name) => [name, { control: 'number' }]),
  ),
};

export function renderTemplate(path, { section, heading } = {}, args = {}) {
  const wrapper = document.createElement('div');
  if (section) {
    const main = document.createElement('main');
    main.className = 'l-grid l-grid--page l-center';
    const element = document.createElement('section');
    element.className = section;
    element.setAttribute('aria-labelledby', heading);
    element.innerHTML = resolveTemplate(path);
    main.append(element);
    wrapper.append(main);
  } else if (path.endsWith('/index.html')) {
    const page = new DOMParser().parseFromString(resolveTemplate(path), 'text/html');
    wrapper.append(...page.body.children);
  } else {
    wrapper.style.cssText = 'max-width: 36rem; margin: auto; padding: min(1.5rem, 6.4vw);';
    wrapper.innerHTML = resolveTemplate(path);
  }
  const form = wrapper.querySelector('#bmi-form');
  if (form) {
    form.querySelector('#unit-' + (args.unit ?? 'metric')).checked = true;
    const fields = {
      heightCm: 'height-cm', weightKg: 'weight-kg', heightFt: 'height-ft',
      heightIn: 'height-in', weightSt: 'weight-st', weightLb: 'weight-lb',
    };
    for (const [arg, id] of Object.entries(fields)) {
      form.querySelector('#' + id).value = args[arg] ?? '';
    }
    initCalculator(wrapper);
  }
  return wrapper;
}
