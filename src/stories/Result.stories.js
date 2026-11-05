import { renderTemplate } from './render.js';

export default {
  title: 'UI Components/Result',
  tags: ['autodocs'],
  render: () => renderTemplate('../pages/components/result.html', {
    section: 'c-result', heading: 'result-title',
  }),
};

export const Default = {};
