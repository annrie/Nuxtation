# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Nuxt entry point with feature pages, layouts, plugins, and shared UI helpers under `composables/` and `utils/`.
- `app/logic/`: Central TypeScript constants such as `SiteUrl`. Import via `~/logic/constants`.
  A duplicate `logic/` sat at the repository root until 2026-08-06. Since the Docus 5 migration
  (2025-12) made `app/` the srcDir, `~` and `@` resolve to `app/`, so the root copy was unreachable
  and had drifted out of date. It was removed; do not recreate it.
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
- `pnpm ogp:refresh`: Resolve link-card OGP into `app/data/ogp-cache.json`.
- `pnpm check:ogp-cache`: Verify every link-card URL is present in that cache (no network).

## Coding Style & Naming Conventions
- TypeScript-first. Prefer composables over global helpers and keep exports typed.
- ESLint (`@antfu/eslint-config`) enforces 2-space indentation, single quotes, and sorted imports. Respect lint warnings.
- Vue components: PascalCase (`AppHeader.vue`); composables and utilities: camelCase; route files under `pages/`: kebab-case to match URLs.
- UnoCSS utilities belong near templates; avoid inline styles unless computed dynamically.

## Testing Guidelines
- After adding a link-card to an article, run `pnpm ogp:refresh` and commit `app/data/ogp-cache.json`. The `pre-commit` hook runs `pnpm check:ogp-cache --staged --if-relevant`, which inspects the staged tree whenever the commit touches `content/**/*.md` or the cache itself, and exits early otherwise. A forgotten refresh is caught at commit time rather than after publishing — `LinkCard.vue` degrades to a plain link without any error when the cache lacks a URL.
- **Never delete `app/data/ogp-cache.json`, even when removing the last link-card.** `LinkCard.vue` imports it statically and `nuxt.config.ts` registers `app/components` globally, so a missing file fails the build with `[UNLOADABLE_DEPENDENCY] Could not load ...`. Leave it as `{}` — `pnpm ogp:refresh` writes that automatically when nothing is referenced. The check enforces this.
- The check deliberately lives in `simple-git-hooks`, not `lint-staged`: lint-staged's default `--diff-filter` is `ACMR`, which omits deletions, so a commit that only deletes the cache would slip through.
- `scripts/ogp-*.ts` are duplicated byte-for-byte across nuxtation / docustation / private-nuxtation. Change all three together; nothing enforces the sync.
- There is no Vitest setup in this repo. Unit specs for the link-card extraction live in private-nuxtation (`test/ogp-link-cards.spec.ts`); Vitest 4 requires Vite 8, and this repo is pinned to Vite 7 because `@nuxt/devtools`, `@vite-pwa/nuxt` and friends do not declare Vite 8 support yet. See `tasks/2026-08-08-vite-8-migration.md`.
- Run e2e with `pnpm test:e2e`. `pnpm install` does not provision Playwright browsers, so the script runs `playwright install` first (a no-op taking ~3s once installed).
- By default a local dev server starts on a dedicated port (3101, since 3100 collides with docustation). Set `PLAYWRIGHT_TEST_BASE_URL` to target a deployed environment, which skips the local startup entirely.
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
