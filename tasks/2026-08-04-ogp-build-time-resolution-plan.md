# OGP ビルド時解決への移行 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 任意URLを取得できる `/api/ogp` を3リポジトリから廃止し、OGP をコミット済み JSON によるビルド時解決へ移す。

**Architecture:** content の markdown から `::link-card{propsUrl="..."}` を抽出して OGP を取得する手動実行スクリプトを置き、結果を `app/data/ogp-cache.json` にコミットする。`LinkCard.vue` はこの JSON を静的 import して同期的に引く。実行時のサーバーエンドポイントは削除する。

**Tech Stack:** Nuxt 4 / TypeScript / tsx（スクリプト実行）/ open-graph-scraper 6 / vitest 4 / Playwright

設計は `tasks/2026-08-04-ogp-build-time-resolution-design.md` を参照。

## Global Constraints

- 対象は nuxtation / docustation / private-nuxtation の3リポジトリのみ。ladybugs / nuxt-landing は対象外
- スクリプトは `scripts/*.ts` を `npx tsx` で実行する既存慣習に合わせる（`check:contrast` / `check:css-layers` と同じ形）
- private-nuxtation の規約: **`test/`（単数）が vitest、`tests/`（複数）が Playwright**。混同するとテストが全落ちする
- `LinkCard.vue` は3リポで差分がある（docustation 10行差、private-nuxtation 220行差）。**機械的コピー禁止**。各リポの既存コメントと整形を保って手で編集する
- `scripts/ogp-link-cards.ts` と `scripts/refresh-ogp.ts` は3リポで**完全に同一**にする。差分が出たら誤り
- 保存する OGP フィールドは `ogTitle` / `ogDescription` / `ogImage` / `ogUrl` の4つのみ。`ogImage` は OGS の `ogImage[0].url` を文字列に平坦化する
- JSON はキー昇順で出力する（git 差分を安定させるため）
- 3リポとも `fix/ogp-build-time-resolution` ブランチで作業する。develop へ直接コミットしない
- コミットは Conventional Commits。本文末尾に `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- 各リポのビルド確認: nuxtation は `pnpm build`（`preset: 'vercel'` なので出力は `.vercel/output`）。
  **docustation / private-nuxtation は `pnpm build` ではなく `pnpm generate` で検証する**。全ルートの
  prerender を通すぶん build より厳しく、静的出力まで確認できる。以前は重いためユーザー実行の運用だったが、
  高速化したのでこちら側で実行してよい（2026-08-04 ユーザー指示）

## 計画上の判断（spec からの差異）

spec のテスト節は「ユニットテストは private-nuxtation にのみ置く」とした。その結果、
TDD でスクリプトを書けるのは private-nuxtation だけになる。そこで**スクリプトの開発だけ
private-nuxtation を先頭に置き**、その後 spec の展開順（nuxtation → docustation →
private-nuxtation）でコンポーネント側を進める。

spec が nuxtation を先頭に置いた理由は「Vercel 自動デプロイで検証が効く」ことであり、
これはコンポーネントとエンドポイントの変更に対する理由なので、スクリプト開発の順序とは
independent である。

---

## File Structure

| ファイル | 責務 | 対象リポ |
|---|---|---|
| `scripts/ogp-link-cards.ts` | 純粋関数のみ。URL抽出と予約ドメイン判定。I/O を持たない | 3リポ共通・同一 |
| `scripts/refresh-ogp.ts` | I/O と実行。ファイル走査・OGP取得・JSON書き出し | 3リポ共通・同一 |
| `test/ogp-link-cards.spec.ts` | 純粋関数のユニットテスト | private-nuxtation のみ |
| `app/data/ogp-cache.json` | 取得結果。生成物だがコミットする | 3リポ（内容は同一になる見込み） |
| `tests/ogp-endpoint-removed.spec.ts` | `/api/ogp` が404であることの回帰テスト | 3リポ共通・同一 |
| `app/components/content/LinkCard.vue` | JSON を引いて描画。フォールバックは素のリンク | 3リポ（各々手で編集） |

純粋関数を `ogp-link-cards.ts` に分けるのは、テストがファイルシステムもネットワークも
触らずに済むようにするため。`refresh-ogp.ts` を直接 import するとスクリプト本体が走る。

---

### Task 1: 抽出ロジックの純粋関数とテスト（private-nuxtation）

**Files:**
- Create: `/Users/annrie/LocalSites/private-nuxtation/scripts/ogp-link-cards.ts`
- Create: `/Users/annrie/LocalSites/private-nuxtation/test/ogp-link-cards.spec.ts`

**Interfaces:**
- Consumes: なし
- Produces:
  - `extractLinkCardUrls(markdown: string): string[]`
  - `isReservedHost(url: string): boolean`
  - `interface OgpEntry { ogTitle: string, ogDescription: string, ogImage: string, ogUrl: string }`

- [ ] **Step 1: 失敗するテストを書く**

`test/ogp-link-cards.spec.ts` を作成:

```typescript
import { describe, expect, it } from 'vitest'
import { extractLinkCardUrls, isReservedHost } from '../scripts/ogp-link-cards'

