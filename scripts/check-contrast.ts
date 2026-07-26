/**
 * WCAG コントラストチェックスクリプト（Tailwind CSS v4 / Nuxt UI v4 版）
 *
 * app/assets/css/tailwind.css をデザイントークンの唯一の定義元として読み、
 *
 *   1. 未定義トークンの検出
 *      app/ 内の scoped CSS が var(--color-*) で参照しているのに
 *      tailwind.css に定義が無いものを報告する
 *   2. 前景／背景ペアのコントラスト検証
 *      実際に重ねて使う組み合わせを、ライト／ダークそれぞれの値で評価する
 *   3. 単色ごとの白／黒テキストコントラスト一覧
 *
 * tailwind.css は
 *   @theme { ... } / @theme static { ... } … ライトテーマの値
 *   .dark { ... }                          … ダークテーマの上書き
 * という構成なので、両方を別々に読み取る。
 *
 * 実行: pnpm run check:contrast
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { contrastRatio, meetsAA, parseHexColor } from '../utils/wcag-contrast'

const out = (s = '') => process.stdout.write(`${s}\n`)

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS_CSS = join(ROOT, 'app/assets/css/tailwind.css')

/**
 * ページ背景（Nuxt UI の --ui-bg）。
 * ライトは #fff、ダークは --ui-color-neutral-900。
 * app/app.config.ts で neutral: 'slate' としているので slate-900 相当。
 * Tailwind v4 の実値は oklch だが、コントラスト計算用に sRGB 近似値を使う。
 */
const PAGE_BG = { light: '#ffffff', dark: '#0f172a' } as const
const WHITE = '#ffffff'
const BLACK = '#0a0a0a'

type Theme = 'light' | 'dark'

// --- tailwind.css からトークンを抽出 -------------------------------------

const css = readFileSync(TOKENS_CSS, 'utf8')

/** `.dark { ... }` ブロックの中身（ダークテーマの上書き） */
const darkBlock = /^\.dark\s*\{([\s\S]*?)^\}/m.exec(css)?.[1] ?? ''
/** それ以外（@theme / @theme static＝ライトテーマの値） */
const lightBlock = darkBlock ? css.replace(darkBlock, '') : css

function collect(source: string): Map<string, string> {
  const map = new Map<string, string>()
  // --color-NAME: #HEX  /  --color-NAME: var(--color-OTHER)
  for (const m of source.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{3,8}|var\(--color-[\w-]+\))/gi))
    map.set(m[1], m[2])
  return map
}

const rawLight = collect(lightBlock)
const rawDark = collect(darkBlock)

/** var(--color-x) のエイリアスを解決して hex に正規化する */
function normalize(raw: Map<string, string>, fallback?: Map<string, string>): Map<string, string> {
  const resolved = new Map<string, string>()
  for (const [name] of raw) {
    let value = raw.get(name)
    // エイリアスは 5 段まで辿る（循環しても無限ループしない）
    for (let i = 0; i < 5 && value?.startsWith('var('); i++) {
      const ref = /var\(--color-([\w-]+)\)/.exec(value)?.[1]
      value = ref ? (raw.get(ref) ?? fallback?.get(ref)) : undefined
    }
    const hex = value ? parseHexColor(value) : null
    if (hex)
      resolved.set(name, hex)
  }
  return resolved
}

const light = normalize(rawLight)
const dark = normalize(rawDark, rawLight)

/** テーマに応じた実際の色を返す（ダークに上書きが無ければライトの値） */
function colorOf(token: string, theme: Theme): string | null {
  if (token.startsWith('#'))
    return parseHexColor(token)
  return (theme === 'dark' ? dark.get(token) : undefined) ?? light.get(token) ?? null
}

// --- 1. 未定義トークンの検出 ---------------------------------------------

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory())
      walk(full, acc)
    else if (['.vue', '.css', '.ts'].includes(extname(entry.name)))
      acc.push(full)
  }
  return acc
}

