import { writeFileSync } from 'node:fs';
import { expect, test } from '@test/unit/support/unit.fixture';

const ACTIONS_HTML = `
  <button id="counter" onclick="this.dataset.count = Number(this.dataset.count ?? 0) + 1">Count</button>
  <input id="name" />
  <style>.tip { display: none } #info:hover + .tip { display: inline }</style>
  <button id="info">Info</button><span class="tip">Tooltip</span>
  <input id="agree" type="checkbox" />
  <input id="file" type="file" />
  <select id="size"><option value="s">Small</option><option value="l">Large</option></select>
  <div role="tablist">
    <button role="tab" onclick="panel.textContent = 'Details panel'">Details</button>
    <button role="tab" onclick="panel.textContent = 'History panel'">History</button>
  </div>
  <div id="panel"></div>`;

const READING_HTML = `
  <h1 id="title">  Products  </h1>
  <li class="item"> One </li><li class="item">Two </li>
  <p id="hidden" hidden>Secret</p>
  <div id="spinner">Loading</div>
  <script>
    setTimeout(() => document.querySelector('#spinner').remove(), 300);
    setTimeout(() => document.body.insertAdjacentHTML('beforeend', '<p id="late">Ready</p>'), 300);
  </script>`;

test.describe('BasePage basic actions', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(ACTIONS_HTML));

  test('navigate opens the given path', async ({ ui, page }) => {
    await ui.navigate('/products');
    await expect(page).toHaveURL(/\/products$/);
  });

  test('click accepts a selector and a locator', async ({ ui, page }) => {
    await ui.click('#counter');
    await ui.click(page.getByRole('button', { name: 'Count' }));
    await expect(page.locator('#counter')).toHaveAttribute('data-count', '2');
  });

  test('fill replaces the input value', async ({ ui, page }) => {
    await ui.fill('#name', 'first');
    await ui.fill('#name', 'second');
    await expect(page.locator('#name')).toHaveValue('second');
  });

  test('hover reveals hover-only content', async ({ ui, page }) => {
    await expect(page.locator('.tip')).toBeHidden();
    await ui.hover('#info');
    await expect(page.locator('.tip')).toBeVisible();
  });

  test('setChecked checks by default and can uncheck', async ({ ui, page }) => {
    await ui.setChecked('#agree');
    await expect(page.locator('#agree')).toBeChecked();
    await ui.setChecked('#agree', false);
    await expect(page.locator('#agree')).not.toBeChecked();
  });

  test('uploadFile attaches the file', async ({ ui, page }, testInfo) => {
    const filePath = testInfo.outputPath('upload.txt');
    writeFileSync(filePath, 'content');
    await ui.uploadFile('#file', filePath);
    const fileName = await page
      .locator('#file')
      .evaluate((input: HTMLInputElement) => input.files?.[0]?.name);
    expect(fileName).toBe('upload.txt');
  });

  test('selectOption picks by value', async ({ ui, page }) => {
    await ui.selectOption('#size', 'l');
    await expect(page.locator('#size')).toHaveValue('l');
  });

  test('selectTab clicks the tab with that name', async ({ ui, page }) => {
    await ui.selectTab('History');
    await expect(page.locator('#panel')).toHaveText('History panel');
  });
});

test.describe('BasePage dialogs', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(''));

  test('accepts a confirm dialog', async ({ ui, page }) => {
    ui.handleNextDialog();
    expect(await page.evaluate(() => confirm('Delete?'))).toBe(true);
  });

  test('dismisses a confirm dialog', async ({ ui, page }) => {
    ui.handleNextDialog(false);
    expect(await page.evaluate(() => confirm('Delete?'))).toBe(false);
  });

  test('answers a prompt dialog', async ({ ui, page }) => {
    ui.handleNextDialog(true, 'Jane');
    expect(await page.evaluate(() => prompt('Name?'))).toBe('Jane');
  });
});

test.describe('BasePage reading and waiting', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(READING_HTML));

  test('getText returns trimmed text', async ({ ui }) => {
    expect(await ui.getText('#title')).toBe('Products');
  });

  test('getAllTexts returns every trimmed text', async ({ ui }) => {
    expect(await ui.getAllTexts('.item')).toEqual(['One', 'Two']);
  });

  test('getCount counts matching elements', async ({ ui }) => {
    expect(await ui.getCount('.item')).toBe(2);
    expect(await ui.getCount('.missing')).toBe(0);
  });

  test('isVisible reports visibility without waiting', async ({ ui }) => {
    expect(await ui.isVisible('#title')).toBe(true);
    expect(await ui.isVisible('#hidden')).toBe(false);
  });

  test('waitForVisible waits for an element that appears later', async ({ ui, page }) => {
    await ui.waitForVisible('#late');
    await expect(page.locator('#late')).toBeVisible();
  });

  test('waitForHidden waits for a spinner to go away', async ({ ui, page }) => {
    await ui.waitForHidden('#spinner');
    await expect(page.locator('#spinner')).toHaveCount(0);
  });

  test('waitForUrl accepts a URL part and a pattern', async ({ ui }) => {
    await ui.navigate('/orders/42');
    await ui.waitForUrl('/orders/42');
    await ui.waitForUrl(/\/orders\/\d+$/);
  });
});
