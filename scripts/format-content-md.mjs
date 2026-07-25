#!/usr/bin/env node
// content/**/*.md を MDC 対応で整形する。
//
// Nuxt Content と同じ方針で frontmatter(---) を分離し、本文だけ remark-mdc で
// 整形して元の frontmatter を verbatim で再結合する。これにより frontmatter は
// 一切変更されない（remark-mdc は標準 --- frontmatter を扱えず破壊してしまうため、
// 本文に渡してはいけない）。
//
// remark-mdc はネスト構造を1パスずつ正規化するため、初回の手書きファイルは
// 数回通さないと安定しない。ここでは「変化しなくなるまで」内部でループするので
// 呼び出し側は1回実行すればよい。
//
// 使い方:
//   node scripts/format-content-md.mjs                 # content 配下を上書き整形
//   node scripts/format-content-md.mjs <files...>       # 指定ファイルのみ（lint-staged用）
//   node scripts/format-content-md.mjs --check [files]  # 差分があれば終了コード1（CI用）
import { globSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkGfm from 'remark-gfm'
import remarkMdc from 'remark-mdc'

const args = process.argv.slice(2)
const CHECK = args.includes('--check')
const targets = args.filter(a => !a.startsWith('--'))

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMdc)
  .use(remarkStringify, {
    bullet: '-',
    listItemIndent: 'one',
    fences: true,
    rule: '-',
    ruleSpaces: false,
    emphasis: '_',
    strong: '*',
  })

// 先頭の --- ... --- を frontmatter として切り出す（本文だけ整形するため）
const FRONTMATTER = /^(---\r?\n[\s\S]*?\r?\n---\r?\n)([\s\S]*)$/

async function formatOnce(raw) {
  const m = raw.match(FRONTMATTER)
  const frontmatter = m ? m[1] : ''
  const body = m ? m[2] : raw
  const formattedBody = String(await processor.process(body))
  return frontmatter + (frontmatter ? '\n' : '') + formattedBody.replace(/^\n+/, '')
}

// 変化しなくなるまで繰り返す（ネスト正規化が段階的なため）。上限は安全弁。
async function formatStable(raw, maxIter = 15) {
  let cur = raw
  for (let i = 0; i < maxIter; i++) {
    const next = await formatOnce(cur)
    if (next === cur)
      return cur
    cur = next
  }
  // maxIter で収束しなかった＝安定した整形にならないファイル。
  // 不安定な中間状態を書き込まず、原本を保持する。
  return raw
}

const files = targets.length ? targets : globSync('content/**/*.md')
let changed = 0
let skipped = 0
for (const f of files) {
  const before = readFileSync(f, 'utf8')
  let after
  try {
    after = await formatStable(before)
  }
  catch (err) {
    // remark-mdc が特定の構文(極端に長い URL 断片リンク等)で稀にクラッシュする。
    // その1ファイルのために全体を止めず、原本のままスキップする。
    skipped++
    console.warn(`⚠ スキップ(整形不可): ${f} — ${err.message.split('\n')[0]}`)
    continue
  }
  if (before !== after) {
    changed++
    if (CHECK)
      console.log(`✗ 要整形: ${f}`)
    else {
      writeFileSync(f, after)
      console.log(`✓ 整形: ${f}`)
    }
  }
}
console.log(`\n${files.length} ファイル中 ${changed} 件${CHECK ? ' に差分あり' : ' を整形'}${skipped ? ` / ${skipped} 件スキップ` : ''}`)
if (CHECK && changed > 0)
  process.exit(1)
