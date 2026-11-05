const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/storybook',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:6006', browserName: 'chromium', channel: 'chrome' },
  webServer: {
    command: 'npm run storybook -- --ci --no-open',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
