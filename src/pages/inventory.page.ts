import { BasePage } from '@src/pages/base.page';

export class InventoryPage extends BasePage {
  readonly title = this.page.getByTestId('title');
  readonly items = this.page.getByTestId('inventory-item');
  readonly sortDropdown = this.page.getByTestId('product-sort-container');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly itemPrices = this.page.getByTestId('inventory-item-price');

  async sortBy(optionText: string): Promise<void> {
    await this.selectFromDropdown(this.sortDropdown, optionText);
  }

  async getProductNames(): Promise<string[]> {
    return this.getAllTexts(this.itemNames);
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.getAllTexts(this.itemPrices);
    return prices.map((price) => Number(price.replace(/[^\d.]/g, '')));
  }
}
