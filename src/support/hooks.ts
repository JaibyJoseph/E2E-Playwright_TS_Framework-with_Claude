import { After, AfterAll, Before, Status } from '@cucumber/cucumber';
import type { Browser } from '@playwright/test';
import { config } from '@src/config/env.config';
import { ApiClient } from '@src/core/api.client';
import { createContext, launchBrowser } from '@src/core/browser.manager';
import { PageManager } from '@src/pages/page.manager';
import type { CustomWorld } from '@src/support/world';

// One browser per worker, launched only when a @ui scenario runs.
let browser: Browser | undefined;

Before({ tags: '@ui' }, async function (this: CustomWorld) {
  browser ??= await launchBrowser();
  this.context = await createContext(browser);
  this.page = await this.context.newPage();
  this.pages = new PageManager(this.page);
});

Before({ tags: '@api' }, async function (this: CustomWorld) {
  this.api = await ApiClient.create(config.api.baseUrl);
});

After(async function (this: CustomWorld, { result }) {
  if (this.context && result?.status === Status.FAILED) {
    this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }
  await this.context?.close();
  await this.api?.dispose();
});

AfterAll(async () => {
  await browser?.close();
});
