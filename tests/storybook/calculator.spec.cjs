const { test, expect } = require('@playwright/test');

const openStory = (page, id) => page.goto('/iframe.html?id=' + id + '&viewMode=story');

test('all templates render with styles and assets at responsive widths', async ({ page }) => {
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });
  for (const id of ['ui-components-calculator', 'ui-components-hero', 'ui-components-result',
    'ui-components-tips', 'ui-components-limitations', 'pages-bmi-calculator']) {
    for (const width of [375, 767, 768, 1023, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await openStory(page, id + '--default');
      await expect(page.locator('#storybook-root .c-title:not(.u-sr-only)').first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.locator('#storybook-root').innerHTML()).not.toContain('@@include');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('#storybook-root .c-title:not(.u-sr-only)').first().evaluate((el) =>
        getComputedStyle(el).fontFamily)).toContain('Inter');
      await expect.poll(() => page.locator('#storybook-root img').evaluateAll((images) =>
        images.every((img) => img.complete && img.naturalWidth > 0))).toBe(true);
    }
  }
  expect(failures).toEqual([]);
});

test('calculator computes BMI, switches units by keyboard and recovers from errors', async ({ page }) => {
  await openStory(page, 'ui-components-calculator--default');
  await expect(page.locator('.c-title--result')).toHaveText('Welcome!');
  await page.locator('#height-cm').fill('180');
  await page.locator('#weight-kg').fill('75');
  await expect(page.locator('#bmi-result')).toHaveText('23.1');
  await page.locator('#height-cm').fill('0');
  await expect(page.locator('#bmi-error')).toBeVisible();
  await expect(page.locator('#height-cm')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#height-cm').fill('180');
  await expect(page.locator('#bmi-error')).toBeHidden();
  await page.locator('#unit-metric').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#unit-imperial')).toBeChecked();
  await expect(page.locator('#metric-fields')).toBeHidden();
  await expect(page.locator('#height-cm')).toBeDisabled();
  await page.locator('#height-ft').fill('5');
  await page.locator('#height-in').fill('10');
  await page.locator('#weight-st').fill('11');
  await page.locator('#weight-lb').fill('4');
  await expect(page.locator('#bmi-result')).toHaveText('22.7');
});

test('pre-filled stories initialize using the shared page logic', async ({ page }) => {
  for (const prefix of ['ui-components-calculator', 'ui-components-hero', 'pages-bmi-calculator']) {
    await openStory(page, prefix + '--metric-result');
    await expect(page.locator('#bmi-result')).toHaveText('23.1');
    await openStory(page, prefix + '--imperial-result');
    await expect(page.locator('#bmi-result')).toHaveText('22.7');
    await openStory(page, prefix + '--invalid-input');
    await expect(page.locator('#bmi-error')).toBeVisible();
  }
});
