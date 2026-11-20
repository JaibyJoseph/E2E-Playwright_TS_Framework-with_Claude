# E2E framework

Generic end-to-end framework for UI and API tests, built on Playwright, TypeScript and Cucumber (BDD).

## Setup

```bash
npm install
npm run install:browsers
cp .env.example .env   # then set UI_PASSWORD (sample app: secret_sauce)
```

## Run

| Command              | Runs                        |
| -------------------- | --------------------------- |
| `npm test`           | all scenarios               |
| `npm run test:ui`    | `@ui` scenarios             |
| `npm run test:api`   | `@api` scenarios            |
| `npm run test:smoke` | `@smoke` scenarios          |
| `npm run quality`    | Prettier check, ESLint, tsc |
| `npm run format`     | format all files            |

Options (env vars or `.env`): `TEST_ENV=qa` loads `.env.qa`, `BROWSER=chromium|firefox|webkit`, `HEADLESS=false`, `SLOW_MO=200`, `PARALLEL=2`, `RETRY=1`.

Reports are written to `reports/cucumber-report.html` and `reports/cucumber-report.json`. Failed UI scenarios get a screenshot attached.

## Structure

```
src/        framework code: config, core (browser, API client), pages, api services, support (world, hooks), types, utils
test/       features (ui, api), step-definitions (ui, api), test-data (JSON)
.claude/    skills: code-quality, framework, ui, api
```

See `.claude/skills/framework/SKILL.md` for the full layout and where new files belong.

The samples target public demo apps: https://www.saucedemo.com (UI) and https://jsonplaceholder.typicode.com (API). Replace them by changing `BASE_URL` / `API_BASE_URL` and the pages, services and data.
