import { test as base } from '@playwright/test';
import { BasePage } from '@src/pages/base.page';

class TestPage extends BasePage {}

interface UnitFixtures {
  /** A BasePage bound to the test's browser page. */
  ui: TestPage;
  /** Serves the HTML for every URL and opens "/", so navigation works offline. */
  openHtml: (html: string) => Promise<void>;
}

export const test = base.extend<UnitFixtures>({
  ui: async ({ page }, use) => {
    await use(new TestPage(page));
  },
  openHtml: async ({ page }, use) => {
    await use(async (html) => {
      const body = `<!doctype html><html><body>${html}</body></html>`;
      await page.route('**/*', (route) => route.fulfill({ contentType: 'text/html', body }));
      await page.goto('/');
    });
  },
});

export { expect } from '@playwright/test';
