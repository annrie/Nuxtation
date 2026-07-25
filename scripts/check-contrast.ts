/**
 * ビルド時 WCAG コントラストチェックスクリプト（Tailwind版）
 *
 * app/assets/css/theme.css で定義された全 --color-* に対して
 * white / black テキストとのコントラスト比を計算し、WCAG AA 違反を報告する。
 * （UnoCSS 版と違い、色は theme.css から動的に抽出するので手動同期が不要）
 *
 * 実行: pnpm run check:contrast
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { contrastRatio, meetsAA, parseHexColor } from '../utils/wcag-contrast'

// 標準出力ヘルパー（console を使わず CLI 出力する）
const out = (s = '') => process.stdout.write(`${s}\n`)

// 検査に使うテキスト色（サイトの近似値。white/black 双方で評価する）
const WHITE = '#ffffff'
const BLACK = '#0a0a0a'

// --- theme.css から --color-NAME: #HEX を抽出 ---
const themePath = resolve(dirname(fileURLToPath(import.meta.url)), '../app/assets/css/theme.css')
const css = readFileSync(themePath, 'utf8')

// 同名は後勝ち（:root が @theme のデフォルトを上書きする想定）
const colors = new Map<string, string>()
for (const m of css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{3,6})\b/gi)) {
  const hex = parseHexColor(m[2])
  if (hex)
    colors.set(m[1], hex)
}

interface Row {
  name: string
  hex: string
  vsWhite: number
  vsBlack: number
  best: number
  passAA: boolean // white か black のどちらかで AA を満たすか
}

const rows: Row[] = [...colors].map(([name, hex]) => {
  const vsWhite = Math.round(contrastRatio(hex, WHITE) * 100) / 100
  const vsBlack = Math.round(contrastRatio(hex, BLACK) * 100) / 100
  const best = Math.max(vsWhite, vsBlack)
  return { name, hex, vsWhite, vsBlack, best, passAA: meetsAA(best) }
})

out('\n🔍 WCAG コントラストチェック結果（theme.css）\n')
out(`   対象: ${rows.length} 色（app/assets/css/theme.css の --color-*）`)
out(`   ✅ 白 or 黒テキストで AA 達成: ${rows.filter(r => r.passAA).length} 色`)
out(`   ❌ どちらでも AA 未達: ${rows.filter(r => !r.passAA).length} 色\n`)

out('─'.repeat(74))
out(`${'色名'.padEnd(28) + 'hex'.padEnd(10) + 'vs白'.padEnd(9) + 'vs黒'.padEnd(9)}推奨文字`)
out('─'.repeat(74))
for (const r of rows) {
  const rec = r.vsWhite >= r.vsBlack
    ? (meetsAA(r.vsWhite) ? 'white ✅' : `white ${r.vsWhite}✗`)
    : (meetsAA(r.vsBlack) ? 'black ✅' : `black ${r.vsBlack}✗`)
  const mark = r.passAA ? ' ' : '❌'
  out(
    `${mark} ${r.name}`.padEnd(28)
    + r.hex.padEnd(10)
    + `${r.vsWhite}`.padEnd(9)
    + `${r.vsBlack}`.padEnd(9)
    + rec,
  )
}
out('─'.repeat(74))

// 白文字前提の背景色（*-active, tag-bg-* など）で白が AA 未達のものを警告
const bgLike = rows.filter(r => /-active|-bg-|button/.test(r.name))
const bgWhiteFail = bgLike.filter(r => !meetsAA(r.vsWhite))
if (bgWhiteFail.length > 0) {
  out('\n⚠ 白文字を乗せる想定の背景色で AA 未達（黒文字なら達成する場合あり）:')
  for (const r of bgWhiteFail) {
    const alt = meetsAA(r.vsBlack) ? ` → 黒文字なら OK (${r.vsBlack}:1)` : ' → 白黒どちらも不足'
    out(`   bg-${r.name} (${r.hex}) + 白文字: ${r.vsWhite}:1${alt}`)
  }
}

out('')
// dev ツールとして違反があっても警告のみ
process.exit(0)
