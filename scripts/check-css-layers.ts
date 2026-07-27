/**
 * CSS カスケードレイヤーの事故検知
 *
 * 背景:
 *   CSS の判定順は 起点 → **レイヤー** → 詳細度 の順で、通常宣言では
 *   「レイヤー外」が全レイヤーに勝つ。つまり `:where()` で詳細度を 0 に
 *   したリセット CSS でも、レイヤー外に置かれていれば Tailwind の
 *   `@layer utilities` を打ち消してしまう。
 *
 *   実際に kiso.css を nuxt.config.ts の `css: []` から読み込んでいた時期、
 *   p の `my-4` や ul の `ps-6 list-disc` が無効化されていた（見た目では
 *   気づきにくく、要素ごとに計算値を測って初めて判明した）。
 *
 * このスクリプトの役割:
 *   ビルド成果物のインライン CSS を解析し、レイヤー外に「要素セレクタへの
 *   リセット」が紛れ込んでいないかを検査する。実ブラウザは使わないので
 *   CI でも動く。
 *
 * 使い方:
 *   pnpm build && pnpm check:css-layers
 *   pnpm check:css-layers --strict   # 問題があれば exit 1
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

/** ビルド成果物の探索先（先に見つかったものを使う） */
const OUTPUT_DIRS = ['.output/public', '.vercel/output/static', 'dist']

/**
 * レイヤー外にあると Tailwind ユーティリティを潰す可能性が高いプロパティ。
 * リセット CSS が「UA スタイルの打ち消し」目的で触りがちなものを挙げている。
 */
const RISKY_PROPERTIES = [
  'margin',
  'margin-block',
  'margin-inline',
  'margin-top',
  'margin-bottom',
  'padding',
  'padding-block',
  'padding-inline',
  'padding-inline-start',
  'list-style',
  'list-style-type',
  'color',
  'background-color',
  'font',
  'font-size',
  'font-weight',
  'font-style',
  'text-align',
  'text-decoration',
  'text-decoration-line',
  'border',
  'border-width',
  'border-color',
  'border-radius',
]

/** キーフレームのオフセット（`0%` / `from` / `to`）はセレクタではない */
function isKeyframeOffset(selector: string): boolean {
  return selector.split(',').every(s => /^\s*(?:from|to|-?[\d.]+%)\s*$/.test(s))
}

/** 要素セレクタ（クラスや ID を含まない）にマッチするか */
function isElementSelector(selector: string): boolean {
  if (isKeyframeOffset(selector))
    return false
  // :where(...) / :is(...) の中身も対象にする
  const inner = selector.replace(/:(?:where|is)\(([^()]*)\)/g, '$1')
  // クラス・ID・属性セレクタを含むものはコンポーネント固有とみなし対象外
  if (/[.#[]/.test(inner))
    return false
  return /[a-z]/i.test(inner)
}

function findHtmlFiles(dir: string, acc: string[] = [], depth = 0): string[] {
  if (depth > 4)
    return acc
  let entries: string[]
  try {
    entries = readdirSync(dir)
  }
  catch {
    return acc
  }
  for (const e of entries) {
    const p = join(dir, e)
    let st
    try {
      st = statSync(p)
    }
    catch {
      continue
    }
    if (st.isDirectory())
      findHtmlFiles(p, acc, depth + 1)
    else if (e.endsWith('.html'))
      acc.push(p)
  }
  return acc
}

/** <style> の中身を取り出す */
function extractStyles(html: string): string[] {
  return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1] ?? '')
}

/**
 * スタイルシート文字列から検査対象外のブロックを取り除く。
 *
 * - `@layer { ... }`  : レイヤー内はそもそも問題にならない
 * - `@keyframes { ... }` : `0%` / `from` / `to` はセレクタではないので誤検知になる
 */
