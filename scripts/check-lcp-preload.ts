/**
 * トップの LCP 画像の preload の検査
 *
 * 背景:
 *   トップの注目記事の画像は、ArticleHeroImage が <head> に <link rel="preload" as="image"> を出している。
 *   <img> だけだと、HTML の先頭近くにある数百 KB のインライン CSS を読み終わるまで画像が見つからないため。
 *   この preload は unhead の重み（tagPriority: 35）で CSS より前に出していて、srcset は NuxtPicture の
 *   最初の <source> と同じ引数で作っている。どちらも @nuxt/image や unhead の更新で黙ってずれうる。
 *   - CSS のあとに戻ると、LCP の改善が消える（エラーも警告も出ない）
 *   - srcset や type が <picture> と食い違うと、画像を二重に読む
 *
 * このスクリプトの役割:
 *   生成した index.html を読み、次を確かめる（属性の順番には左右されない）。
 *   1. 画像の preload がちょうど 1 本ある（2 本以上あると、帯域を取り合って LCP の画像が遅れる）
 *   2. 最初の CSS（属性の有無を問わない <style> と <link rel="stylesheet"> のうち早いほう）より前にある。
 *      nonce などの属性が付いても見失わないよう、Nuxt がインラインにした CSS だけでなく、すべての CSS の前に置くことを求める
 *      （media="print" のように描画を止めないものは除く）
 *   3. type と imagesrcset が付いていて、同じ type の <source>（形式が 1 つだけなら <img>）と srcset・sizes が一致する
 *
 * 使い方:
 *   pnpm build && pnpm check:lcp-preload               # 問題があれば警告して exit 0
 *   pnpm check:lcp-preload --strict                    # 問題があれば exit 1（ssg-check.yml）
 *   npx tsx scripts/check-lcp-preload.ts <生成先のディレクトリ>
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)
const strict = args.includes('--strict')
// nitro の preset が vercel なので、プリレンダーした HTML は .vercel/output/static に出る
const dir = args.find(a => !a.startsWith('--')) ?? '.vercel/output/static'
const html = readFileSync(join(dir, 'index.html'), 'utf8')

/**
 * 属性の値の実体参照を戻す。
 * Vue の SSR（<source> / <img>）は & ' " < > をエスケープするが、unhead（<link>）は & をそのまま出すので、
 * 戻してから比べないと同じ URL でも食い違って見える
 */
function decode(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', '\'')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

/** タグの属性を順番に関係なく取り出す（値は "..."・'...'・引用符なしのどれでもよい） */
function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of tag.matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g))
    out[m[1]!.toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '')
  return out
}

/** 開始タグを位置と属性つきで集める。属性の値の中の > でタグが切れないよう、引用符の中は読み飛ばす */
function tags(name: string): { index: number, a: Record<string, string> }[] {
  return [...html.matchAll(new RegExp(`<${name}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, 'g'))]
    .map(m => ({ index: m.index, a: attrs(m[0]) }))
}

/** 描画を止める CSS か。media="print" のように今の画面に当たらないものは、LCP を遅らせないので数えない */
function blocksRender(a: Record<string, string>): boolean {
  const media = a.media?.trim().toLowerCase()
  return !media || media === 'all' || media === 'screen'
}

const problems: string[] = []
const links = tags('link')
const preloads = links.filter(l => l.a.rel === 'preload' && l.a.as === 'image')
// 最初の CSS の位置。<style> は属性の有無を問わず、外部の CSS（<link rel="stylesheet">）も含める
const cssStarts = [
  ...tags('style').filter(s => blocksRender(s.a)),
  ...links.filter(l => l.a.rel?.split(/\s+/).includes('stylesheet') && blocksRender(l.a)),
].map(t => t.index)
const css = cssStarts.length ? Math.min(...cssStarts) : -1
const sources = tags('source').map(t => t.a)
const images = tags('img').map(t => t.a)

if (preloads.length === 0)
  problems.push('トップに画像の preload がありません（HomeFeaturedArticle の preload）')
else if (preloads.length > 1)
  problems.push(`画像の preload が ${preloads.length} 本あります。LCP の画像と帯域を取り合うので、1 本にしてください`)
if (css === -1)
  problems.push('CSS（<style> と <link rel="stylesheet">）が見つかりません（確かめ方を見直してください）')

for (const preload of preloads) {
  const label = `画像の preload（${preload.index} 文字目）`
  if (css !== -1 && preload.index > css)
    problems.push(`${label}が、最初の CSS（${css} 文字目）より後ろにあります`)

  if (!preload.a.type) {
    problems.push(`${label}に type がありません`)
    continue
  }
  // imagesrcset が無いと、srcset の無い <img>（ヘッダーのロゴなど）と「どちらも無い」同士で一致して見えるので、先に弾く
  if (!preload.a.imagesrcset) {
    problems.push(`${label}に imagesrcset がありません`)
    continue
  }
  // 形式が 1 つだけのとき、NuxtPicture は <source> を作らず <img> に srcset を付ける
  const same = [...sources.filter(s => s.type === preload.a.type), ...images].find(s => s.srcset === preload.a.imagesrcset)
  if (!same)
    problems.push(`${label}の srcset が、type="${preload.a.type}" の <source>（または <img>）のどれとも一致しません（画像を二重に読みます）`)
  else if ((same.sizes ?? '') !== (preload.a.imagesizes ?? ''))
    problems.push(`${label}の imagesizes が、<source> の sizes と一致しません`)
}

if (problems.length) {
  for (const p of problems)
    console.error(`${strict ? '❌' : '⚠️'} ${p}`)
  if (strict)
    process.exit(1)
}
else {
  const preload = preloads[0]!
  console.log(`✔ 画像の preload: ${preload.index} 文字目（最初の CSS は ${css} 文字目）、type="${preload.a.type}"、srcset は <picture> と一致`)
}
