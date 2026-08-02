import { expect, test } from '@playwright/test'

// 元は `npm init playwright` が生成した example.spec.ts で、playwright.dev を開いて
// タイトルを確かめるだけの内容だった（自プロジェクトを一切検証していない）。
// testDir も存在しない ./tests-examples を指していたため、そもそも実行されていなかった。
// 実在するページに対する最小限のスモークテストに置き換える。
test.describe('スモークテスト', () => {
  test('トップページが表示される', async ({ page }) => {
    const response = await page.goto('/')

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Nuxtation/)
  })

  test('ブログ一覧が表示される', async ({ page }) => {
    const response = await page.goto('/blog')

    expect(response?.status()).toBe(200)
  })

  test('カテゴリ一覧が表示される', async ({ page }) => {
    const response = await page.goto('/cat')

    expect(response?.status()).toBe(200)
  })
})
