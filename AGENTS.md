# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Nuxt entry point with feature pages, layouts, plugins, and shared UI helpers under `composables/` and `utils/`.
- `logic/`: Central TypeScript utilities re-exported via `logic/index.ts` for stable import paths.
- `server/`: Nitro handlers (`server/api`), middleware, and server-side plugins. Keep server-only dependencies here.
- `content/` & `public/`: Markdown-driven site content and static assets; update `content/` first, then regenerate.
- `tests/`: Playwright specs. Name files after the route or feature (`tests/docs-home.spec.ts`).

## Build, Test, and Development Commands
- `pnpm dev`: Start Nuxt 4 dev server with hot reload.
- `pnpm build`: Production bundle with `VITE_APP_ENV=production`.
- `pnpm generate`: Produce static output for SSG deployments.
- `pnpm preview`: Serve `.output/` locally for smoke checks.
- `pnpm lint` / `pnpm lint:fix`: ESLint via the Antfu preset; autofix before committing.
- `pnpm exec playwright test`: Run end-to-end tests in `tests/`.

## Coding Style & Naming Conventions
- TypeScript-first. Prefer composables over global helpers and keep exports typed.
- ESLint (`@antfu/eslint-config`) enforces 2-space indentation, single quotes, and sorted imports. Respect lint warnings.
- Vue components: PascalCase (`AppHeader.vue`); composables and utilities: camelCase; route files under `pages/`: kebab-case to match URLs.
- UnoCSS utilities belong near templates; avoid inline styles unless computed dynamically.

## Testing Guidelines
- Add Playwright specs with the `.spec.ts` suffix and isolate state between tests.
- Use relative navigation (`page.goto('/')`) and `data-test` attributes for selectors.
- Place shared fixtures under `tests/fixtures/` when needed.
- Execute `pnpm exec playwright test --reporter=list` before opening a PR and attach traces for failures.

## Commit & Pull Request Guidelines
- Follow the emoji-rich, multi-clause commit style shown in `git log`, describing scope and change type.
- Husky runs lint-staged on commit; ensure staged files pass lint and formatting.
- PRs should include a clear summary, linked issues, UI screenshots when applicable, and test/deploy notes.
- Request review from a Nuxt maintainer and wait for green CI before merging.

## Deployment & Release Notes
- Production deploys run through Vercel (`pnpm vercel --prod`). Coordinate semantic releases with `pnpm release:*` scripts powered by `standard-version`.
- Leave `CNAME` and `vercel.json` untouched unless coordinating DNS or hosting changes.