describe('extractLinkCardUrls', () => {
  it('::link-card 記法から URL を抜き出す', () => {
    const md = '::link-card{propsUrl="https://example.jp/a"}'

    expect(extractLinkCardUrls(md)).toEqual(['https://example.jp/a'])
  })

  it('1ファイル内の複数の link-card をすべて拾う', () => {
    const md = [
      '# 見出し',
      '::link-card{propsUrl="https://example.jp/a"}',
      '本文',
      '::link-card{propsUrl="https://example.jp/b"}',
    ].join('\n')

    expect(extractLinkCardUrls(md)).toEqual([
      'https://example.jp/a',
      'https://example.jp/b',
    ])
  })

  it('シングルクォート記法も拾う', () => {
    const md = '::link-card{propsUrl=\'https://example.jp/a\'}'

    expect(extractLinkCardUrls(md)).toEqual(['https://example.jp/a'])
  })

  it('link-card 以外の記法は拾わない', () => {
    const md = '::other-card{propsUrl="https://example.jp/a"}'

    expect(extractLinkCardUrls(md)).toEqual([])
  })

  it('link-card が無ければ空配列', () => {
    expect(extractLinkCardUrls('ただの本文')).toEqual([])
  })
})

describe('isReservedHost', () => {
  it.each([
    'https://example.com',
    'https://example.net/path',
    'https://example.org',
    'https://www.example.com',
    'https://foo.test',
    'https://foo.example',
    'https://foo.invalid',
    'http://localhost',
    'http://foo.localhost',
  ])('予約ドメインと判定する: %s', (url) => {
    expect(isReservedHost(url)).toBe(true)
  })

  it.each([
    'https://qiita.com/kurokawa516/items/80ea1a0e3a3f51a44f2b',
    'https://www.mt-work.com/blog/post-5/',
    'https://example.jp',
    'https://notexample.com',
  ])('通常のホストは予約扱いにしない: %s', (url) => {
    expect(isReservedHost(url)).toBe(false)
  })

  it('URL として解釈できない文字列は予約扱いにしない', () => {
    expect(isReservedHost('not a url')).toBe(false)
  })
})
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm vitest run test/ogp-link-cards.spec.ts
```

Expected: FAIL。`../scripts/ogp-link-cards` が解決できない旨のエラー。

- [ ] **Step 3: 純粋関数を実装する**

`scripts/ogp-link-cards.ts` を作成:

```typescript
/**
 * link-card の URL 抽出と、取得対象外ホストの判定。
 *
 * ファイルシステムもネットワークも触らない純粋関数だけを置く。
 * 副作用のある処理は refresh-ogp.ts 側にある。テストからは
 * このファイルだけを import する（refresh-ogp.ts を import すると
 * スクリプト本体が走ってしまうため）。
 */

/** ogp-cache.json に保存するフィールド。OGS の生レスポンスは大きいので絞る。 */
export interface OgpEntry {
  ogTitle: string
  ogDescription: string
  /** OGS の ogImage[0].url を文字列に平坦化したもの */
  ogImage: string
  ogUrl: string
}

/**
 * `::link-card{propsUrl="..."}` から URL を抽出する。
 *
 * 実測した記法は3リポとも `::link-card{propsUrl="..."}` の1種類のみだが、
 * 先頭のコロン数と引用符の種類は縛らずに拾う。
 */
