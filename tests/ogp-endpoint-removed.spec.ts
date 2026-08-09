import { expect, test } from '@playwright/test'

// /api/ogp は 2026-08-04 に廃止した。`?url=` を検証せずに取得する
// エンドポイントで、公開状態のまま任意ホストへリクエストを飛ばせた。
// OGP はビルド時解決へ移したので、このルートが復活したら同じ穴が開く。
//
// **この検査はデプロイ先に対してのみ意味を持つ。** ローカルの e2e は
// `.vercel/output/static` を静的配信するが、Vercel preset の API ハンドラは
// `.vercel/output/functions/` 側に置かれる。静的サーバーは function を実行
// しないので、エンドポイントが復活していても 404 を返し続ける。実際に
// server/api/ を足してビルドしても e2e は 12 件すべて通った（実測）。
//
// ローカルでの防御は `test/no-server-api-routes.spec.ts` が担当する
// （ビルド成果物の中身を直接見るので、配信方法に左右されない）。
// こちらは PLAYWRIGHT_TEST_BASE_URL でデプロイ先を指したときだけ走らせ、
// Nitro を通した実際の応答を確認する。
test.skip(
  !process.env.PLAYWRIGHT_TEST_BASE_URL,
  '静的配信では API が実行されず常に 404 になるため判定できない。'
  + 'ローカルでは test/no-server-api-routes.spec.ts が検査する。',
)

test('/api/ogp は廃止されている', async ({ request }) => {
  const response = await request.get('/api/ogp?url=https://example.com')

  expect(response.status()).toBe(404)
})
