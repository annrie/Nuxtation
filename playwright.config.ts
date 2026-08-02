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
//   その場合ローカルの dev サーバーは起動しない（起動を待つ必要がないどころか、
//   ローカルが立ち上がらないだけでリモート向けのテストが失敗してしまう）。
// - 未指定ならローカルを起動して自分自身を対象にする。dev の既定ポート(3100)は
//   docustation と重複するため専用ポートを使い、reuseExistingServer が別リポの
//   dev サーバーを拾う事故を防ぐ。
//   nuxi dev のポート優先順位は NUXT_PORT || NITRO_PORT || PORT || nuxtOptions.devServer.port
//   なので --port を明示する。
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

  /* Run your local dev server before starting the tests */
  // 外部環境が指定されているときは起動しない（上のコメント参照）。
  webServer: EXTERNAL_BASE_URL
    ? undefined
    : {
        // `pnpm dev` は `nuxi dev -o` でブラウザを自動で開くため、テストでは nuxi を直接呼ぶ。
        command: `pnpm exec nuxi dev --port ${E2E_PORT}`,
        url: LOCAL_ORIGIN,
        reuseExistingServer: !process.env.CI,
        timeout: 300 * 1000,
      },
}

export default config
