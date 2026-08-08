/**
 * link-card の URL 抽出と、取得対象外ホストの判定。
 *
 * **refresh-ogp.ts（取得して書き出す）と check-ogp-cache.ts（欠落を検査する）が
 * 共有する土台。** 読み取りと純粋関数だけを置き、書き込みとネットワークは
 * 呼び出し側に持たせる。どちらのスクリプトからも import できるように、
 * ここには実行される本体を書かないこと。
 *
 * 複製について:
 *   このファイルは nuxtation / docustation / private-nuxtation の
 *   3リポジトリにバイト単位で複製されている。変更する場合は
 *   3リポすべてに同じ変更を適用すること（同期を強制する仕組みは無い）。
 */

import type { MDCNode, MDCRoot } from '@nuxtjs/mdc'
import type { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

/**
 * 走査対象と出力先。**取得側と検査側の両方がここを見る。**
 * それぞれが自前で 'content' と書くと、片方だけ広げたときに
 * 「取得はするのに検査は見ていない」というずれ方をする。
 */
export const CONTENT_DIR = 'content'
export const CACHE_PATH = 'app/data/ogp-cache.json'

/** ogp-cache.json に保存するフィールド。OGS の生レスポンスは大きいので絞る。 */
export interface OgpEntry {
  ogTitle: string
  ogDescription: string
  /** OGS の ogImage[0].url を文字列に平坦化したもの */
  ogImage: string
  ogUrl: string
}

/**
 * AST を深さ優先で歩き、link-card ノードの URL を集める。
 *
 * **MDC は記法によって属性名の形を変える。** inline 記法
 * `::link-card{propsUrl="..."}` の属性は HTML 属性として扱われ kebab-case に
 * 正規化される（`props-url`）が、Block 記法の YAML は素のオブジェクトなので
 * camelCase のまま渡る（`propsUrl`）。両方見ないと片方を取りこぼす。
 * LinkCard.vue 側は `propsUrl: String` 宣言で Vue の props 正規化が効くため
 * どちらでも描画される。抽出だけが追随していないと表示が静かに劣化する。
 */
function collectLinkCardUrls(node: MDCRoot | MDCNode, found: string[]): string[] {
  if ('tag' in node && node.tag === 'link-card') {
    // `::link-card{:props-url="cardUrl"}` のようにフロントマターの値を
    // バインドされると、AST には `{ ':props-url': 'cardUrl' }` が入る。
    // MDCRenderer は propsToDataRxBind でコロンを外して値を解決するので
    // **カードは描画されるのに、ここでは URL を拾えない**（実測で確認済み）。
    //
    // ast.data から解決する道もあるが、dot-path や式の扱いまで
    // MDCRenderer の挙動を写し取ることになり、ズレれば同じ種類の
    // 取りこぼしを別の形で作る。未対応であることを明示して止める。
    const bound = Object.keys(node.props ?? {}).find(
      key => key === ':props-url' || key === ':propsUrl',
    )
    if (bound) {
      throw new Error(
        `link-card の \`${bound}\` （バインド記法）には対応していません。\n`
        + `  OGP はビルド前に取得するため、URL が markdown 上で確定している必要があります。\n`
        + `  \`::link-card{propsUrl="https://..."}\` のように直接書いてください。`,
      )
    }

    const url = node.props?.propsUrl ?? node.props?.['props-url']
    if (typeof url === 'string')
      found.push(url)
  }

  // MDCText / MDCComment は children を持たない。'in' で絞れば型も合う。
  if ('children' in node) {
    for (const child of node.children)
      collectLinkCardUrls(child, found)
  }

  return found
}

/**
 * markdown 中の link-card から URL を抽出する。
 *
 * **@nuxt/content がビルドで実際に使っているパーサ（@nuxtjs/mdc）に通す。**
 * 以前は正規表現 `/link-card\{[^}]*propsUrl=["']([^"']+)["']/g` で拾っていたが、
 * 文字列としてしか見ないため2つの取り違えがあった:
 *
 *   1. コードフェンス内の使用例まで拾う。実際 `content/blog/` の記事にある
 *      ```md ブロックの `https://example.com` を拾っていた（isReservedHost が
 *      偶然弾いていただけで、実在URLを例示に書けば不要な取得が走る）
 *   2. Block 記法（`::link-card` ＋ YAML frontmatter）は `{` が無いので拾えない。
 *      記事が「Block Components形式でも書ける」と教えている書き方だった
 *
 * AST ではコードフェンスもインラインコードも code ノードの**文字列**になるので、
 * link-card ノードとして現れない。この2つは構造上まとめて解決する。
 */
export async function extractLinkCardUrls(markdown: string): Promise<string[]> {
  const ast = await parseMarkdown(markdown, {})

  return collectLinkCardUrls(ast.body, [])
}

/**
 * 読み取り元。
 *
 * - `worktree`: 作業ツリーのファイルをそのまま読む。手で実行するときはこちら。
 * - `index`: `git add` 済みの内容（ステージ）を読む。**コミット時はこちらでないと
 *   「`ogp:refresh` は実行したがキャッシュを add し忘れた」を見逃す。**
 *   作業ツリーには新しいキャッシュがあるので検査は通るのに、コミットには
 *   記事の変更だけが入り、古いキャッシュのまま公開されてしまう。
 */
export type Source = 'worktree' | 'index'

/**
 * git を呼んで stdout を返す。check-ogp-cache.ts も使う。
 *
 * stderr も pipe で受ける。既定では stderr が親へそのまま流れるため、
 * **想定内の失敗でも git の `fatal:` が画面に出てしまう**（キャッシュの削除を
 * ステージしたときの `git show` など）。失敗時の内容は error.stderr で読める。
 */
export function git(args: string[]): Buffer {
  return execFileSync('git', args, { stdio: ['pipe', 'pipe', 'pipe'] })
}

/** CONTENT_DIR 配下の markdown を集める。index 指定時は追跡済みのものだけが対象。 */
async function listMarkdownFiles(source: Source): Promise<string[]> {
  if (source === 'index') {
    // -z で NUL 区切り。パスに空白や改行が入っても壊れない。
    return git(['ls-files', '-z', '--', CONTENT_DIR])
      .toString('utf8')
      .split('\0')
      .filter(path => path.endsWith('.md'))
  }

  const entries = await readdir(CONTENT_DIR, { recursive: true, withFileTypes: true })

  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => join(entry.parentPath, entry.name))
}

