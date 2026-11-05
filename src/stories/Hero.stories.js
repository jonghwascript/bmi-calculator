import { renderTemplate, calculatorArgs, calculatorArgTypes } from './render.js';

export default {
  title: 'UI Components/Hero',
  tags: ['autodocs'],
  args: calculatorArgs,
  argTypes: calculatorArgTypes,
  render: (args) => renderTemplate('../pages/components/hero.html', {"section":"c-hero","heading":"hero-title"}, args),
};

export const Default = {};
export const MetricResult = { args: { heightCm: 180, weightKg: 75 } };
export const Imperial = { args: { unit: 'imperial' } };
export const ImperialResult = {
  args: { unit: 'imperial', heightFt: 5, heightIn: 10, weightSt: 11, weightLb: 4 },
};
export const InvalidInput = { args: { heightCm: 0, weightKg: 75 } };