export function extractLinkCardUrls(markdown: string): string[] {
  const pattern = /link-card\{[^}]*propsUrl=["']([^"']+)["']/g

  return [...markdown.matchAll(pattern)].map(match => match[1])
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
```

- [ ] **Step 4: テストが通ることを確認する**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm vitest run test/ogp-link-cards.spec.ts
```

Expected: PASS（19 tests）。内訳は `extractLinkCardUrls` が5件、`isReservedHost` が
`it.each` の9件＋4件＋単発1件で14件。

- [ ] **Step 5: lint を通す**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm lint
```

Expected: エラーなし。出た場合は `pnpm lint:fix` で整えて再実行する。
antfu 設定は `import type` の分離を求めることがあるので、`type OgpEntry` のインライン
import が指摘されたら lint:fix に従う。

- [ ] **Step 6: コミット**

```bash
cd /Users/annrie/LocalSites/private-nuxtation
git add scripts/ogp-link-cards.ts test/ogp-link-cards.spec.ts
git commit -m "$(cat <<'EOF'
feat(ogp): link-card の URL 抽出と予約ドメイン判定を追加

/api/ogp 廃止に向けた土台。ビルド前に OGP を解決するスクリプトの
純粋関数部分だけを先に切り出す。

ファイルシステムもネットワークも触らないため、テストからモックなしで
呼べる。副作用のある処理は後続の refresh-ogp.ts に置く。

予約ドメイン(RFC 2606 / 6761)を除外するのは、example.com が OG タグを
持たず取得しても空のカードにしかならないため。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: 取得スクリプト本体（private-nuxtation）

**Files:**
- Create: `/Users/annrie/LocalSites/private-nuxtation/scripts/refresh-ogp.ts`
- Modify: `/Users/annrie/LocalSites/private-nuxtation/package.json`（`scripts` に `ogp:refresh` を追加）

**Interfaces:**
- Consumes: `extractLinkCardUrls`, `isReservedHost`, `OgpEntry`（Task 1）
- Produces: `pnpm ogp:refresh` コマンド。`app/data/ogp-cache.json` を生成する

- [ ] **Step 1: スクリプトを実装する**

`scripts/refresh-ogp.ts` を作成:

```typescript
/**
 * link-card の OGP をビルド前に解決して JSON にキャッシュする。
 *
 * 背景:
 *   以前は server/api/ogp.ts が実行時に `?url=` を受けて取得していたが、
 *   宛先の検証が無く任意のホストへリクエストを飛ばせる状態だった。
 *   link-card の URL は自サイトの markdown 由来で、ビルド時に確定する
 *   閉じた集合なので、実行時に取得する必要がそもそも無い。
 *
 * 使い方:
 *   pnpm ogp:refresh
 *
 *   記事に link-card を足したら実行してコミットする。ビルド自体は
 *   この JSON を読むだけでネットワークに出ない。
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import process from 'node:process'
import ogs from 'open-graph-scraper'
import { extractLinkCardUrls, isReservedHost, type OgpEntry } from './ogp-link-cards'

const CONTENT_DIR = 'content'
const CACHE_PATH = 'app/data/ogp-cache.json'
const REQUEST_TIMEOUT_MS = 20000

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })

  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => join(entry.parentPath, entry.name))
}

async function readCache(): Promise<Record<string, OgpEntry>> {
  try {
    return JSON.parse(await readFile(CACHE_PATH, 'utf8'))
  }
  catch {
    return {}
  }
}

async function main(): Promise<void> {
  const files = await collectMarkdownFiles(CONTENT_DIR)

  const referenced = new Set<string>()
  for (const file of files) {
    for (const url of extractLinkCardUrls(await readFile(file, 'utf8')))
      referenced.add(url)
  }

  // 既存の値を引き継ぐ。ただし content から参照されなくなった URL は落とす。
  // 取得に失敗しても前回取れた値を残すのが狙いで、一時的な障害で
  // 良いデータを失わないようにするため。
  const existing = await readCache()
  const next: Record<string, OgpEntry> = {}
  for (const [url, entry] of Object.entries(existing)) {
    if (referenced.has(url))
      next[url] = entry
  }

  const skipped: string[] = []
  const targets: string[] = []
  for (const url of referenced) {
    if (isReservedHost(url))
      skipped.push(url)
    else
      targets.push(url)
  }

  const failed: string[] = []
  for (const url of targets) {
    try {
      const { result, error } = await ogs({ url, timeout: REQUEST_TIMEOUT_MS })

      if (error || !result?.success) {
        failed.push(url)
        continue
      }

      next[url] = {
        ogTitle: result.ogTitle ?? '',
        ogDescription: result.ogDescription ?? '',
        ogImage: result.ogImage?.[0]?.url ?? '',
        ogUrl: result.ogUrl ?? url,
      }
    }
    catch {
      failed.push(url)
    }
  }

  // キー昇順で書き出す。git の差分を安定させるため。
  const sorted = Object.fromEntries(
    Object.entries(next).sort(([a], [b]) => a.localeCompare(b)),
  )
  await mkdir(dirname(CACHE_PATH), { recursive: true })
  await writeFile(CACHE_PATH, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8')

  console.log(`[ogp] 参照 ${referenced.size} 件 / 取得成功 ${Object.keys(sorted).length} 件`)
  console.log(`[ogp] 書き出し: ${CACHE_PATH}`)

  // 「除外」と「失敗」を分けて出す。混ぜると本物の障害が埋もれる。
  if (skipped.length > 0)
    console.log(`[ogp] 除外(例示用ドメイン): ${skipped.join(', ')}`)

  if (failed.length > 0)
    console.warn(`[ogp] 取得失敗: ${failed.join(', ')}`)

  // 全滅はネットワーク断の可能性が高い。空の JSON をコミットする事故を防ぐ。
  if (targets.length > 0 && failed.length === targets.length) {
    console.error('[ogp] 取得対象がすべて失敗した。ネットワークを確認すること。')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
```

- [ ] **Step 2: package.json にスクリプトを追加する**

`scripts` に以下を追加する。既存の `check:contrast` の並びに合わせる:

```json
"ogp:refresh": "npx tsx scripts/refresh-ogp.ts",
```

- [ ] **Step 3: 実行して JSON が生成されることを確認する**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm ogp:refresh
```

Expected: 標準出力に「参照 3 件 / 取得成功 2 件」、除外に `https://exanple.com` が出ない
（typo のため予約ドメイン判定に掛からず、取得失敗側に出る）。この時点では typo 未修正なので
**失敗1件が正しい挙動**。exit code は 0（全滅ではないため）。

- [ ] **Step 4: 生成物を目視で確認する**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && cat app/data/ogp-cache.json
```

Expected: qiita.com と mt-work.com の2エントリ。各エントリが `ogTitle` / `ogDescription` /
`ogImage` / `ogUrl` の4キーのみを持ち、`ogImage` が文字列であること。

- [ ] **Step 5: lint を通す**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm lint
```

Expected: エラーなし。

- [ ] **Step 6: コミット**

```bash
cd /Users/annrie/LocalSites/private-nuxtation
git add scripts/refresh-ogp.ts package.json app/data/ogp-cache.json
git commit -m "$(cat <<'EOF'
feat(ogp): OGP をビルド前に解決する pnpm ogp:refresh を追加

content の link-card を走査して OGP を取得し app/data/ogp-cache.json に
書き出す。記事に link-card を足したら実行してコミットする運用。

取得失敗時は JSON の前回値を残す。一時的な障害で取得済みの値を失わない
ため。ただし取得対象が全滅した場合はネットワーク断の可能性が高いので
exit 1 にして、空の JSON をコミットする事故を防ぐ。

キーは昇順で書き出して git の差分を安定させる。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: nuxtation の切り替え

**Files:**
- Create: `/Users/annrie/LocalSites/nuxtation/scripts/ogp-link-cards.ts`（Task 1 と同一）
- Create: `/Users/annrie/LocalSites/nuxtation/scripts/refresh-ogp.ts`（Task 2 と同一）
- Create: `/Users/annrie/LocalSites/nuxtation/tests/ogp-endpoint-removed.spec.ts`
- Delete: `/Users/annrie/LocalSites/nuxtation/server/api/ogp.ts`
- Modify: `/Users/annrie/LocalSites/nuxtation/app/components/content/LinkCard.vue`
- Modify: `/Users/annrie/LocalSites/nuxtation/content/blog/06.nuxt-link-card-implementation.md`
- Modify: `/Users/annrie/LocalSites/nuxtation/package.json`

**Interfaces:**
- Consumes: Task 1 / Task 2 で確定したスクリプト2ファイル
- Produces: なし（以降のタスクは同じ手順を別リポで繰り返す）

- [ ] **Step 1: スクリプトを移植する**

```bash
cd /Users/annrie/LocalSites/nuxtation
cp /Users/annrie/LocalSites/private-nuxtation/scripts/ogp-link-cards.ts scripts/
cp /Users/annrie/LocalSites/private-nuxtation/scripts/refresh-ogp.ts scripts/
diff scripts/ogp-link-cards.ts /Users/annrie/LocalSites/private-nuxtation/scripts/ogp-link-cards.ts
diff scripts/refresh-ogp.ts /Users/annrie/LocalSites/private-nuxtation/scripts/refresh-ogp.ts
```

Expected: diff の出力なし（完全同一）。

- [ ] **Step 2: content の typo を直す**

`content/blog/06.nuxt-link-card-implementation.md` の
`::link-card{propsUrl="https://exanple.com"}` を
`::link-card{propsUrl="https://example.com"}` に修正する。

- [ ] **Step 3: package.json を編集する**

`scripts` に追加:

```json
"ogp:refresh": "npx tsx scripts/refresh-ogp.ts",
```

`open-graph-scraper` を devDependencies へ移す:

```bash
cd /Users/annrie/LocalSites/nuxtation && pnpm add -D open-graph-scraper
```

- [ ] **Step 4: キャッシュを生成する**

```bash
cd /Users/annrie/LocalSites/nuxtation && pnpm ogp:refresh
```

Expected: 「参照 3 件 / 取得成功 2 件」。除外に `https://example.com` が出る。
取得失敗は 0 件。exit code 0。

- [ ] **Step 5: LinkCard.vue の script 部分を書き換える**

`<script setup lang="ts">` の中身を以下に置き換える。`onMounted` / `useLazyFetch` /
`isDevRun` / `watch` はすべて不要になる:

```typescript
import { computed } from 'vue'
import ogpCache from '~/data/ogp-cache.json'

// scripts/ogp-link-cards.ts にも同名の型があるが、あちらは開発用スクリプトで
// アプリのビルド対象外なので import せず、ここで独立に宣言する。
// app/ が scripts/ に依存する形は避ける。4フィールドしかないため重複の負担は小さい。
interface OgpEntry {
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
}

const props = defineProps({
  propsUrl: String,
  title: String,
  siteUrl: String,
  description: String,
})

// OGP はビルド前に pnpm ogp:refresh で解決してコミットしてある。
// 以前は /api/ogp を実行時に叩いていたが、任意URLを取得できる穴だったため
// エンドポイントごと廃止した。JSON に無い URL は素のリンクにフォールバックする。
const ogpData = computed<OgpEntry | null>(() => {
  if (!props.propsUrl)
    return null

  return (ogpCache as Record<string, OgpEntry>)[props.propsUrl] ?? null
})

const maxLength = 40

const limitedTitle = computed(() => {
  if (!ogpData.value)
    return ''
  const base = ogpData.value.ogTitle || props.title || ''
  return base.length > maxLength ? `${base.substring(0, maxLength)}...` : base
})

const limitedDescription = computed(() => {
  if (!ogpData.value)
    return ''
  const base = ogpData.value.ogDescription || props.description || ''
  const maxDescLength = 120
  return base.length > maxDescLength ? `${base.substring(0, maxDescLength)}...` : base
})
```

- [ ] **Step 6: LinkCard.vue の template を書き換える**

画像の参照を平坦化後のフィールドに合わせ、`v-else` の分岐をスピナーから素のリンクに変える。

`:src="ogpData.ogImage?.[0]?.url || '/img/ogp.png'"` を次に変更:

```
:src="ogpData.ogImage || '/img/ogp.png'"
```

`v-else` のスピナー要素（`Loading link card...` の div）を次に置き換える:

```vue
<NuxtLink
  v-else
  :to="propsUrl"
  target="_blank"
  rel="noopener noreferrer"
  class="link-card-fallback"
>
  {{ title || propsUrl }}
</NuxtLink>
```

`<style scoped>` の末尾に追加:

```css
.link-card-fallback {
  @apply text-primary-600 dark:text-primary-400 underline underline-offset-2 break-all;
}
```

- [ ] **Step 7: エンドポイントを削除する**

```bash
cd /Users/annrie/LocalSites/nuxtation && git rm server/api/ogp.ts
```

- [ ] **Step 8: 回帰テストを書く**

`tests/ogp-endpoint-removed.spec.ts` を作成:

```typescript
import { expect, test } from '@playwright/test'

// /api/ogp は 2026-08-04 に廃止した。`?url=` を検証せずに取得する
// エンドポイントで、公開状態のまま任意ホストへリクエストを飛ばせた。
// OGP はビルド時解決へ移したので、このルートが復活したら同じ穴が開く。
test('/api/ogp は廃止されている', async ({ request }) => {
  const response = await request.get('/api/ogp?url=https://example.com')

  expect(response.status()).toBe(404)
})
```

- [ ] **Step 9: lint と型チェックを通す**

```bash
cd /Users/annrie/LocalSites/nuxtation && pnpm lint
```

Expected: エラーなし。JSON import の型エラーが出る場合は `tsconfig` の
`resolveJsonModule` を確認する（Nuxt 既定では有効）。

- [ ] **Step 10: ビルドして成果物を検証する**

```bash
cd /Users/annrie/LocalSites/nuxtation && pnpm build
```

Expected: exit 0。

続けて効果を実測する:

```bash
cd /Users/annrie/LocalSites/nuxtation
grep -o '"undici"[^,}]*' .vercel/output/functions/__fallback.func/package.json || echo "undici の宣言なし（期待どおり）"
ls .vercel/output/functions/__fallback.func/chunks/routes/api/ 2>/dev/null || echo "api ルートなし（期待どおり）"
```

Expected: undici の宣言が消えていること（変更前は `"undici": "7.29.0"`）。
`chunks/routes/api/ogp.mjs` が生成されないこと。

- [ ] **Step 11: e2e を実行する**

```bash
cd /Users/annrie/LocalSites/nuxtation && pnpm test:e2e
```

Expected: 既存のスモークテストと新しい404テストがすべて PASS。

- [ ] **Step 12: コミット**

```bash
cd /Users/annrie/LocalSites/nuxtation
git add scripts/ogp-link-cards.ts scripts/refresh-ogp.ts tests/ogp-endpoint-removed.spec.ts \
  app/data/ogp-cache.json app/components/content/LinkCard.vue \
  content/blog/06.nuxt-link-card-implementation.md package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
fix(security): 🔒 /api/ogp を廃止し OGP をビルド時解決へ移行

任意URLをサーバーサイドで取得できるエンドポイントだった。?url= に
許可リストもプライベートIPの拒否も無く、open-graph-scraper は
followRedirect が既定で有効なため追従先でも抜けられる状態だった。

呼び出し元は LinkCard.vue だけで、URL は自サイトの markdown 由来の
閉じた集合（同一記事の3箇所のみ）。実行時に任意URLを受ける必要が
無いため、宛先検証を足すのではなくエンドポイントごと削除した。

OGP は pnpm ogp:refresh でビルド前に解決し、app/data/ogp-cache.json を
コミットする。LinkCard.vue はこれを静的 import して同期的に引く。
dev で onMounted、本番で useLazyFetch という非対称な分岐も解消した。

副次効果として open-graph-scraper が devDependencies に移り、undici が
本番ランタイムの依存グラフから外れた。

content の exanple.com は example.com の typo だったため修正した。
RFC 2606 の予約ドメインなのでスクリプトの除外対象になる。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: docustation の切り替え

**Files:**
- Create: `/Users/annrie/LocalSites/docustation/scripts/ogp-link-cards.ts`
- Create: `/Users/annrie/LocalSites/docustation/scripts/refresh-ogp.ts`
- Create: `/Users/annrie/LocalSites/docustation/tests/ogp-endpoint-removed.spec.ts`
- Delete: `/Users/annrie/LocalSites/docustation/server/api/ogp.ts`
- Modify: `/Users/annrie/LocalSites/docustation/app/components/content/LinkCard.vue`
- Modify: `/Users/annrie/LocalSites/docustation/content/blog/06.nuxt-link-card-implementation.md`
- Modify: `/Users/annrie/LocalSites/docustation/package.json`

**Interfaces:**
- Consumes: Task 1 / Task 2 のスクリプト2ファイル
- Produces: なし

手順は Task 3 と同一。**LinkCard.vue は nuxtation と10行差があるので、Task 3 の差分を
そのまま貼らずに、このリポの既存記述を読んでから同じ趣旨の変更を手で当てること。**

- [ ] **Step 1: スクリプトを移植して同一性を確認する**

```bash
cd /Users/annrie/LocalSites/docustation
cp /Users/annrie/LocalSites/private-nuxtation/scripts/ogp-link-cards.ts scripts/
cp /Users/annrie/LocalSites/private-nuxtation/scripts/refresh-ogp.ts scripts/
diff scripts/ogp-link-cards.ts /Users/annrie/LocalSites/private-nuxtation/scripts/ogp-link-cards.ts
diff scripts/refresh-ogp.ts /Users/annrie/LocalSites/private-nuxtation/scripts/refresh-ogp.ts
```

Expected: diff の出力なし。

- [ ] **Step 2: content の typo を直す**

`content/blog/06.nuxt-link-card-implementation.md` の `exanple.com` を `example.com` に修正する。

- [ ] **Step 3: package.json を編集する**

`scripts` に `"ogp:refresh": "npx tsx scripts/refresh-ogp.ts",` を追加し、依存を移す:

```bash
cd /Users/annrie/LocalSites/docustation && pnpm add -D open-graph-scraper
```

- [ ] **Step 4: キャッシュを生成して確認する**

```bash
cd /Users/annrie/LocalSites/docustation && pnpm ogp:refresh && cat app/data/ogp-cache.json
```

Expected: 「参照 3 件 / 取得成功 2 件」、除外に `https://example.com`、失敗0件。

- [ ] **Step 5: LinkCard.vue を書き換える**

このリポの現行 `app/components/content/LinkCard.vue` を読んだうえで、Task 3 の Step 5・6 と
同じ趣旨の変更を当てる。要点は4つ:

1. `ogpCache` を `~/data/ogp-cache.json` から import し、`computed` で `propsUrl` を引く
2. `onMounted` / `useLazyFetch` / `isDevRun` / `watch` を削除する
3. 画像を `ogpData.ogImage || '/img/ogp.png'` に変える
4. `v-else` のスピナーを `NuxtLink` の素のリンクに置き換え、`.link-card-fallback` を style に足す

- [ ] **Step 6: エンドポイントを削除して回帰テストを書く**

```bash
cd /Users/annrie/LocalSites/docustation && git rm server/api/ogp.ts
```

`tests/ogp-endpoint-removed.spec.ts` を作成（内容は Task 3 Step 8 と同一）:

```typescript
import { expect, test } from '@playwright/test'

// /api/ogp は 2026-08-04 に廃止した。`?url=` を検証せずに取得する
// エンドポイントで、公開状態のまま任意ホストへリクエストを飛ばせた。
// OGP はビルド時解決へ移したので、このルートが復活したら同じ穴が開く。
test('/api/ogp は廃止されている', async ({ request }) => {
  const response = await request.get('/api/ogp?url=https://example.com')

  expect(response.status()).toBe(404)
})
```

- [ ] **Step 7: lint を通す**

```bash
cd /Users/annrie/LocalSites/docustation && pnpm lint
```

Expected: エラーなし。

- [ ] **Step 8: コミット**

検証は Task 6 でまとめて `pnpm generate` を回すため、ここでは実行しない。

```bash
cd /Users/annrie/LocalSites/docustation
git add scripts/ogp-link-cards.ts scripts/refresh-ogp.ts tests/ogp-endpoint-removed.spec.ts \
  app/data/ogp-cache.json app/components/content/LinkCard.vue \
  content/blog/06.nuxt-link-card-implementation.md package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
fix(security): 🔒 /api/ogp を廃止し OGP をビルド時解決へ移行

任意URLをサーバーサイドで取得できるエンドポイントだった。?url= に
許可リストもプライベートIPの拒否も無く、open-graph-scraper は
followRedirect が既定で有効なため追従先でも抜けられる状態だった。

このリポジトリは pnpm generate の静的出力を静的ホスティングに上げる運用で、
静的出力にサーバー API ルートは含まれない。したがって本番にこのエンドポイントは
存在せず、任意URLの取得が起きていたのはプリレンダー中のビルドマシン上だけだった。
本番の公開エンドポイントだったのは nuxtation のみ。

呼び出し元は LinkCard.vue だけで、URL は自サイトの markdown 由来の
閉じた集合。実行時に任意URLを受ける必要が無いため、宛先検証を足すのでは
なくエンドポイントごと削除した。

OGP は pnpm ogp:refresh でビルド前に解決し app/data/ogp-cache.json を
コミットする。副次効果として open-graph-scraper が devDependencies に
移り、undici が本番ランタイムの依存グラフから外れた。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

ビルド確認は Task 6 でまとめて依頼するため、ここでは止まらない。

---

### Task 5: private-nuxtation の切り替え

**Files:**
- Create: `/Users/annrie/LocalSites/private-nuxtation/tests/ogp-endpoint-removed.spec.ts`
- Delete: `/Users/annrie/LocalSites/private-nuxtation/server/api/ogp.ts`
- Modify: `/Users/annrie/LocalSites/private-nuxtation/app/components/content/LinkCard.vue`
- Modify: `/Users/annrie/LocalSites/private-nuxtation/content/blog/06.nuxt-link-card-implementation.md`

**Interfaces:**
- Consumes: Task 1 / Task 2 で既に配置済みのスクリプト
- Produces: なし

スクリプトと `ogp:refresh` は Task 1・2 で導入済みなので、ここではコンポーネント側だけを扱う。

**このリポの LinkCard.vue は nuxtation と220行差がある。**大半はコメントと整形だが、
「dev の非ブロッキング化と SSG 出力の両立を狙った暫定策。後日 useAsyncData 等へ統一を
検討する」という NOTE コメントが冒頭にある。今回の変更でこの暫定策は解消されるので、
**この NOTE は削除する**（残すと事実と食い違う）。

- [ ] **Step 1: content の typo を直す**

`content/blog/06.nuxt-link-card-implementation.md` の `exanple.com` を `example.com` に修正する。

- [ ] **Step 2: キャッシュを再生成する**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm ogp:refresh && cat app/data/ogp-cache.json
```

Expected: typo 修正により、Task 2 の時点で「失敗1件」だったものが「除外1件・失敗0件」に変わる。

- [ ] **Step 3: open-graph-scraper を devDependencies へ移す**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm add -D open-graph-scraper
```

- [ ] **Step 4: LinkCard.vue を書き換える**

現行ファイルを読んだうえで、Task 3 の Step 5・6 と同じ趣旨の変更を当てる。要点は5つ:

1. `ogpCache` を `~/data/ogp-cache.json` から import し、`computed` で `propsUrl` を引く
2. `onMounted` / `useLazyFetch` / `isDevRun` / `watch` を削除する
3. 冒頭の「暫定策」NOTE コメントを削除する
4. 画像を `ogpData.ogImage || '/img/ogp.png'` に変える
5. `v-else` のスピナーを `NuxtLink` の素のリンクに置き換え、`.link-card-fallback` を style に足す

このリポは自動 import に依存していて `import { computed } from 'vue'` を書かない方針の
コメントがある。既存方針に合わせること。

- [ ] **Step 5: エンドポイントを削除して回帰テストを書く**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && git rm server/api/ogp.ts
```

`tests/ogp-endpoint-removed.spec.ts` を作成（内容は Task 3 Step 8 と同一）:

```typescript
import { expect, test } from '@playwright/test'

// /api/ogp は 2026-08-04 に廃止した。`?url=` を検証せずに取得する
// エンドポイントで、公開状態のまま任意ホストへリクエストを飛ばせた。
// OGP はビルド時解決へ移したので、このルートが復活したら同じ穴が開く。
test('/api/ogp は廃止されている', async ({ request }) => {
  const response = await request.get('/api/ogp?url=https://example.com')

  expect(response.status()).toBe(404)
})
```

- [ ] **Step 6: ユニットテストと lint を通す**

```bash
cd /Users/annrie/LocalSites/private-nuxtation && pnpm test && pnpm lint
```

Expected: どちらもエラーなし。Task 1 の18テストが引き続き PASS すること。

- [ ] **Step 7: コミット**

```bash
cd /Users/annrie/LocalSites/private-nuxtation
git add tests/ogp-endpoint-removed.spec.ts app/data/ogp-cache.json \
  app/components/content/LinkCard.vue content/blog/06.nuxt-link-card-implementation.md \
  package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
fix(security): 🔒 /api/ogp を廃止し OGP をビルド時解決へ移行

任意URLをサーバーサイドで取得できるエンドポイントだった。?url= に
許可リストもプライベートIPの拒否も無く、open-graph-scraper は
followRedirect が既定で有効なため追従先でも抜けられる状態だった。

このリポジトリは pnpm generate の静的出力を静的ホスティングに上げる運用で、
静的出力にサーバー API ルートは含まれない。したがって本番にこのエンドポイントは
存在せず、任意URLの取得が起きていたのはプリレンダー中のビルドマシン上だけだった。
本番の公開エンドポイントだったのは nuxtation のみ。

LinkCard.vue にあった「dev の非ブロッキング化と SSG 出力の両立を狙った
暫定策」の分岐は、静的 import への移行でそのまま不要になったため
NOTE ごと削除した。

副次効果として open-graph-scraper が devDependencies に移り、undici が
本番ランタイムの依存グラフから外れた。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

ビルド確認は Task 6 でまとめて依頼するため、ここでは止まらない。

---

### Task 6: ビルド確認と PR

**Files:** なし（git 操作のみ）

**Interfaces:**
- Consumes: Task 3〜5 のコミット
- Produces: なし

CLAUDE.md のタスク規模判断「中（単一機能）: ブランチ作成 → 実装 → PR → codex レビュー対応
→ マージ」に従う。3リポとも `fix/ogp-build-time-resolution` ブランチで作業している。

nuxtation のビルドは Task 3 で実行済み（`pnpm build`、出力は `.vercel/output`）。
ここでは残り2リポを検証する。

- [ ] **Step 1: 残り2リポを generate で検証する**

```bash
cd /Users/annrie/LocalSites/docustation && pnpm generate
cd /Users/annrie/LocalSites/private-nuxtation && pnpm generate
```

**`build` ではなく `generate` を使う。** 全ルートの prerender を通すぶん build より厳しく、
静的出力（`.output/public`）まで確認できる。高速化したのでこちら側で実行してよい。

生成物でキャッシュが実際に効いていることも確認する。終了コードだけでは、コンポーネントが
描画されずに素のリンクへ落ちていても気づけない。

```bash
grep -c 'qiita-user-contents.imgix.net' .output/public/blog/*link-card*/index.html
grep -rl 'api/ogp' .output/server | wc -l    # 0 であること
```

**コンポーネントのクラス名は3リポで異なる**（private-nuxtation は `link-card`、他は `link-card-root`）。
`link-card-root` だけで grep すると private-nuxtation で「描画されていない」と誤認する。

- [ ] **Step 2: 3リポを push する**

```bash
for d in /Users/annrie/LocalSites/nuxtation /Users/annrie/LocalSites/docustation /Users/annrie/LocalSites/private-nuxtation; do
  cd "$d"
  env -u GH_TOKEN git push -u origin fix/ogp-build-time-resolution
done
```

`git push` / `gh` には `env -u GH_TOKEN` を付ける。GH_TOKEN の fine-grained PAT に
権限が無く失敗するため。

- [ ] **Step 3: 3リポで PR を作る**

ベースブランチは各リポの作業ブランチ元である `develop`。

```bash
cd <repo>
env -u GH_TOKEN gh pr create --base develop --head fix/ogp-build-time-resolution \
  --title "fix(security): /api/ogp を廃止し OGP をビルド時解決へ移行" \
  --body-file <本文ファイル>
```

本文には次を含める: 問題（任意URLをサーバーサイドで取得できた）、判断の根拠（呼び出し元が
LinkCard.vue だけで URL が markdown 由来の閉じた集合）、変更の要点、検証結果（ビルド・
e2e・undici が本番成果物から消えたこと）、`pnpm ogp:refresh` の運用手順。

- [ ] **Step 4: codex レビューに対応する**

PR 作成で codex の自動レビューが走る。**指摘が尽きるまで対応する**のが原則。
レビューは inline comment に入るので、`reviews` の body だけを見ると「指摘なし」と
誤読する。同種の指摘が2回続いたら境界値を追わずに設計を変える。

- [ ] **Step 5: マージと develop/main 同期**

codex レビューが収束したらマージする。その後 CLAUDE.md の「main と develop を同じ状態に
保つ」ルールに従って同期する。**片方が0でなければ勝手に同期せず、内容差を確認して
ユーザーに報告する。**

```bash
for d in /Users/annrie/LocalSites/nuxtation /Users/annrie/LocalSites/docustation /Users/annrie/LocalSites/private-nuxtation; do
  cd "$d"
  echo "$(basename $d): main..develop=$(git rev-list --count main..develop) develop..main=$(git rev-list --count develop..main) 内容差=$(git diff main develop --stat | wc -l)行"
done
```

- [ ] **Step 6: リリースする**

3リポとも `version` と `release:patch` を持つ。マージ後に各リポで実行する。

```bash
cd <repo>
PATH="$PWD/node_modules/.bin:$PATH" pnpm release:patch
env -u GH_TOKEN git push origin <ブランチ> --follow-tags
```

- [ ] **Step 7: nuxtation の本番デプロイを確認する**

nuxtation は main への push で Vercel に自動デプロイされる。デプロイ完了後、
本番の該当記事で link-card が表示され、example.com が素のリンクになっていることを確認する。

- [ ] **Step 8: メモリを更新する**

`ogp-endpoint-open-proxy.md` を「未着手」から「対応済み」に書き換える。
`snyk-alerts-build-only-accepted.md` の Docus 系3リポの記述に、undici が本番ランタイムから
外れた旨を追記する。

---

## 完了条件

- 3リポとも `server/api/ogp.ts` が存在しない
- 3リポとも `pnpm ogp:refresh` が動き、`app/data/ogp-cache.json` がコミットされている
- 3リポの `scripts/ogp-link-cards.ts` と `scripts/refresh-ogp.ts` が完全に同一
- 3リポとも `/api/ogp` が404を返す e2e テストを持つ
- private-nuxtation の `pnpm test` が通る
- nuxtation の `.vercel/output/functions/__fallback.func/package.json` に undici の宣言が無い
- 3リポとも PR がマージされ、main/develop の内容差が0

---

## 次のPRへ送る課題

1. **Block Components 形式の抽出対応** — codex と最終レビューが独立に指摘。記事が教えている
   書き方なので、抽出側が追随する必要がある
2. **キャッシュ欠落の検出ゲート** — `pnpm ogp:refresh` の実行を忘れても build / generate /
   test / lint が全て通ってしまう
3. **記事本文への注記** — 記事が、削除した無検証エンドポイントの実装手順を読者に教えたまま。
   codex は private-nuxtation でこれを P1 と評価した。説明本文は残し、注記を足す方針
4. **未使用 Dockerfile の削除**（docustation / private-nuxtation） — 実際には使っていないのに
   残っていたため、本計画の初版で「Dockerfile が SSR ビルドして本番稼働」と読み違え、
   脆弱性の深刻度を2リポ分過大に記述した。使わないデプロイ設定は将来も同じ誤読を生む

1 と 2 は独立した不具合ではなく、「link-card の URL 集合はビルド時に確定する」という前提を
正規表現と人間の規律だけで支えていることの、別々の現れ方。個別に継ぎ足すのではなく
まとめて設計し直す。
