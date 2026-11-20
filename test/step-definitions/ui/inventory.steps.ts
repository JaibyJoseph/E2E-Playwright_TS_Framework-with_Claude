import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '@src/support/world';
import type { SortOption } from '@src/types/test-data.types';
import { sortValues } from '@src/utils/common.utils';
import { getTestData } from '@src/utils/test-data.reader';
import { DATA_FILES } from '@test/test-data/data-files';

const getSortOption = (key: string): SortOption =>
  getTestData<SortOption>(DATA_FILES.inventory, `sortOptions.${key}`);

When('I sort the products by {string}', async function (this: CustomWorld, sortKey: string) {
  await this.pages.inventory.sortBy(getSortOption(sortKey).label);
});

Then(
  'the products should be sorted by {string}',
  async function (this: CustomWorld, sortKey: string) {
    const { field, order } = getSortOption(sortKey);
    const { inventory } = this.pages;
    if (field === 'price') {
      const prices = await inventory.getProductPrices();
      expect(prices).toEqual(sortValues(prices, order));
      return;
    }
    const names = await inventory.getProductNames();
    expect(names).toEqual(sortValues(names, order));
  },
);
