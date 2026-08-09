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
  CONTENT_DIR,
  findMissingCacheEntries,
  git,
  isReservedHost,
  readSource,
} from './ogp-link-cards'

/**
 * `--staged` はステージ（git index）の内容を検査する。コミット時に使う。
 *
 * **作業ツリーを読むと「`ogp:refresh` は実行したがキャッシュを add し忘れた」を
 * 見逃す。** 作業ツリーには新しいキャッシュがあるので検査は通ってしまい、
 * コミットには記事の変更だけが入って古いキャッシュのまま公開される。
 */
const source: Source = process.argv.includes('--staged') ? 'index' : 'worktree'

/**
 * `--if-relevant` は、ステージに関係する変更が無ければ何もせず終了する。
 *
 * pre-commit から毎回呼ぶための入口。全走査は docustation で 20 秒ほどかかるので、
 * 無関係なコミットまで待たせない。判定は `git diff --cached` 1回で済む。
 *
 * **lint-staged のフィルタでは代用できない。** 既定の diff-filter は ACMR で
 * **削除が含まれず**、`ogp-cache.json` を消すだけのコミットで検査が走らないまま
 * 通ってしまう（実測で確認済み。その後ビルドが静的 import で落ちる）。
 * ここでは D も含めて自前で判定する。
 */
const onlyIfRelevant = process.argv.includes('--if-relevant')

/**
 * 参照集合の定義に関わるスクリプト。これらが変わったら検査を走らせる。
 * リポジトリ直下からの相対パスで、git が返すパスと同じ表記にする。
 */
const EXTRACTOR_SCRIPT = 'scripts/ogp-link-cards.ts'
const SELF_SCRIPT = 'scripts/check-ogp-cache.ts'

/**
 * 検査を起動すべき変更か。
 *
 * 対象は content/ の markdown、キャッシュ本体、そして**抽出ロジック自身**。
 * ogp-link-cards.ts を変えると「何を参照とみなすか」が変わり、記事を一行も
 * 触っていなくても必要なキャッシュの中身が変わりうる。抽出側だけを直した
 * コミットが素通りすると、その時点で欠落が生まれても誰も気づかない。
 */
function stagedChangesAreRelevant(): boolean {
  // **--no-renames が要る。** 既定では `git mv` が R100 の1エントリになり、
  // --name-only は移動先だけを出す。ogp-cache.json を別名へ移すと元のパスが
  // 現れず、検査をすり抜けてビルドだけが壊れる（実測で確認済み）。
  // rename を「削除＋追加」に分解すれば両方のパスが見える。
  //
  // **--diff-filter は付けない。** 以前は ACMRD と列挙していたが、
  // キャッシュを symlink に差し替えると git は T（type change）を報告し、
  // その一文字が無いだけで検査をすり抜けた（実測で確認済み）。
  // 種別を数え上げる限り同じ取りこぼしが起き続けるので、絞らない。
  const paths = git([
    'diff',
    '--cached',
    '--name-only',
    '--no-renames',
    '-z',
  ])
    .toString('utf8')
    .split('\0')
    .filter(Boolean)

  return paths.some(
    path => path === CACHE_PATH
      || path === SELF_SCRIPT
      || path === EXTRACTOR_SCRIPT
      || (path.startsWith(`${CONTENT_DIR}/`) && path.endsWith('.md')),
  )
}

/**
 * 検査に使うコード自身が、ステージと作業ツリーで食い違っていないか。
 *
 * **tsx は作業ツリーのファイルを実行する。** 検査対象（記事・キャッシュ）は
 * index から読んでいるのに、読み取る側のロジックは作業ツリー版という
 * ねじれが起きうる。抽出ロジックを直してステージし、作業ツリーには
 * 古い版を残したままコミットすると、古い基準で検査して通してしまう
 * （未ステージの目印が実行されることを実測で確認済み）。
 *
 * index の TypeScript を取り出して実行する手もあるが、一時ファイルと
 * import の解決を自前で抱えることになる。対象は2ファイルだけで、
 * 部分ステージする場面もまず無いので、食い違いを検出して止める。
 */
function checkerFilesDifferFromIndex(): string[] {
  return git(['diff', '--name-only', '--', SELF_SCRIPT, EXTRACTOR_SCRIPT])
    .toString('utf8')
    .split('\n')
    .filter(Boolean)
}

