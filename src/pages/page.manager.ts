import type { Page } from '@playwright/test';
import { InventoryPage } from '@src/pages/inventory.page';
import { LoginPage } from '@src/pages/login.page';

/** Creates each page object once per scenario. Register new pages here. */
export class PageManager {
  private loginPage?: LoginPage;
  private inventoryPage?: InventoryPage;

  constructor(private readonly page: Page) {}

  get login(): LoginPage {
    return (this.loginPage ??= new LoginPage(this.page));
  }

  get inventory(): InventoryPage {
    return (this.inventoryPage ??= new InventoryPage(this.page));
  }
}
