import { renderTemplate } from './render.js';

export default {
  title: 'UI Components/Limitations',
  tags: ['autodocs'],
  render: () => renderTemplate('../pages/components/limitations.html', {
    section: 'c-limitations', heading: 'limitations-title',
  }),
};

export const Default = {};
