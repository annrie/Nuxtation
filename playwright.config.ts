import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// **テスト対象をこの1箇所で決める。** baseURL・dev サーバーの起動有無・その待ち受け先は
// すべてここから導出し、個別にポートや URL を書かない。
//
// - PLAYWRIGHT_TEST_BASE_URL があれば staging / preview などの外部環境が対象。
//   その場合ローカルのサーバーは起動しない（起動を待つ必要がないどころか、
//   ローカルが立ち上がらないだけでリモート向けのテストが失敗してしまう）。
// - 未指定ならビルド成果物を静的配信して、それを対象にする。専用ポートを使うのは
//   dev の既定ポート(3100)が docustation と重複するため。
//
// **dev サーバーを対象にしない。** 以前は `nuxi dev` を起動していたが、
// firefox のスモークが 30 秒でタイムアウトし続けていた。実測すると原因は
// dev サーバー特有の配信方法にあった:
//
//   配信元            chromium   firefox
//   dev サーバー        624ms    6,471ms   ← 10.4 倍
//   静的配信（本番相当） 1,251ms   2,227ms   ← 1.8 倍
//
// dev サーバーは依存を数百の個別モジュールとして配信する。firefox はそれら
// すべての完了を待って load を発火させるが、chromium は待たずに発火させる
// （page.on('requestfinished') で確認）。テストが積み重なると閾値を超え、
// 「firefox だけ不安定」に見えていた。**本番の性能問題ではない。**
//
// 静的配信なら本番と同じ成果物を検証でき、firefox の遅さも解消する。
const E2E_PORT = Number(process.env.PLAYWRIGHT_E2E_PORT ?? 3101)
const LOCAL_ORIGIN = `http://localhost:${E2E_PORT}`
const EXTERNAL_BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL
const BASE_URL = EXTERNAL_BASE_URL || LOCAL_ORIGIN

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* テスト対象を配信するサーバー */
  // 外部環境が指定されているときは起動しない（上のコメント参照）。
  webServer: EXTERNAL_BASE_URL
    ? undefined
    : {
        // ビルド成果物をそのまま配信する。`pnpm build` を先に済ませておくこと
        // （成果物が無ければ serve が即座に終了し、Playwright が起動失敗として報告する）。
        //
        // -L は SPA フォールバックを無効にする。**これが無いと未知のパスにも
        // index.html を返してしまい、`/api/ogp` が 404 であることを確かめている
        // テストが「常に通る」意味のないテストになる。**
        // `nuxi preview` は vercel preset では "Preview is not supported for this
        // build." と拒否されるため使えない（実測）。
        command: `pnpm exec serve -p ${E2E_PORT} -L .vercel/output/static`,
        url: LOCAL_ORIGIN,
        reuseExistingServer: !process.env.CI,
        timeout: 60 * 1000,
      },
}

export default config