/** Tailwind の標準パレット（--color-blue-500 など）は Tailwind 側が定義する */
const TAILWIND_PALETTE
  = /^(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-(?:50|\d{3})$/
/** Nuxt UI が生成するトークン（--ui-* とカラーエイリアス） */
const NUXT_UI_TOKEN
  = /^(?:ui-|old-neutral-)|^(?:primary|secondary|tertiary|info|success|warning|error|neutral)(?:-\d+)?$/
/** CSS のキーワード */
const CSS_KEYWORD = /^(?:white|black|inherit|transparent|current)$/

function isExternal(name: string) {
  return TAILWIND_PALETTE.test(name) || NUXT_UI_TOKEN.test(name) || CSS_KEYWORD.test(name)
}

/** コメント内の記述を拾わないよう除去する */
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const referenced = new Map<string, string[]>()
for (const file of walk(join(ROOT, 'app'))) {
  const text = stripComments(readFileSync(file, 'utf8'))
  for (const m of text.matchAll(/var\(\s*--color-([\w-]+)/g)) {
    const name = m[1]
    if (isExternal(name))
      continue
    const list = referenced.get(name) ?? []
    if (!list.includes(file))
      list.push(file)
    referenced.set(name, list)
  }
}

const undefinedTokens = [...referenced].filter(([name]) => !light.has(name) && !dark.has(name))

out('\n🔍 WCAG コントラストチェック（app/assets/css/tailwind.css）\n')

out('━'.repeat(76))
out(' 1. 未定義トークンの参照')
out('━'.repeat(76))
if (undefinedTokens.length === 0) {
  out('  ✅ app/ が参照する --color-* はすべて tailwind.css で定義されている')
}
else {
  for (const [name, files] of undefinedTokens) {
    out(`  ❌ --color-${name} は未定義`)
    for (const f of files)
      out(`       ${f.replace(`${ROOT}/`, '')}`)
  }
}

// --- 1b. 白ラベルの背景に明るすぎるシェードを使っていないか ----------------

/**
 * text-white のラベルを載せるコンポーネント。
 * 背景に指定されたトークンの実際の色を引いて白文字とのコントラストを検査する。
 * グラデーションは一番明るい端点が最悪ケースになるので、
 * 端点として書かれている値をすべて個別に評価すればよい。
 * シェード番号で機械的に判断すると、白文字が通る -500（例: sf-500 は 5.17:1）まで
 * 誤検出するため、必ず実値で判定する。
 */
const WHITE_LABEL_FILES = [
  'app/components/BaseTag.vue',
  'app/components/BaseButton.vue',
]

interface LightBg { where: string, token: string, hex: string, ratio: number }

const tooLight: LightBg[] = []
for (const rel of WHITE_LABEL_FILES) {
  const lines = stripComments(readFileSync(join(ROOT, rel), 'utf8')).split('\n')
  lines.forEach((line, i) => {
    if (!/background|linear-gradient/.test(line))
      return
    for (const m of line.matchAll(/var\(\s*--color-([\w-]+)\s*\)/g)) {
      const hex = light.get(m[1])
      if (!hex)
        continue
      const ratio = Math.round(contrastRatio(WHITE, hex) * 100) / 100
      if (ratio < 4.5)
        tooLight.push({ where: `${rel}:${i + 1}`, token: `--color-${m[1]}`, hex, ratio })
    }
  })
}

out('')
out('━'.repeat(76))
out(' 1b. 白ラベルの背景色（グラデーションの端点を含む）')
out('━'.repeat(76))
if (tooLight.length === 0) {
  out('  ✅ 白文字を載せる背景はすべて 4.5:1 以上')
}
else {
  out('  ❌ 白文字に対して AA 未達の背景色が使われている:')
  for (const t of tooLight)
    out(`       ${t.where}  ${t.token} (${t.hex}) = ${t.ratio}:1`)
}

// --- 2. 前景／背景ペアの検証 ---------------------------------------------

/** 大きい文字（18.66px 以上の太字 / 24px 以上）と非テキストは 3.0:1 */
const LARGE = 3
/** 非テキスト（フォーカスリング・境界線など。WCAG 2.1 の 1.4.11） */
const NON_TEXT = 3

interface Pair {
  label: string
  fg: string
  bg: string
  /** 必要なコントラスト比（既定は通常テキストの 4.5:1） */
  min?: number
  /** 評価するテーマ（既定は両方） */
  themes?: Theme[]
}

const PAIRS: Pair[] = [
  // 記事本文（prose）— 背景はページ背景
  { label: '本文', fg: 'prose-body', bg: 'PAGE' },
  { label: '見出し h1', fg: 'prose-heading', bg: 'PAGE', min: LARGE },
  { label: '見出し h2', fg: 'prose-heading-2', bg: 'PAGE', min: LARGE },
  { label: '見出し h3', fg: 'prose-heading-3', bg: 'PAGE', min: LARGE },
  { label: '見出し h4', fg: 'prose-heading-4', bg: 'PAGE', min: LARGE },
  { label: '見出し h5', fg: 'prose-heading-5', bg: 'PAGE' },
  { label: '見出し h6', fg: 'prose-heading-6', bg: 'PAGE' },
  { label: 'リンク', fg: 'prose-link', bg: 'PAGE' },
  { label: 'リンク hover', fg: 'prose-link-hover', bg: 'PAGE' },
  { label: '引用文', fg: 'prose-quote-text', bg: 'PAGE' },
  { label: '外部リンクアイコン', fg: 'prose-external', bg: 'PAGE', min: NON_TEXT },
  // 背景を持つ要素
  { label: 'インラインコード', fg: 'prose-code-text', bg: 'prose-code-bg' },
  { label: 'コードブロック', fg: 'prose-pre-text', bg: 'prose-pre-bg' },
  { label: '行番号', fg: 'prose-line-number', bg: 'prose-pre-bg' },
  { label: '表ヘッダ', fg: 'prose-body', bg: 'prose-th-bg' },
  { label: 'code-collapse ボタン', fg: 'prose-collapse-text', bg: 'prose-collapse-bg' },
  // アクセシビリティカラー（ライト／ダークで別トークン名）
  { label: 'リンク（共通トークン）', fg: 'link-light', bg: 'PAGE', themes: ['light'] },
  { label: 'リンク（共通トークン）', fg: 'link-dark', bg: 'PAGE', themes: ['dark'] },
  { label: 'ボタン背景＋白文字', fg: WHITE, bg: 'button-light', themes: ['light'] },
  { label: 'ボタン hover＋白文字', fg: WHITE, bg: 'button-hover-light', themes: ['light'] },
  { label: 'タグ背景＋白文字', fg: WHITE, bg: 'tag-bg-dark', themes: ['dark'] },
]

interface Result extends Pair {
  theme: Theme
  fgHex: string | null
  bgHex: string | null
  ratio: number
  pass: boolean
}

const results: Result[] = []
for (const p of PAIRS) {
  for (const theme of p.themes ?? (['light', 'dark'] as Theme[])) {
    const fgHex = colorOf(p.fg, theme)
    const bgHex = p.bg === 'PAGE' ? PAGE_BG[theme] : colorOf(p.bg, theme)
    const ratio = fgHex && bgHex ? Math.round(contrastRatio(fgHex, bgHex) * 100) / 100 : 0
    results.push({ ...p, theme, fgHex, bgHex, ratio, pass: Boolean(fgHex && bgHex) && ratio >= (p.min ?? 4.5) })
  }
}

for (const theme of ['light', 'dark'] as Theme[]) {
  const rows = results.filter(r => r.theme === theme)
  const ng = rows.filter(r => !r.pass)
  out('')
  out('━'.repeat(76))
  out(` 2. 前景／背景コントラスト — ${theme === 'light' ? 'ライトテーマ' : 'ダークテーマ'}`)
  out(`    背景: ${PAGE_BG[theme]} / 合格 ${rows.length - ng.length} 件・要確認 ${ng.length} 件`)
  out('━'.repeat(76))
  out(`${'  用途'.padEnd(26) + '前景'.padEnd(10) + '背景'.padEnd(10) + '比'.padEnd(9)}基準`)
  out('─'.repeat(76))
  for (const r of rows) {
    if (!r.fgHex || !r.bgHex) {
      out(`${`  ⚠ ${r.label}`.padEnd(26)}未定義（${!r.fgHex ? r.fg : r.bg}）`)
      continue
    }
    const need = `${(r.min ?? 4.5).toFixed(1)}`
    out(
      `${r.pass ? '  ✅' : '  ❌'} ${r.label}`.padEnd(26)
      + r.fgHex.padEnd(10)
      + r.bgHex.padEnd(10)
      + `${r.ratio}`.padEnd(9)
      + need,
    )
  }
}

// --- 3. 単色ごとの白／黒コントラスト一覧 ---------------------------------

interface Row {
  name: string
  hex: string
  vsWhite: number
  vsBlack: number
  passAA: boolean
}

const rows: Row[] = [...light].map(([name, hex]) => {
  const vsWhite = Math.round(contrastRatio(hex, WHITE) * 100) / 100
  const vsBlack = Math.round(contrastRatio(hex, BLACK) * 100) / 100
  return { name, hex, vsWhite, vsBlack, passAA: meetsAA(Math.max(vsWhite, vsBlack)) }
})

out('')
out('━'.repeat(76))
out(' 3. 単色一覧（白／黒テキストとのコントラスト・ライトテーマの値）')
out(`    対象 ${rows.length} 色 / 白か黒のどちらかで AA 達成 ${rows.filter(r => r.passAA).length} 色`)
out('━'.repeat(76))
out(`${'  色名'.padEnd(30) + 'hex'.padEnd(10) + 'vs白'.padEnd(9) + 'vs黒'.padEnd(9)}推奨文字`)
out('─'.repeat(76))
for (const r of rows) {
  const rec = r.vsWhite >= r.vsBlack
    ? (meetsAA(r.vsWhite) ? 'white ✅' : `white ${r.vsWhite}✗`)
    : (meetsAA(r.vsBlack) ? 'black ✅' : `black ${r.vsBlack}✗`)
  out(
    `${r.passAA ? '  ' : '  ❌'} ${r.name}`.padEnd(30)
    + r.hex.padEnd(10)
    + `${r.vsWhite}`.padEnd(9)
    + `${r.vsBlack}`.padEnd(9)
    + rec,
  )
}
out('─'.repeat(76))

// --- サマリ ---------------------------------------------------------------

const failed = results.filter(r => !r.pass)
out('')
out(`まとめ: 未定義トークン ${undefinedTokens.length} 件 / 明るすぎる背景 ${tooLight.length} 件 / コントラスト要確認 ${failed.length} 件`)
if (failed.length > 0) {
  for (const r of failed) {
    const detail = r.fgHex && r.bgHex ? `${r.ratio}:1（必要 ${(r.min ?? 4.5).toFixed(1)}:1）` : '色が未定義'
    out(`  ・[${r.theme}] ${r.label}: ${detail}`)
  }
}
out('')

// dev ツールとして違反があっても警告のみ。
// CI で失敗させたい場合は --strict を付ける。
const strict = process.argv.includes('--strict')
process.exit(strict && (failed.length > 0 || undefinedTokens.length > 0 || tooLight.length > 0) ? 1 : 0)
