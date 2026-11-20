import { request, type APIRequestContext } from '@playwright/test';
import type { ApiResponse, HttpMethod, RequestOptions } from '@src/types/framework.types';
import { parseJsonSafe } from '@src/utils/common.utils';

/** Single entry point for all HTTP calls. Services build on top of this. */
export class ApiClient {
  private constructor(private readonly context: APIRequestContext) {}

  static async create(baseURL: string, headers: Record<string, string> = {}): Promise<ApiClient> {
    const context = await request.newContext({ baseURL, extraHTTPHeaders: headers });
    return new ApiClient(context);
  }

  async send<T = unknown>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const response = await this.context.fetch(endpoint, { method, ...options });
    return {
      status: response.status(),
      headers: response.headers(),
      body: parseJsonSafe(await response.text()) as T,
    };
  }

  dispose(): Promise<void> {
    return this.context.dispose();
  }
}
