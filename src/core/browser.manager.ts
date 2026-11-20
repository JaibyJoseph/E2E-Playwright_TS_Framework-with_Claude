import {
  chromium,
  firefox,
  selectors,
  webkit,
  type Browser,
  type BrowserContext,
} from '@playwright/test';
import { config } from '@src/config/env.config';

const launchers = { chromium, firefox, webkit };

export const launchBrowser = (): Promise<Browser> => {
  selectors.setTestIdAttribute(config.ui.testIdAttribute);
  return launchers[config.ui.browser].launch({
    headless: config.ui.headless,
    slowMo: config.ui.slowMo,
  });
};

export const createContext = async (browser: Browser): Promise<BrowserContext> => {
  const context = await browser.newContext({
    baseURL: config.ui.baseUrl,
    viewport: config.ui.viewport,
  });
  context.setDefaultTimeout(config.timeouts.action);
  context.setDefaultNavigationTimeout(config.timeouts.navigation);
  return context;
};