function stripBlocks(css: string, atRules: string[]): string {
  let out = ''
  let i = 0
  while (i < css.length) {
    // 最も手前に現れる対象 at-rule を探す
    let at = -1
    for (const rule of atRules) {
      const p = css.indexOf(rule, i)
      if (p !== -1 && (at === -1 || p < at))
        at = p
    }
    if (at === -1) {
      out += css.slice(i)
      break
    }
    out += css.slice(i, at)
    // `@layer name;` のような宣言のみの形はそのまま飛ばす
    const brace = css.indexOf('{', at)
    const semi = css.indexOf(';', at)
    if (brace === -1 || (semi !== -1 && semi < brace)) {
      i = (semi === -1 ? css.length : semi + 1)
      continue
    }
    // 対応する } まで飛ばす
    let depth = 0
    let j = brace
    for (; j < css.length; j++) {
      if (css[j] === '{') {
        depth++
      }
      else if (css[j] === '}') {
        depth--
        if (depth === 0) {
          j++
          break
        }
      }
    }
    i = j
  }
  return out
}

/** ルールを大雑把に分解する（@media 等のネストは中身を再帰的に見る） */
function* iterateRules(css: string): Generator<{ selector: string, body: string }> {
  const re = /([^{}]+)\{([^{}]*)\}/g
  for (const m of css.matchAll(re)) {
    const selector = (m[1] ?? '').trim()
    const body = m[2] ?? ''
    if (selector.startsWith('@'))
      continue
    if (!selector)
      continue
    yield { selector, body }
  }
}

interface Finding {
  file: string
  selector: string
  props: string[]
}

function main() {
  const strict = process.argv.includes('--strict')

  const dir = OUTPUT_DIRS.find((d) => {
    try {
      return statSync(d).isDirectory()
    }
    catch {
      return false
    }
  })
  if (!dir) {
    console.error(`ビルド成果物が見つかりません。次のいずれかを用意してください: ${OUTPUT_DIRS.join(', ')}`)
    console.error('先に `pnpm build` を実行してください。')
    process.exit(strict ? 1 : 0)
  }

  const files = findHtmlFiles(dir).slice(0, 40)
  if (files.length === 0) {
    console.error(`${dir} に HTML が見つかりませんでした。`)
    process.exit(strict ? 1 : 0)
  }

  const findings: Finding[] = []
  const seen = new Set<string>()

  for (const file of files) {
    const html = readFileSync(file, 'utf8')
    for (const style of extractStyles(html)) {
      const unlayered = stripBlocks(style, ['@layer', '@keyframes', '@-webkit-keyframes'])
      for (const { selector, body } of iterateRules(unlayered)) {
        if (!isElementSelector(selector))
          continue
        const props = RISKY_PROPERTIES.filter(p =>
          new RegExp(`(^|[;{\\s])${p}\\s*:`).test(body),
        )
        if (props.length === 0)
          continue
        const key = `${selector}|${props.join(',')}`
        if (seen.has(key))
          continue
        seen.add(key)
        findings.push({ file: file.replace(`${dir}/`, ''), selector, props })
      }
    }
  }

  console.log('CSS カスケードレイヤー検査')
  console.log(`  対象: ${dir}（HTML ${files.length} ファイル）`)
  console.log('─'.repeat(76))

  if (findings.length === 0) {
    console.log('\n✅ レイヤー外に要素セレクタのリセットは見つかりませんでした。')
    console.log('   Tailwind の @layer utilities は打ち消されていません。\n')
    return
  }

  console.log('\n⚠️  レイヤー外に要素セレクタのリセットがあります。')
  console.log('   レイヤー外は全レイヤーに勝つため、詳細度 0 の :where() でも')
  console.log('   Tailwind の @layer utilities を打ち消します。\n')
  for (const f of findings) {
    console.log(`  セレクタ : ${f.selector.slice(0, 70)}`)
    console.log(`  プロパティ: ${f.props.join(', ')}`)
    console.log(`  検出元   : ${f.file}`)
    console.log()
  }
  console.log('対処: 該当の CSS を `@import "..." layer(base);` で読み込むか、')
  console.log('      `@layer base { ... }` で包んでください。\n')

  if (strict)
    process.exit(1)
}

main()
