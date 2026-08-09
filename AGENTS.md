# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Nuxt entry point with feature pages, layouts, plugins, and shared UI helpers under `composables/` and `utils/`.
- `app/logic/`: Central TypeScript constants such as `SiteUrl`. Import via `~/logic/constants`.
  A duplicate `logic/` sat at the repository root until 2026-08-06. Since the Docus 5 migration
  (2025-12) made `app/` the srcDir, `~` and `@` resolve to `app/`, so the root copy was unreachable
  and had drifted out of date. It was removed; do not recreate it.
- `server/`: Nitro middleware and server-side plugins. **There is deliberately no `server/api/`** — `/api/ogp` was removed in 2026-08 (unvalidated `?url=` → SSRF) and OGP is resolved at build time instead. `test/no-server-api-routes.spec.ts` fails if a route reappears. Keep server-only dependencies here.
- `content/` & `public/`: Markdown-driven site content and static assets; update `content/` first, then regenerate.
- `tests/`: Playwright specs. Name files after the route or feature (`tests/docs-home.spec.ts`).

## Build, Test, and Development Commands
- `pnpm dev`: Start Nuxt 4 dev server with hot reload.
- `pnpm build`: Production bundle with `VITE_APP_ENV=production`.
- `pnpm generate`: Produce static output for SSG deployments.
- `pnpm preview`: Serve the build output (`.vercel/output/static`) locally for smoke checks. Run `pnpm build` first.
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
- **After pulling changes that touch `simple-git-hooks`, run `pnpm install` (or `pnpm exec simple-git-hooks`).** Editing `package.json` does not rewrite `.git/hooks/pre-commit` in existing clones, so the hook keeps running the old command until reinstalled. `pnpm build` / `pnpm generate` also run `pnpm check:ogp-cache` up front, so a stale hook still cannot ship a broken cache.
- The check deliberately lives in `simple-git-hooks`, not `lint-staged`: lint-staged's default `--diff-filter` is `ACMR`, which omits deletions, so a commit that only deletes the cache would slip through.
- `scripts/ogp-*.ts` are duplicated byte-for-byte across nuxtation / docustation / private-nuxtation. Change all three together; nothing enforces the sync.
- Run unit specs with `pnpm test` (Vitest, `test/` — singular, not `tests/`). `vitest.config.ts` lists both `app/**` and `test/**` in `include` on purpose: the default would sweep in `tests/` and fail every file, while narrowing to `app/**` would silently skip the shared specs.
- **Vitest 4 needs Vite 8.** `pnpm-workspace.yaml` pins `vite@^7.0.0: ^8.1.5` together with five `vite-*` overrides, because raising Vite alone lets pnpm swallow peer conflicts for packages that only declare Vite 7 support. Keep them together and verify with `pnpm peers check` — no unmet `vite` peer is the passing condition. See `tasks/2026-08-08-vite-8-migration.md`.
- **e2e targets the build output, not the dev server.** `playwright.config.ts` serves `.vercel/output/static`, so run `pnpm build` first. Testing against `nuxi dev` made firefox time out constantly: the dev server ships hundreds of individual modules and firefox waits for all of them before firing `load`, while chromium does not (measured: dev 624ms vs 6,471ms; static 1,251ms vs 2,227ms). That looked like flakiness but was a property of the dev server, not a product defect.
- `serve -L` disables the SPA fallback on purpose; without it every unknown path returns `index.html` with a 200 and no 404 assertion can hold.
- **A deleted server route cannot be verified over HTTP locally.** The Vercel preset emits API handlers into `.vercel/output/functions/`, not `static/`, so the static server returns 404 for `/api/*` whether or not the route exists — adding `server/api/` and rebuilding still left all 12 e2e specs green (measured). `test/no-server-api-routes.spec.ts` therefore inspects the build output directly and fails when any route appears under `functions/__fallback.func/chunks/routes/api/`. `tests/ogp-endpoint-removed.spec.ts` is skipped unless `PLAYWRIGHT_TEST_BASE_URL` points at a real deployment, where Nitro does run and the 404 is meaningful. Run `pnpm build` before `pnpm test`.
- Run e2e with `pnpm test:e2e`. `pnpm install` does not provision Playwright browsers, so the script runs `playwright install` first (a no-op taking ~3s once installed).
- By default the build output is served on a dedicated port (3101, since 3100 collides with docustation). Set `PLAYWRIGHT_TEST_BASE_URL` to target a deployed environment, which skips the local startup entirely.
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
