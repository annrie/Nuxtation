// ビルド成果物にサーバー API ルートが含まれていないことを確かめる。
//
// **HTTP で叩いて 404 を確認するやり方では検出できない。** e2e は
// `.vercel/output/static` を静的配信するが、Vercel preset の API は
// `.vercel/output/functions/` 側に置かれるため、エンドポイントを復活させても
// 静的配信は 404 を返し続ける。実際に server/api/ を追加してビルドしても
// e2e は 12 件すべて通ってしまった（実測）。成果物を直接見る必要がある。

import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const BUILD_OUTPUT = '.vercel/output/functions/__fallback.func'
/**
 * Nitro がサーバールートを吐き出す場所。`renderer.mjs` や `sitemap.xml.mjs` が
 * 常にここに入るので、存在自体を前提にしてよい。
 */
const ROUTES_DIR = `${BUILD_OUTPUT}/chunks/routes`
/** そのうち API ハンドラが入るサブディレクトリ。 */
const API_ROUTES_DIR = `${ROUTES_DIR}/api`

describe('サーバー API ルート', () => {
  // 2026-08-04 に server/api/ogp.ts を削除した。`?url=` を検証せずに
  // open-graph-scraper へ渡しており、公開状態のまま任意ホストへリクエストを
  // 飛ばせた（SSRF）。OGP はビルド時解決へ移したので、このリポジトリに
  // サーバー API は1つも要らない。増えたらまず意図を疑う。
  it('ビルド成果物に含まれていない', async () => {
    if (!existsSync(BUILD_OUTPUT)) {
      // ビルド前に走らせても意味がないので、その旨を明示して落とす。
      // 黙ってスキップすると「通った」と誤解される。
      throw new Error(
        `${BUILD_OUTPUT} がありません。先に \`pnpm build\` を実行してください。\n`
        + '  この検査はビルド成果物を見るため、ビルドなしでは判定できません。',
      )
    }

    // 出力先は preset/Nitro の内部構造に依存する。構造が変わったときに
    // 「API が無い」と誤って報告しないよう、見ている場所が生きていることを
    // 先に確かめる。ここが落ちたら検査対象のパスを直すこと。
    expect(
      existsSync(ROUTES_DIR),
      `${ROUTES_DIR} がありません。Nitro の出力構造が変わった可能性があります。\n`
      + '  このテストはこのパスを見て API の有無を判定しているため、'
      + '見る場所を更新するまで判定できません。',
    ).toBe(true)

    const routes = existsSync(API_ROUTES_DIR)
      ? await readdir(API_ROUTES_DIR, { recursive: true })
      : []

    const found = routes.map(r => `  - ${join(API_ROUTES_DIR, String(r))}`).join('\n')

    expect(routes, [
      'サーバー API ルートが生成されています:',
      found,
      '',
      '  このリポジトリはビルド時に OGP を解決するため、サーバー API を持ちません。',
      '  意図して追加したなら、宛先の検証（許可リスト・プライベートIP拒否・',
      '  リダイレクト追従先の再検証）を揃えたうえでこのテストを更新してください。',
    ].join('\n')).toEqual([])
  })
})
