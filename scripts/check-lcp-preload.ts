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
 *   1. 画像の preload がある
 *   2. Nuxt がインラインにした CSS（属性の無い <style>）より前にある
 *   3. type が付いていて、同じ type の <source>（形式が 1 つだけなら <img>）と srcset・sizes が一致する
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

/** タグの属性を順番に関係なく取り出す */
function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of tag.matchAll(/([\w-]+)(?:="([^"]*)")?/g))
    out[m[1]!.toLowerCase()] = decode(m[2] ?? '')
  return out
}

const problems: string[] = []
const links = [...html.matchAll(/<link\b[^>]*>/g)].map(m => ({ index: m.index, a: attrs(m[0]) }))
const preload = links.find(l => l.a.rel === 'preload' && l.a.as === 'image')
const style = html.indexOf('<style>')

if (!preload) {
  problems.push('トップに画像の preload がありません（HomeFeaturedArticle の preload）')
}
else {
  if (style === -1)
    problems.push('インラインの <style> が見つかりません（確かめ方を見直してください）')
  else if (preload.index > style)
    problems.push(`画像の preload（${preload.index} 文字目）が、インラインの CSS（${style} 文字目）より後ろにあります`)

  if (!preload.a.type) {
    problems.push('画像の preload に type がありません')
  }
  else {
    // 形式が 1 つだけのとき、NuxtPicture は <source> を作らず <img> に srcset を付ける
    const sources = [...html.matchAll(/<source\b[^>]*>/g)].map(m => attrs(m[0])).filter(s => s.type === preload.a.type)
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(m => attrs(m[0]))
    const same = [...sources, ...images].find(s => s.srcset === preload.a.imagesrcset)
    if (!same)
      problems.push(`画像の preload の srcset が、type="${preload.a.type}" の <source>（または <img>）のどれとも一致しません（画像を二重に読みます）`)
    else if ((same.sizes ?? '') !== (preload.a.imagesizes ?? ''))
      problems.push('画像の preload の imagesizes が、<source> の sizes と一致しません')
  }
}

if (problems.length) {
  for (const p of problems)
    console.error(`${strict ? '❌' : '⚠️'} ${p}`)
  if (strict)
    process.exit(1)
}
else {
  console.log(`✔ 画像の preload: ${preload!.index} 文字目（インラインの CSS は ${style} 文字目）、type="${preload!.a.type}"、srcset は <picture> と一致`)
}
