/**
 * vite の peer 互換性の検査
 *
 * 背景:
 *   `pnpm-workspace.yaml` の `vite@^7.0.0: ^8.1.5` は、依存の解決だけでなく
 *   **pnpm-lock.yaml 上の peerDependencies 宣言そのものを書き換える**。
 *   たとえば `@nuxt/devtools-kit@2.7.0` は上流で `vite: ">=6.0"` を宣言して
 *   いるが、lockfile には `vite: ^8.1.5` と記録される。
 *
 *   このため **`pnpm peers check` が通っても互換性の証明にはならない**。
 *   override が非互換を書き換えて隠した場合も同じように「unmet なし」に
 *   見えてしまう。
 *
 *   そこでこの検査は lockfile を信用せず、node_modules に展開された
 *   package.json（＝上流の宣言そのまま。override でも書き換わらないことを
 *   確認済み）を読み、実際に解決された vite が上流のレンジを満たすかを見る。
 *
 * 使い方:
 *   pnpm check:vite-peers                # 満たさないものがあれば exit 1
 *   pnpm check:vite-peers --verbose      # 満たしたものも一覧表示
 *   pnpm check:vite-peers --vite 9.0.0   # 別バージョンなら通るかを試算する
 *
 *   `--vite` は上げる前の下調べに使うほか、**この検査が実際に落ちること**を
 *   確かめるのにも使う（誰も満たさない版を渡せば必ず失敗する。落ちない検査を
 *   置いても意味がないので、変更したら一度は試すこと）。
 */

import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const PNPM_DIR = join(ROOT, 'node_modules/.pnpm')
const LOCKFILE = join(ROOT, 'pnpm-lock.yaml')

interface Row {
  name: string
  version: string
  range: string
  unmet: string[]
}

/** `.pnpm` の展開先から semver を借りる（トップレベルに hoist されない場合がある）。 */
async function loadSemver(entries: string[]) {
  const dir = entries.find(e => /^semver@\d/.test(e))
  if (!dir)
    throw new Error(`semver が見つかりません: ${PNPM_DIR}`)
  const require = createRequire(`${join(PNPM_DIR, dir, 'node_modules')}/`)
  return require('semver') as typeof import('semver')
}

/**
 * `.pnpm` のディレクトリ名から、実際の package.json の位置と名前を割り出す。
 * スコープ付きは `@scope+name@1.2.3_hash` の形になる。
 */
async function resolvePackage(dir: string) {
  const inner = join(PNPM_DIR, dir, 'node_modules')
  let names: string[]
  try {
    names = await readdir(inner)
  }
  catch {
    return null
  }

  for (const entry of names) {
    if (entry.startsWith('@')) {
      for (const sub of await readdir(join(inner, entry))) {
        if (dir.startsWith(`${entry}+${sub}@`))
          return { name: `${entry}/${sub}`, path: join(inner, entry, sub, 'package.json') }
      }
    }
    else if (dir.startsWith(`${entry}@`)) {
      return { name: entry, path: join(inner, entry, 'package.json') }
    }
  }
  return null
}

async function main() {
  const verbose = process.argv.includes('--verbose')
  const entries = await readdir(PNPM_DIR)
  const semver = await loadSemver(entries)

  // **lockfile に載っている版だけを見る。** `.pnpm` には過去の
  // インストール分が残るため、これを怠ると override で引き上げる前の
  // 旧版が「vite 8 非対応」として大量に誤検出される（実際にそうなった）。
  const lockText = readFileSync(LOCKFILE, 'utf8')
  const inLock = (name: string, version: string) => lockText.includes(`  ${name}@${version}:`)

  // 解決された vite も lockfile から採る（同上の理由）。
  // --vite で差し替えれば、上げる前の下調べや検査自体の動作確認に使える。
  const override = process.argv[process.argv.indexOf('--vite') + 1]
  const viteVersions = process.argv.includes('--vite') && override
    ? [override]
    : [...new Set(
        [...lockText.matchAll(/^ {2}vite@([\d.]+(?:-[\w.]+)?):/gm)].map(m => m[1]!),
      )]
  if (viteVersions.length === 0)
    throw new Error('lockfile から vite のバージョンを読めませんでした。')

  const rows: Row[] = []
  for (const dir of entries) {
    const resolved = await resolvePackage(dir)
    if (!resolved)
      continue

    let pkg: { version?: string, peerDependencies?: Record<string, string> }
    try {
      pkg = JSON.parse(readFileSync(resolved.path, 'utf8'))
    }
    catch {
      continue
    }

    const range = pkg.peerDependencies?.vite
    if (!range || !pkg.version || !inLock(resolved.name, pkg.version))
      continue

    rows.push({
      name: resolved.name,
      version: pkg.version,
      range,
      unmet: viteVersions.filter(v => !semver.satisfies(v, range, { includePrerelease: true })),
    })
  }

  // 同一パッケージが peer の組み合わせ違いで複数展開されるため重複を畳む。
  const unique = [...new Map(rows.map(r => [`${r.name}@${r.version}`, r])).values()]
    .sort((a, b) => a.name.localeCompare(b.name))
  const broken = unique.filter(r => r.unmet.length > 0)

  console.log(`解決された vite: ${viteVersions.join(', ')}`)
  console.log(`vite を peer 宣言するパッケージ: ${unique.length} 件\n`)

  if (verbose) {
    for (const r of unique.filter(r => r.unmet.length === 0))
      console.log(`  ✅ ${r.name}@${r.version}  要求: ${r.range}`)
    console.log()
  }

  if (broken.length === 0) {
    console.log('✅ 上流のレンジを満たさないパッケージはありません。')
    return
  }

  console.log('❌ 上流のレンジを満たさないパッケージがあります:\n')
  for (const r of broken)
    console.log(`  ${r.name}@${r.version}\n    上流の要求: ${r.range}\n    未充足    : ${r.unmet.join(', ')}\n`)

  console.log('対処: 対応版へ上げる override を追加するか、vite を戻してください。')
  console.log('      `pnpm peers check` はこの状態でも通るので当てになりません。')
  process.exit(1)
}

main()
