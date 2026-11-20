import type { Locator } from '@playwright/test';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

/** A CSS selector or a Playwright locator, accepted by every BasePage method. */
export type Target = string | Locator;

export type SortOrder = 'asc' | 'desc';

export interface DropdownOptions {
  /** The list items to walk through; defaults to elements with role "option". */
  items?: Target;
  /** Match the whole text (default) or only part of it. Case and outer spaces are ignored. */
  exact?: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body: T;
}
