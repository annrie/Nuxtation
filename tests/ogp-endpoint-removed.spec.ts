import { expect, test } from '@playwright/test'

// /api/ogp は 2026-08-04 に廃止した。`?url=` を検証せずに取得する
// エンドポイントで、公開状態のまま任意ホストへリクエストを飛ばせた。
// OGP はビルド時解決へ移したので、このルートが復活したら同じ穴が開く。
test('/api/ogp は廃止されている', async ({ request }) => {
  const response = await request.get('/api/ogp?url=https://example.com')

  expect(response.status()).toBe(404)
})