/** ファイル1件を読む。index 指定時は `git show :<path>` でステージの内容を取る。 */
export async function readSource(path: string, source: Source): Promise<string> {
  if (source === 'index')
    return git(['show', `:${path}`]).toString('utf8')

  return readFile(path, 'utf8')
}

/**
 * content/ 全体を走査して、参照されている link-card の URL を集める。
 *
 * **取得側（refresh-ogp.ts）と検査側（check-ogp-cache.ts）が同じ関数を呼ぶ。**
 * 「どこを見るか」と「どう拾うか」が一箇所に集まるので、片方だけが
 * 新しい記法や新しいディレクトリに追随して食い違うことがない。
 * 重複は取り除かない（何件参照されたかは呼び出し側で意味が変わるため）。
 */
export async function collectReferencedUrls(source: Source = 'worktree'): Promise<string[]> {
  const files = await listMarkdownFiles(source)

  const referenced: string[] = []
  for (const file of files)
    referenced.push(...await extractLinkCardUrls(await readSource(file, source)))

  return referenced
}

/**
 * RFC 2606 / 6761 で例示・ドキュメント用に予約されたホストか。
 *
 * example.com は IANA の最小ページで OG タグを持たないため、取得しても
 * 空のカードにしかならない。取得を試みる意味がないので対象から外す。
 * これはセキュリティ制御ではない（SSRF 対策はエンドポイント廃止そのものが担う）。
 */
export function isReservedHost(url: string): boolean {
  let hostname: string
  try {
    hostname = new URL(url).hostname.toLowerCase()
  }
  catch {
    return false
  }

  const reservedTlds = ['test', 'example', 'invalid', 'localhost']
  if (reservedTlds.some(tld => hostname === tld || hostname.endsWith(`.${tld}`)))
    return true

  const reservedDomains = ['example.com', 'example.net', 'example.org']

  return reservedDomains.some(
    domain => hostname === domain || hostname.endsWith(`.${domain}`),
  )
}

/**
 * キャッシュの値が LinkCard.vue の期待する形か。
 *
 * **キーの有無だけでは足りない。** LinkCard.vue は ogTitle / ogDescription /
 * ogImage / ogUrl を実行時の検証なしに読むので、値が null やスカラー、
 * フィールド欠けのオブジェクトだと空のカードや壊れた表示になる。
 * それでも `url in cache` は true なので、キーだけ見ていると
 * 「キャッシュは最新です」と報告してしまう。
 *
 * 空文字は許す。取得できなかった項目に refresh-ogp.ts が `?? ''` で
 * 入れる正規の値で、LinkCard.vue 側もフォールバックを持っている。
 */
function isValidOgpEntry(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false

  const entry = value as Record<string, unknown>

  return (['ogTitle', 'ogDescription', 'ogImage', 'ogUrl'] satisfies (keyof OgpEntry)[])
    .every(field => typeof entry[field] === 'string')
}

/**
 * 参照されているのにキャッシュで賄えない URL を返す。空配列なら欠落なし。
 *
 * `pnpm ogp:refresh` の実行忘れを検出するためのもの。以前は忘れても
 * build / test / lint が全部通り、記事を公開してから
 * 「カードがただのリンクになっている」ことに気づくしかなかった。
 * キーがあっても中身が壊れていれば同じ結果になるので、値の形まで見る。
 *
 * 予約ホストは refresh-ogp.ts 側でも取得対象から外れる（＝キャッシュに
 * 入らないのが正しい状態）ので、ここでも同じ基準で除く。判定を二重に
 * 書くとずれるため、除外は isReservedHost 一箇所に寄せている。
 *
 * 同じ URL が複数記事から参照されることがあるので一意化してから返す。
 * 欠落をそのままエラーメッセージに並べるため、重複していると読みにくい。
 */
export function findMissingCacheEntries(
  urls: string[],
  cache: Record<string, unknown>,
): string[] {
  return [...new Set(urls)].filter(
    url => !isReservedHost(url) && !isValidOgpEntry(cache[url]),
  )
}
