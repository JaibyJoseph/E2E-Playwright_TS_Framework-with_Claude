---
name: api
description: Basic rules for API tests in this framework - ApiClient, endpoints, services, payloads and response checks. Use when adding or changing API features, API steps or services.
---

# API testing

Follow the `framework` and `code-quality` skills as well.

## Making requests

- All HTTP goes through `ApiClient.send(method, endpoint, { data, params, headers })` in `src/core/api.client.ts`. It returns `{ status, headers, body }` with the body already parsed.
- Paths live in `src/api/endpoints.ts`. Start them with `/` and keep the base URL in `API_BASE_URL`.
- Group calls for one resource in `src/api/services/<resource>.service.ts`, typed with interfaces from `src/types`.
- Store responses with `this.setResponse(...)` and read them with `this.lastResponse` so the generic assertion steps work.

## Generic steps (test/step-definitions/api/common-api.steps.ts)

- `I send a "<METHOD>" request to "<endpoint>"`
- `I send a "<METHOD>" request to "<endpoint>" with payload "<key>"` (key in `test/test-data/api/payloads.json`)
- `the response status should be <code>`
- `the response field "<dot.path>" should equal "<value>"`
- `the response body should contain the request payload`

Reuse these before writing new steps. Write a domain step (in `<domain>.steps.ts`, using a service) when a scenario reads better in business terms.

## Data and auth

- Request payloads live in JSON under `test/test-data/api`.
- Tokens and keys come from env via `src/config/env.config.ts`; pass them as headers to `ApiClient.create`.

## Run

`npm run test:api`. API scenarios do not start a browser.
