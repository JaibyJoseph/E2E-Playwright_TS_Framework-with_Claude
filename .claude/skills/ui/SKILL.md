---
name: ui
description: Basic rules for UI tests in this framework - page objects, locators and assertions with Playwright. Use when adding or changing UI features, UI steps or page objects.
---

# UI testing

Follow the `framework` and `code-quality` skills as well.

## Page objects

- One class per page or reusable component in `src/pages/<name>.page.ts`, extending `BasePage`.
- Declare locators as `readonly` fields at the top of the class; expose actions as methods (`login`, `addToCart`).
- Use `BasePage` methods (`navigate`, `click`, `fill`, `getText`, `waitForUrl`, ...) instead of repeating raw Playwright calls. Add a method to `BasePage` only when two or more pages need it.
- Register the page in `src/pages/page.manager.ts` and use it in steps through `this.pages.<name>`.
- Page objects do not assert; steps do.

## Locators

Prefer, in order: `getByTestId` (attribute set by `TEST_ID_ATTRIBUTE`, default `data-test`), `getByRole` with a name, `getByLabel`, `getByText`. Avoid XPath and position-based CSS.

## Waits and assertions

- Use web-first assertions: `await expect(locator).toHaveText(...)`, `toBeVisible()`, `toHaveURL(...)`.
- Never use `waitForTimeout`. Rely on auto-waiting or wait for a specific state or URL.
- Expected texts and URLs come from JSON test data.

## Run

`npm run test:ui`. Set `HEADLESS=false` and `SLOW_MO=200` in `.env` to watch a run. A full-page screenshot is attached to the report when a scenario fails.
