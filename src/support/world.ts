import { setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import { config } from '@src/config/env.config';
import type { ApiClient } from '@src/core/api.client';
import type { PageManager } from '@src/pages/page.manager';
import type { ApiResponse } from '@src/types/framework.types';

/** Per-scenario state. UI fields are set for @ui scenarios, API fields for @api scenarios. */
export class CustomWorld extends World {
  context?: BrowserContext;
  page!: Page;
  pages!: PageManager;
  api!: ApiClient;
  requestPayload?: unknown;
  private response?: ApiResponse;

  setResponse(response: ApiResponse): void {
    this.response = response;
  }

  get lastResponse(): ApiResponse {
    if (!this.response) throw new Error('No API response stored. Send a request first.');
    return this.response;
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(config.timeouts.step);
