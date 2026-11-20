# E2E framework

Playwright + TypeScript + Cucumber framework for UI and API tests.

- Always follow the `code-quality` skill (`.claude/skills/code-quality/SKILL.md`).
- Use the `framework` skill to decide where files go; `ui` and `api` skills for test-type specifics.
- Before finishing a change, run `npm run format` and `npm run quality`, and the affected tests (`npm run test:ui` / `npm run test:api`; `npm run test:unit` for changes in `src/pages/base.page.ts` or `src/utils`).
