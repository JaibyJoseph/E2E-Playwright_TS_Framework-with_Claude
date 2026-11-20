import { defineConfig } from '@playwright/test';

/** Unit tests for framework code; pages are inline HTML served by a route, so no network is used. */
export default defineConfig({
  testDir: 'test/unit',
  testMatch: '**/*.spec.ts',
  timeout: 15_000,
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: 'reports/unit', open: 'never' }]],
  use: { baseURL: 'http://unit.test', headless: true, actionTimeout: 5_000 },
});
