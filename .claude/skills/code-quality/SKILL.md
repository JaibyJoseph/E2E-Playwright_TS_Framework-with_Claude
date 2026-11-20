---
name: code-quality
description: Code quality rules for this E2E framework - Prettier formatting, no duplication, simple and optimised TypeScript. Use whenever writing, changing or reviewing any .ts, .feature or .json file in this repo.
---

# Code quality

Apply these rules to every change. The framework, UI and API skills build on this file.

## Formatting

- Prettier is the single source of formatting. Config: `.prettierrc` (single quotes, semicolons, trailing commas, width 100, LF).
- After editing, run `npm run format` on the changed files, then `npm run quality` (format check, ESLint, `tsc --noEmit`). Do not hand-format against Prettier.
- Gherkin: two-space indent, one blank line between scenarios, aligned table pipes.

## Avoid duplication

- Before writing a helper, search `src/utils`, `src/pages/base.page.ts`, `src/core/api.client.ts` and existing step files. Reuse or extend what is there.
- If the same logic appears twice, move it to the right shared place (see the `framework` skill for where).
- One step definition per step text across the whole repo. Prefer a parameterised step (`{string}`, `{int}`) over near-identical steps.
- Selectors, endpoints, URLs and expected texts are defined once: selectors in the page object, endpoints in `src/api/endpoints.ts`, data in JSON.

## Keep it simple

- Prefer the plain, readable solution. No abstraction until there is a second real use.
- Small functions with one job. ESLint warns at complexity > 10, nesting > 3, or > 40 lines per function; treat warnings as things to fix.
- Early returns over nested `if`/`else`. `?.` and `??` over manual null checks.
- `async`/`await` only; no `.then()` chains, no unawaited promises.
- No hard waits (`waitForTimeout`, `setTimeout`). Use Playwright auto-waiting and web-first assertions.
- Use `const`, readonly fields and `as const` for fixed values.

## TypeScript

- `strict` mode stays on. No `any`; use `unknown` and narrow, or a type from `src/types`.
- Type every exported function's parameters and return value.
- Import through aliases (`@src/...`, `@test/...`), never long relative paths. Use `import type` for type-only imports.
- Naming: files `kebab-case` with a role suffix (`login.page.ts`, `posts.service.ts`, `login.steps.ts`); classes `PascalCase`; functions and variables `camelCase`; constants `UPPER_SNAKE_CASE`.

## Security and hygiene

- No credentials, tokens or secrets in code or JSON. Read them from env via `src/config/env.config.ts`; add the key to `.env.example` with an empty value.
- No commented-out code, no stray `console.log`. Comments explain why, not what.
- Remove unused imports, files and test data in the same change.
