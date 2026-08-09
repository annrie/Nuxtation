import { defineVitestConfig } from '@nuxt/test-utils/config'

// テスト基盤の方針:
// - environment は jsdom。DOM を直接触る spec（document.createElement の spy など）が
//   あるリポジトリに合わせてある。3リポで設定を byte 同一に保つため、spec が
//   まだ無いリポジトリでも同じ値にしておく。
// - include は app 配下と test/ 配下。AGENTS.md の規約で **`test/`（単数）が共有の
//   vitest spec、`tests/`（複数）が Playwright** と分かれている（紛らわしいので注意）。
//   **既定の include に任せると tests/ の Playwright テストまで拾い、@playwright/test の
//   test() が vitest 上で解決できず全ファイルが落ちる。** かといって app/ だけに絞ると
//   今度は test/ に置いた共有 spec が黙って無視される。両方を明示する。
//   e2e は playwright.config.ts が testDir: './tests' で受け持つ。
export default defineVitestConfig({
  test: {
    environment: 'jsdom',
    include: ['app/**/*.{test,spec}.ts', 'test/**/*.{test,spec}.ts'],
    environmentOptions: {
      // `// @vitest-environment nuxt` を付けたファイル用。@nuxt/test-utils は
      // 既定で happy-dom を要求するが、このリポジトリは jsdom を採用しているため
      // 明示的に切り替える。省くと happy-dom 未導入で worker 起動時に落ちる。
      nuxt: {
        domEnvironment: 'jsdom',
      },
    },
    // Nuxt 環境は 1 ファイルにつき Nuxt インスタンスを立てるため、初期化だけで
    // 既定の 10s を超えて "Hook timed out" になる。
    hookTimeout: 60000,
    testTimeout: 30000,
  },
})
