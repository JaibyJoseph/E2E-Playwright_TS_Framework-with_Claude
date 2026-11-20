import type { Locator, Page } from '@playwright/test';
import type { DropdownOptions, Target } from '@src/types/framework.types';
import { matchesText } from '@src/utils/common.utils';

const notFoundMessage = (text: string, available: string[]): string =>
  `No item matching "${text}". Available: ${available.join(' | ') || '(none)'}`;

/** Common UI actions shared by every page object. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected locate(target: Target): Locator {
    return typeof target === 'string' ? this.page.locator(target) : target;
  }

  // ---------- Basic actions ----------

  async navigate(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async click(target: Target): Promise<void> {
    await this.locate(target).click();
  }

  async fill(target: Target, value: string): Promise<void> {
    await this.locate(target).fill(value);
  }

  async hover(target: Target): Promise<void> {
    await this.locate(target).hover();
  }

  async setChecked(target: Target, checked = true): Promise<void> {
    await this.locate(target).setChecked(checked);
  }

  async uploadFile(target: Target, filePaths: string | string[]): Promise<void> {
    await this.locate(target).setInputFiles(filePaths);
  }

  async selectOption(target: Target, value: string): Promise<void> {
    await this.locate(target).selectOption(value);
  }

  async selectTab(name: string): Promise<void> {
    await this.page.getByRole('tab', { name }).click();
  }

  /** Registers the answer for the next alert/confirm/prompt; call it before the action that opens it. */
  handleNextDialog(accept = true, promptText?: string): void {
    this.page.once('dialog', (dialog) => (accept ? dialog.accept(promptText) : dialog.dismiss()));
  }

  // ---------- Reading and waiting ----------

  async getText(target: Target): Promise<string> {
    return (await this.locate(target).innerText()).trim();
  }

  async getAllTexts(target: Target): Promise<string[]> {
    return (await this.locate(target).allInnerTexts()).map((text) => text.trim());
  }

  async getCount(target: Target): Promise<number> {
    return this.locate(target).count();
  }

  async waitForVisible(target: Target): Promise<void> {
    await this.locate(target).waitFor({ state: 'visible' });
  }

  /** Waits for spinners, overlays or toasts to go away. */
  async waitForHidden(target: Target): Promise<void> {
    await this.locate(target).waitFor({ state: 'hidden' });
  }

  async isVisible(target: Target): Promise<boolean> {
    return this.locate(target).isVisible();
  }

  async waitForUrl(urlPart: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPart instanceof RegExp ? urlPart : `**${urlPart}`);
  }

  // ---------- Lists ----------

  /** Walks through the items and returns the first whose text matches; fails listing what was there. */
  async findItemByText(items: Target, text: string, exact = true): Promise<Locator> {
    const list = this.locate(items);
    await list.first().waitFor({ state: 'visible' });
    for (const item of await list.all()) {
      if (matchesText(await item.innerText(), text, exact)) return item;
    }
    throw new Error(notFoundMessage(text, await this.getAllTexts(list)));
  }

  async clickItemByText(items: Target, text: string, exact = true): Promise<void> {
    await (await this.findItemByText(items, text, exact)).click();
  }

  // ---------- Search, dropdowns and autocomplete ----------

  /** Types a term into a search box and submits with the given button, or Enter when none is given. */
  async search(input: Target, term: string, submitButton?: Target): Promise<void> {
    await this.fill(input, term);
    if (submitButton) {
      await this.click(submitButton);
      return;
    }
    await this.locate(input).press('Enter');
  }

  /**
   * Picks an option by its visible text. Works for a native <select> and for custom dropdowns,
   * where the trigger is clicked open and the items are walked through until one matches.
   */
  async selectFromDropdown(
    dropdown: Target,
    optionText: string,
    { items, exact = true }: DropdownOptions = {},
  ): Promise<void> {
    const trigger = this.locate(dropdown);
    if (await this.isNativeSelect(trigger)) {
      await this.selectNativeOption(trigger, optionText, exact);
      return;
    }
    await trigger.click();
    await this.clickItemByText(items ?? this.openOptions, optionText, exact);
  }

  /** Returns all option texts of a dropdown, opening a custom one first. */
  async getDropdownOptions(dropdown: Target, items?: Target): Promise<string[]> {
    const trigger = this.locate(dropdown);
    if (await this.isNativeSelect(trigger)) return this.getNativeOptionTexts(trigger);
    await trigger.click();
    const list = this.locate(items ?? this.openOptions);
    await list.first().waitFor({ state: 'visible' });
    return this.getAllTexts(list);
  }

  /** Types into an autocomplete/typeahead field and picks a suggestion (defaults to the typed text). */
  async typeAndSelect(
    input: Target,
    text: string,
    optionText = text,
    { items, exact = true }: DropdownOptions = {},
  ): Promise<void> {
    await this.fill(input, text);
    await this.clickItemByText(items ?? this.openOptions, optionText, exact);
  }

  /** Visible options only, so hidden <option>s of native selects elsewhere on the page are skipped. */
  private get openOptions(): Locator {
    return this.page.getByRole('option').filter({ visible: true });
  }

  private async isNativeSelect(locator: Locator): Promise<boolean> {
    return (await locator.evaluate((el) => el.tagName)) === 'SELECT';
  }

  private async getNativeOptionTexts(select: Locator): Promise<string[]> {
    return (await select.locator('option').allTextContents()).map((text) => text.trim());
  }

  private async selectNativeOption(select: Locator, text: string, exact: boolean): Promise<void> {
    const labels = await this.getNativeOptionTexts(select);
    const label = labels.find((option) => matchesText(option, text, exact));
    if (!label) throw new Error(notFoundMessage(text, labels));
    await select.selectOption({ label });
  }

  // ---------- Tables ----------

  /** Returns the row that contains the text, so an action inside it can be clicked. */
  getTableRow(table: Target, rowText: string): Locator {
    return this.locate(table).getByRole('row').filter({ hasText: rowText });
  }

  /** Returns every cell text of a column, found by its header name. */
  async getColumnValues(table: Target, header: string): Promise<string[]> {
    const grid = this.locate(table);
    const headers = await this.getAllTexts(grid.getByRole('columnheader'));
    const index = headers.findIndex((name) => matchesText(name, header));
    if (index < 0) throw new Error(notFoundMessage(header, headers));
    const rows = await grid
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell') })
      .all();
    return Promise.all(rows.map((row) => this.getText(row.getByRole('cell').nth(index))));
  }
}
