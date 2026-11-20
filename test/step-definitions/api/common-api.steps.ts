import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '@src/support/world';
import type { HttpMethod } from '@src/types/framework.types';
import { getByPath } from '@src/utils/common.utils';
import { getTestData } from '@src/utils/test-data.reader';
import { DATA_FILES } from '@test/test-data/data-files';

// Generic steps reusable by any API feature. Domain-specific steps go in their own file.

When(
  'I send a {string} request to {string}',
  async function (this: CustomWorld, method: HttpMethod, endpoint: string) {
    this.setResponse(await this.api.send(method, endpoint));
  },
);

When(
  'I send a {string} request to {string} with payload {string}',
  async function (this: CustomWorld, method: HttpMethod, endpoint: string, payloadKey: string) {
    this.requestPayload = getTestData(DATA_FILES.apiPayloads, payloadKey);
    this.setResponse(await this.api.send(method, endpoint, { data: this.requestPayload }));
  },
);

Then('the response status should be {int}', function (this: CustomWorld, status: number) {
  expect(this.lastResponse.status).toBe(status);
});

Then(
  'the response field {string} should equal {string}',
  function (this: CustomWorld, field: string, expected: string) {
    expect(String(getByPath(this.lastResponse.body, field))).toBe(expected);
  },
);

Then('the response body should contain the request payload', function (this: CustomWorld) {
  expect(this.lastResponse.body).toMatchObject(this.requestPayload as Record<string, unknown>);
});
