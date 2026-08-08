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

import type { Source } from './ogp-link-cards'
import process from 'node:process'
import {
  CACHE_PATH,
  collectReferencedUrls,
  findMissingCacheEntries,
  isReservedHost,
  readSource,
} from './ogp-link-cards'

/**
 * `--staged` はステージ（git index）の内容を検査する。lint-staged から呼ぶときに使う。
 *
 * **作業ツリーを読むと「`ogp:refresh` は実行したがキャッシュを add し忘れた」を
 * 見逃す。** 作業ツリーには新しいキャッシュがあるので検査は通ってしまい、
 * コミットには記事の変更だけが入って古いキャッシュのまま公開される。
 */
const source: Source = process.argv.includes('--staged') ? 'index' : 'worktree'

async function readCache(): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readSource(CACHE_PATH, source))
  }
  catch (error) {
    // ファイルの不在は作業ツリーなら ENOENT。index に無い場合 git show は 128 で
    // 終了するが、**execFileSync はその終了コードを error.status に載せる。
    // error.code は undefined のまま**（実測）。code だけを見ると index の
    // 不在を判定できない。
    const err = error as NodeJS.ErrnoException & { status?: number }

    // **キャッシュが無いこと自体をエラーにする。空として扱ってはいけない。**
    // LinkCard.vue が `import ogpCache from '~/data/ogp-cache.json'` と
    // 静的に読み込んでおり、nuxt.config.ts は app/components を global 登録して
    // Vite のエントリに含める。ファイルごと消すとビルドが
    // 「[UNLOADABLE_DEPENDENCY] Could not load ... (os error 2)」で失敗する（実測）。
    // link-card を全部消す場面でも、中身を {} にしてファイルは残す必要がある。
    if (err.code === 'ENOENT' || err.status === 128) {
      console.error(`❌ ${CACHE_PATH} がありません（検査対象: ${source === 'index' ? 'ステージの内容' : '作業ツリー'}）。`)
      console.error('   LinkCard.vue がこの JSON を静的 import しているため、ファイルごと')
      console.error('   消すとビルドが「Could not load ...」で失敗します。')
      console.error('   link-card を全部消した場合も、中身を {} にしてファイルは残してください。')
      console.error('   `pnpm ogp:refresh` は参照0件でも {} を書き出します。')
      process.exit(1)
    }

    console.error(`❌ ${CACHE_PATH} を読み込めませんでした。`)
    console.error(`   ${error instanceof Error ? error.message : String(error)}`)
    console.error(`   内容を確認し、直せないなら git で復元してください（例: git checkout -- ${CACHE_PATH}）。`)
    process.exit(1)
  }
}

async function main(): Promise<void> {
  const referenced = await collectReferencedUrls(source)
  const cache = await readCache()
  const missing = findMissingCacheEntries(referenced, cache)

  const unique = new Set(referenced)
  const skipped = [...unique].filter(url => isReservedHost(url))

  if (missing.length === 0) {
    const covered = unique.size - skipped.length
    console.log(`✅ link-card の OGP キャッシュは最新です（参照 ${unique.size} 件 / 取得対象 ${covered} 件 / 除外 ${skipped.length} 件）。`)

    return
  }

  console.error(`❌ キャッシュに無い link-card の URL があります（検査対象: ${source === 'index' ? 'ステージの内容' : '作業ツリー'}）。`)
  for (const url of missing)
    console.error(`   - ${url}`)

  if (source === 'index') {
    console.error(`\n対処: \`pnpm ogp:refresh\` を実行し、\`git add ${CACHE_PATH}\` してからコミットしてください。`)
    console.error('      すでに refresh 済みなら add 漏れです。作業ツリーが最新でも、')
    console.error('      コミットに入らなければ古いキャッシュのまま公開されます。')
  }
  else {
    console.error(`\n対処: \`pnpm ogp:refresh\` を実行して ${CACHE_PATH} をコミットしてください。`)
  }

  console.error('      このまま公開すると、該当のカードはただのリンクとして表示されます。\n')
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
