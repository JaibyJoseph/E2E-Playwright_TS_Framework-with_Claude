import dotenv from 'dotenv';
import type { BrowserName } from '@src/types/framework.types';

dotenv.config({ path: process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env' });

const readRequired = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const config = {
  ui: {
    baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    browser: (process.env.BROWSER ?? 'chromium') as BrowserName,
    headless: process.env.HEADLESS !== 'false',
    slowMo: Number(process.env.SLOW_MO ?? 0),
    viewport: { width: 1366, height: 768 },
    testIdAttribute: process.env.TEST_ID_ATTRIBUTE ?? 'data-test',
  },
  api: {
    baseUrl: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  },
  timeouts: {
    step: 60_000,
    action: 15_000,
    navigation: 30_000,
  },
  // Read lazily so API-only runs do not need UI secrets.
  credentials: {
    uiPassword: () => readRequired('UI_PASSWORD'),
  },
} as const;
