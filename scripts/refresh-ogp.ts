/**
 * link-card の OGP をビルド前に解決して JSON にキャッシュする。
 *
 * 背景:
 *   以前は server/api/ogp.ts が実行時に `?url=` を受けて取得していたが、
 *   宛先の検証が無く任意のホストへリクエストを飛ばせる状態だった。
 *   link-card の URL は自サイトの markdown 由来で、ビルド時に確定する
 *   閉じた集合なので、実行時に取得する必要がそもそも無い。
 *
 * 複製について:
 *   このファイルは nuxtation / docustation / private-nuxtation の
 *   3リポジトリにバイト単位で複製されている。変更する場合は
 *   3リポすべてに同じ変更を適用すること（同期を強制する仕組みは無い）。
 *
 * 使い方:
 *   pnpm ogp:refresh
 *
 *   記事に link-card を足したら実行してコミットする。ビルド自体は
 *   この JSON を読むだけでネットワークに出ない。
 */

import type { OgpEntry } from './ogp-link-cards'
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import process from 'node:process'
import ogs from 'open-graph-scraper'
import { extractLinkCardUrls, isReservedHost } from './ogp-link-cards'

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
  catch (error) {
    // ファイルが存在しない場合は想定内。最初の実行や削除直後など。
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return {}

    // JSON 破損などそれ以外のエラーは想定外の状態。ここを {} で握り潰すと
    // 「取得失敗時は既存エントリを残す」が機能しなくなり（前回値が無い扱いになる）、
    // かつ全滅判定も素通りして壊れたキャッシュを空の JSON で上書きしてしまう。
    // 警告して進めるのではなく、ここで止めて人間に直させる。
    throw new Error(
      `[ogp] ${CACHE_PATH} の読み込みに失敗した。壊れているか読み取れない状態: `
      + `${error instanceof Error ? error.message : String(error)}\n`
      + `[ogp] 内容を確認し、直せないなら git で復元すること（例: git checkout -- ${CACHE_PATH}）。`,
    )
  }
}

async function main(): Promise<void> {
  const files = await collectMarkdownFiles(CONTENT_DIR)

  const referenced = new Set<string>()
  for (const file of files) {
    for (const url of extractLinkCardUrls(await readFile(file, 'utf8')))
      referenced.add(url)
  }

  // 既存キャッシュを読み込む。参照を失った URL は next にコピーしないことで
  // 自然に落ちる（後から削除する別処理は無い）。
  // 取得に失敗しても前回取れた値を残すのが狙いで、一時的な障害で
  // 良いデータを失わないようにするため。読み込み自体が失敗した場合は
  // readCache 内で例外を投げてここで止まる。
  const existing = await readCache()

  const skipped: string[] = []
  const targets: string[] = []
  for (const url of referenced) {
    if (isReservedHost(url))
      skipped.push(url)
    else
      targets.push(url)
  }

  const next: Record<string, OgpEntry> = {}
  const succeeded: string[] = []
  const failed: string[] = []
  const retained: Set<string> = new Set()

  for (const url of targets) {
    try {
      const { result, error } = await ogs({ url, timeout: REQUEST_TIMEOUT_MS })

      if (error || !result?.success) {
        failed.push(url)
        // 取得失敗時は、旧キャッシュがあれば引き継ぐ
        if (url in existing) {
          next[url] = existing[url]
          retained.add(url)
        }
        continue
      }

      succeeded.push(url)
      next[url] = {
        ogTitle: result.ogTitle ?? '',
        ogDescription: result.ogDescription ?? '',
        ogImage: result.ogImage?.[0]?.url ?? '',
        ogUrl: result.ogUrl ?? url,
      }
    }
    catch {
      failed.push(url)
      // 取得失敗時は、旧キャッシュがあれば引き継ぐ
      if (url in existing) {
        next[url] = existing[url]
        retained.add(url)
      }
    }
  }

  // 各カウントが参照集合の互いに素な部分になっている。
  // 参照 = 除外 + 取得成功 + 取得失敗
  // 「前回値を引き継ぎ」は取得失敗の内訳。
  const retainedCount = retained.size
  console.log(`[ogp] 参照 ${referenced.size} 件 / 除外 ${skipped.length} 件 / 取得成功 ${succeeded.length} 件 / 取得失敗 ${failed.length} 件${retainedCount > 0 ? ` (うち前回値を引き継ぎ ${retainedCount} 件)` : ''}`)

  // 「除外」と「失敗」を分けて出す。混ぜると本物の障害が埋もれる。
  if (skipped.length > 0)
    console.log(`[ogp] 除外(例示用ドメイン): ${skipped.join(', ')}`)

  if (failed.length > 0)
    console.warn(`[ogp] 取得失敗: ${failed.join(', ')}`)

  // 全滅はネットワーク断の可能性が高い。書き出す前に判定することで、
  // 空（または前回値を引き継げず縮小した）JSON を書いてから exit 1 する
  // 事故を防ぐ。ここで打ち切れば既存ファイルには一切触れない。
  if (targets.length > 0 && failed.length === targets.length) {
    console.error('[ogp] 取得対象がすべて失敗した。ネットワークを確認すること。書き出しは行わない。')
    process.exit(1)
  }

  // キー昇順で書き出す。git の差分を安定させるため。
  const sorted = Object.fromEntries(
    Object.entries(next).sort(([a], [b]) => a.localeCompare(b)),
  )
  await mkdir(dirname(CACHE_PATH), { recursive: true })

  // 一時ファイルに書いてから rename で置き換える。同一ファイルシステム内の
  // rename は POSIX でアトミックなので、書き込み途中でプロセスが落ちても
  // 中途半端な JSON が CACHE_PATH に残らない。
  const tmpPath = `${CACHE_PATH}.${process.pid}.tmp`
  await writeFile(tmpPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8')
  await rename(tmpPath, CACHE_PATH)

  console.log(`[ogp] 書き出し: ${CACHE_PATH}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