async function readCache(): Promise<Record<string, unknown>> {
  try {
    const parsed: unknown = JSON.parse(await readSource(CACHE_PATH, source))

    // **JSON として妥当でも、形が違えば検査が空振りする。**
    // `[]` や `""` や `0` はキャストを素通りし、Object.keys() が空になるので
    // 「参照0件・stale 0件」で成功と報告してしまう（refresh が書き出すのは
    // 常にプレーンオブジェクト）。ここで形を確かめる。
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.error(`❌ ${CACHE_PATH} の中身が想定の形ではありません（検査対象: ${source === 'index' ? 'ステージの内容' : '作業ツリー'}）。`)
      console.error(`   URL をキーにしたオブジェクトである必要があります。実際の型: ${Array.isArray(parsed) ? 'array' : typeof parsed}`)
      console.error('   link-card が1件も無い場合は {} にしてください。')
      console.error('   `pnpm ogp:refresh` を実行すれば正しい形で書き出されます。\n')
      process.exit(1)
    }

    return parsed as Record<string, unknown>
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
  // 全走査の前に打ち切る。ここを通るのは content/ かキャッシュ、または
  // 抽出ロジックに触ったコミットだけなので、無関係なコミットに 20 秒待たせない。
  if (onlyIfRelevant && !stagedChangesAreRelevant())
    return

  // ステージを検査する以上、検査するコード自身もステージと一致していないと
  // 結果に意味がない。
  if (source === 'index') {
    const drifted = checkerFilesDifferFromIndex()

    if (drifted.length > 0) {
      console.error('❌ 検査に使うコード自身に未ステージの変更があります。')
      for (const path of drifted)
        console.error(`   - ${path}`)

      console.error('\n   検査は作業ツリーのコードで走るため、このままではコミット後の')
      console.error('   状態を保証できません（ステージ側の新しい抽出ロジックではなく、')
      console.error('   作業ツリーの古いロジックで判定してしまいます）。')
      console.error('   `git add` するか変更を戻してから、もう一度コミットしてください。\n')
      process.exit(1)
    }
  }

  const referenced = await collectReferencedUrls(source)
  const cache = await readCache()
  const missing = findMissingCacheEntries(referenced, cache)

  const unique = new Set(referenced)
  const skipped = [...unique].filter(url => isReservedHost(url))

  // `ogp:refresh` が書き出さないはずのエントリ。残っていれば refresh を
  // 回していない証拠になる。ビルドは壊れないが、消した記事の URL と
  // メタデータが成果物に残り続ける。「link-card を全部消したらキャッシュは
  // {} にする」と AGENTS.md に書いている以上、人の記憶ではなくここで担保する。
  //
  // **予約ホストは参照されていても stale。** refresh は予約ホストを取得対象から
  // 外すのでキャッシュに入れない。一方 findMissingCacheEntries も予約ホストを
  // 飛ばすため値の検証をしない。両方すり抜けるので、手で書いた壊れた
  // エントリが素通りしていた（実測で確認済み）。
  const stale = Object.keys(cache).filter(
    url => !unique.has(url) || isReservedHost(url),
  )

  if (missing.length === 0 && stale.length === 0) {
    const covered = unique.size - skipped.length
    console.log(`✅ link-card の OGP キャッシュは最新です（参照 ${unique.size} 件 / 取得対象 ${covered} 件 / 除外 ${skipped.length} 件）。`)

    return
  }

  const target = source === 'index' ? 'ステージの内容' : '作業ツリー'
  console.error(`❌ link-card と OGP キャッシュが一致していません（検査対象: ${target}）。`)

  // キーはあるが値が壊れている場合と、そもそも無い場合を区別して出す。
  // 前者は「refresh を忘れた」ではなく「JSON を手で触って壊した」なので、
  // 同じ文面だと原因を取り違える。
  if (missing.length > 0) {
    console.error('\n  キャッシュで賄えない URL:')
    for (const url of missing)
      console.error(`   - ${url}${url in cache ? '  ← エントリはあるが ogTitle/ogDescription/ogImage/ogUrl が揃っていない' : ''}`)
  }

  if (stale.length > 0) {
    console.error('\n  もう参照されていないのに残っているエントリ:')
    for (const url of stale)
      console.error(`   - ${url}`)

    console.error('     （消した記事の URL とメタデータが成果物に残り続けます）')
  }

  if (source === 'index') {
    console.error(`\n対処: \`pnpm ogp:refresh\` を実行し、\`git add ${CACHE_PATH}\` してからコミットしてください。`)
    console.error('      すでに refresh 済みなら add 漏れです。作業ツリーが最新でも、')
    console.error('      コミットに入らなければ古いキャッシュのまま公開されます。')
  }
  else {
    console.error(`\n対処: \`pnpm ogp:refresh\` を実行して ${CACHE_PATH} をコミットしてください。`)
  }

  if (missing.length > 0)
    console.error('      このまま公開すると、該当のカードはただのリンクとして表示されます。')

  console.error('')
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
