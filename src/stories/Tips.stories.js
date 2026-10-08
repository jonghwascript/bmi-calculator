import { renderTemplate } from './render.js';

export default {
  title: 'UI Components/Tips',
  tags: ['autodocs'],
  render: () => renderTemplate('../pages/components/c-tips.html', {
    section: 'c-tips', heading: 'tips-title',
  }),
};

export const Default = {};
