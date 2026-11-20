import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { config } from '@src/config/env.config';
import type { CustomWorld } from '@src/support/world';
import type { UiUser } from '@src/types/test-data.types';
import { getTestData } from '@src/utils/test-data.reader';
import { DATA_FILES } from '@test/test-data/data-files';

Given('I am on the login page', async function (this: CustomWorld) {
  await this.pages.login.open();
});

When('I log in as {string}', async function (this: CustomWorld, userKey: string) {
  const user = getTestData<UiUser>(DATA_FILES.login, `users.${userKey}`);
  await this.pages.login.login(user.username, config.credentials.uiPassword());
});

Then('I should see the products page', async function (this: CustomWorld) {
  const expected = getTestData<Record<string, string>>(DATA_FILES.login, 'expected');
  await this.pages.inventory.waitForUrl(expected.inventoryUrl);
  await expect(this.pages.inventory.title).toHaveText(expected.inventoryTitle);
});

Then('I should see the login error {string}', async function (this: CustomWorld, errorKey: string) {
  const message = getTestData<string>(DATA_FILES.login, `errors.${errorKey}`);
  await expect(this.pages.login.errorMessage).toHaveText(message);
});
