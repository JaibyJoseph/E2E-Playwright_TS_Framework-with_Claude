---
name: framework
description: Structure and conventions of this Playwright + TypeScript + Cucumber E2E framework - which folder each file belongs in, where common methods live, and how JSON test data is used. Use when adding or moving features, steps, pages, services, utilities, config or test data.
---

# Framework structure

Every change must also follow the `code-quality` skill. For UI or API specifics, see the `ui` and `api` skills.

## Layout

```
src/                         framework code, no test scenarios
  config/env.config.ts       all env-driven settings (URLs, browser, timeouts, secrets)
  config/report.config.json  Allure folders, read by cucumber.js, allurerc.mjs and scripts/allure
scripts/allure/              Node helpers for Allure report generation (not test code)
  core/browser.manager.ts    browser and context creation
  core/api.client.ts         the only HTTP client (ApiClient.send)
  pages/base.page.ts         common UI methods shared by all pages
  pages/<name>.page.ts       one page object per page or component
  pages/page.manager.ts      registers page objects for the World
  api/endpoints.ts           every API path, defined once
  api/services/<name>.service.ts   domain API calls built on ApiClient
  support/world.ts           per-scenario state (CustomWorld)
  support/hooks.ts           Before/After hooks, screenshots on failure
  types/                     shared interfaces and types
  utils/common.utils.ts      generic helpers (getByPath, parseJsonSafe, ...)
  utils/test-data.reader.ts  JSON test data loading
test/                        everything that describes tests
  features/ui|api/*.feature  Gherkin, tagged @ui or @api
  step-definitions/ui|api/*.steps.ts
  test-data/ui|api/*.json    all test data
  test-data/data-files.ts    named paths to the JSON files
  unit/*.spec.ts             Playwright Test unit tests for framework code (BasePage, utils)
  unit/support/unit.fixture.ts   `ui` (a BasePage) and `openHtml` (serves inline HTML offline)
```

When you add or change a `BasePage` method or a helper in `src/utils`, add or update its unit test in `test/unit`. Unit tests use small inline HTML, never a real site.

## Where things go

| You need to add...                     | Put it in                                                   |
| -------------------------------------- | ----------------------------------------------------------- |
| A setting that varies per environment  | `src/config/env.config.ts` + `.env.example`                 |
| A UI action used by more than one page | `src/pages/base.page.ts`                                    |
| A page's locators and actions          | `src/pages/<name>.page.ts`, registered in `page.manager.ts` |
| An API path                            | `src/api/endpoints.ts`                                      |
| Calls for one API resource             | `src/api/services/<resource>.service.ts`                    |
| A helper not tied to UI or API         | `src/utils/common.utils.ts`                                 |
| A shared type                          | `src/types/*.types.ts`                                      |
| Scenario state shared between steps    | a field on `CustomWorld`                                    |
| Test inputs or expected values         | JSON in `test/test-data/ui/` or `test/test-data/api/`       |

Do not create a new utils file when `common.utils.ts` fits. Split it only when it passes about 200 lines, by topic (`string.utils.ts`, `date.utils.ts`).

## Test data

- All test data lives in JSON under `test/test-data`. No literals for inputs or expected values in steps or pages.
- Register each JSON file in `test/test-data/data-files.ts` and read it with `getTestData(DATA_FILES.x, 'dot.path')`.
- Features refer to data by key (`When I log in as "standardUser"`), not by value.
- Secrets never go in JSON; they come from env (`config.credentials`).

## Steps and features

- Steps are thin: read data, call a page object or service, assert. No locators, no raw HTTP, no loops of logic.
- Generic, reusable steps go in a `common-*.steps.ts` file; domain steps in `<domain>.steps.ts`.
- Every feature has `@ui` or `@api` at feature level; hooks use these tags to start a browser or an API client. Add `@smoke` to critical scenarios.
- Use `Background` for shared preconditions and `Scenario Outline` for data variations.
- Type `this` as `CustomWorld` in every step.

## Commands

- `npm test`, `npm run test:ui`, `npm run test:api`, `npm run test:smoke`, `npm run test:unit`
- Run one feature: `npm run test:ui -- test/features/ui/login.feature`
- `TEST_ENV=qa` loads `.env.qa`; `PARALLEL=n` and `RETRY=n` control the run
- Reports: `reports/cucumber-report.html` and `.json`
- Allure: run the tests, then `npm run report:allure`. It writes one single-file report per feature that ran, at `reports/allure-report/<YYYY-MM-DD_HH-mm-ss>/<feature>/index.html`. Allure results are emptied at the start of each run. Open `<timestamp>/index.html` (the overview, when several features ran) or `<feature>/index.html` straight from disk, or run `npm run report:allure:open` to serve the newest report on 127.0.0.1.
