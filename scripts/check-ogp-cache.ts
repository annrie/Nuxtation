/**
 * OGP キャッシュの取りこぼし検知
 *
 * 背景:
 *   記事に link-card を足したあと `pnpm ogp:refresh` を忘れても、
 *   build も lint も通ってしまう。LinkCard.vue はキャッシュに無い URL を
 *   受け取ると、カードを諦めてただのリンクへ静かにフォールバックする
 *   （`v-else-if="propsUrl"` の分岐）。エラーも警告も出ないので、
 *   公開してから見た目で気づくしかなかった。
 *
 * このスクリプトの役割:
 *   content/ が参照している link-card の URL が、すべて
 *   app/data/ogp-cache.json に入っているかを検査する。
 *   キャッシュはコミット済みの成果物なので、**ネットワークには出ない**。
 *   取得側と同じ collectReferencedUrls() を使うため、走査対象や
 *   対応記法がずれることはない。
 *
 * 使い方:
 *   pnpm check:ogp-cache
 *
 *   欠落があれば exit 1。コミット時にも lint-staged 経由で走る
 *   （content/**\/*.md を変更したときだけ）。
 *
 * 複製について:
 *   このファイルは nuxtation / docustation / private-nuxtation の
 *   3リポジトリにバイト単位で複製されている。変更する場合は
 *   3リポすべてに同じ変更を適用すること（同期を強制する仕組みは無い）。
 */

import { readFile } from 'node:fs/promises'
import process from 'node:process'
import {
  CACHE_PATH,
  collectReferencedUrls,
  findMissingCacheEntries,
  isReservedHost,
} from './ogp-link-cards'

async function readCache(): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(CACHE_PATH, 'utf8'))
  }
  catch (error) {
    // 存在しない場合も「まだ一度も取得していない」という欠落なので、
    // 空として扱って後段の欠落報告に任せる。参照が0件なら成功のままになる。
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return {}

    console.error(`❌ ${CACHE_PATH} を読み込めませんでした。`)
    console.error(`   ${error instanceof Error ? error.message : String(error)}`)
    console.error(`   内容を確認し、直せないなら git で復元してください（例: git checkout -- ${CACHE_PATH}）。`)
    process.exit(1)
  }
}

async function main(): Promise<void> {
  const referenced = await collectReferencedUrls()
  const cache = await readCache()
  const missing = findMissingCacheEntries(referenced, cache)

  const unique = new Set(referenced)
  const skipped = [...unique].filter(url => isReservedHost(url))

  if (missing.length === 0) {
    const covered = unique.size - skipped.length
    console.log(`✅ link-card の OGP キャッシュは最新です（参照 ${unique.size} 件 / 取得対象 ${covered} 件 / 除外 ${skipped.length} 件）。`)

    return
  }

  console.error('❌ キャッシュに無い link-card の URL があります。')
  for (const url of missing)
    console.error(`   - ${url}`)

  console.error(`\n対処: \`pnpm ogp:refresh\` を実行して ${CACHE_PATH} をコミットしてください。`)
  console.error('      このまま公開すると、該当のカードはただのリンクとして表示されます。\n')
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
