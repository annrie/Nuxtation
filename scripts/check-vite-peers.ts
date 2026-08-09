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
 *   そこでこの検査は lockfile の記載を信用せず、展開された package.json
 *   （＝上流の宣言そのまま。override でも書き換わらない）を読む。
 *
 * 実装方針 — **依存グラフは pnpm に答えさせる**:
 *   当初は `node_modules/.pnpm` を直接走査し、lockfile を文字列照合して
 *   「生きているエントリか」を判定していた。これは次々に破れた:
 *
 *     - `.pnpm` には過去のインストール分が残る（旧版が非対応として誤検出）
 *     - lockfile はスコープ付きを `'@nuxt/devtools-kit@2.7.0':` と引用符で
 *       囲むため、素朴な文字列照合が常に false になり、**スコープ付きが
 *       まるごと検査対象から消えていた**（この検査を作る動機だった
 *       `@nuxt/devtools-kit` 自身が漏れていた）
 *     - 残骸判定をパッケージ名・版と vite の版で独立に行うと、その vite が
 *       別の依存で現役の場合に残骸を現役と誤認する
 *
 *   個別に手当てするたび別の穴が空いたので、方式ごと変えた。
 *   `pnpm list --json --depth Infinity` は**現に解決されている依存だけ**を
 *   実体のパス付きで返すので、残骸も引用符もそもそも問題にならない。
 *   割り当てられた vite は、そのパッケージ自身の位置から Node の解決に
 *   任せる（peer の組み合わせごとに正しい実体へ辿り着く）。
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

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import process from 'node:process'

interface Row {
  name: string
  version: string
  /** 上流が宣言している vite の peer レンジ。 */
  range: string
  /** そのパッケージ自身の位置から解決される vite。 */
  vite: string
  satisfied: boolean
}

/** `pnpm list` の 1 エントリ。実体のパスと、そこから先の依存を持つ。 */
interface ListNode {
  version?: string
  path?: string
  dependencies?: Record<string, ListNode>
  devDependencies?: Record<string, ListNode>
  optionalDependencies?: Record<string, ListNode>
}

/**
 * 現に解決されている依存を、実体のパス付きで列挙する。
 * `.pnpm` の走査と違い、過去のインストール分は出てこない。
 */
function collectResolved(): Map<string, string> {
  const json = execFileSync(
    'pnpm',
    ['list', '--json', '--depth', 'Infinity'],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
  )
  const roots = JSON.parse(json) as ListNode[]

  // パス単位で畳む。同じパッケージでも peer の組み合わせが違えば別の実体で、
  // 割り当てられる vite も変わりうるので、名前では畳まない。
  const byPath = new Map<string, string>()
  // 循環依存があっても止まるよう、辿ったノードそのものを覚えておく
  // （path を持たないノードもあるので、path だけでは打ち切れない）。
  const visited = new Set<ListNode>()

  const walk = (node: ListNode, name?: string) => {
    if (visited.has(node))
      return
    visited.add(node)

    if (node.path && name && !byPath.has(node.path))
      byPath.set(node.path, name)

    for (const group of [node.dependencies, node.devDependencies, node.optionalDependencies]) {
      if (!group)
        continue
      for (const [depName, dep] of Object.entries(group))
        walk(dep, depName)
    }
  }

  for (const root of roots)
    walk(root)

  return byPath
}

function main() {
  const verbose = process.argv.includes('--verbose')
  const assumeIndex = process.argv.indexOf('--vite')
  const assumed = assumeIndex >= 0 ? process.argv[assumeIndex + 1] : undefined

  const resolved = collectResolved()

  // semver は解決済みの依存から借りる（トップレベルに hoist されない場合がある）。
  const semverPath = [...resolved].find(([, name]) => name === 'semver')?.[0]
  if (!semverPath)
    throw new Error('semver を依存ツリーから見つけられませんでした。')
  const semver = createRequire(`${semverPath}/`)('semver') as typeof import('semver')

  const rows: Row[] = []
  for (const [path, name] of resolved) {
    let pkg: { version?: string, peerDependencies?: Record<string, string> }
    try {
      pkg = JSON.parse(readFileSync(`${path}/package.json`, 'utf8'))
    }
    catch {
      continue
    }

    const range = pkg.peerDependencies?.vite
    if (!range || !pkg.version)
      continue

    // **そのパッケージ自身の位置から vite を解決する。** ツリーに複数の vite が
    // 並ぶことは正当にありうるので、全バージョンと総当たりすると正しく
    // リンクされたパッケージまで落ちる。Node の解決なら取り違えない。
    let vite = assumed
    if (!vite) {
      try {
        const req = createRequire(`${path}/`)
        vite = JSON.parse(readFileSync(req.resolve('vite/package.json'), 'utf8')).version
      }
      catch {
        continue // peer が供給されていない（optional peer など）
      }
    }
    if (!vite)
      continue

    rows.push({
      name,
      version: pkg.version,
      range,
      vite,
      satisfied: semver.satisfies(vite, range, { includePrerelease: true }),
    })
  }

  // 表示は名前・版・割り当て vite の組で畳む（実体が別でも内容が同じなら1行）。
  const unique = [...new Map(rows.map(r => [`${r.name}@${r.version}+vite@${r.vite}`, r])).values()]
    .sort((a, b) => a.name.localeCompare(b.name) || a.vite.localeCompare(b.vite))
  const broken = unique.filter(r => !r.satisfied)

  const seenVite = [...new Set(unique.map(r => r.vite))].sort()
  console.log(assumed
    ? `仮定する vite: ${assumed}（実際の解決結果ではなく試算）`
    : `解決された vite: ${seenVite.join(', ')}`)
  console.log(`vite を peer 宣言するパッケージ: ${unique.length} 件\n`)

  if (verbose) {
    for (const r of unique.filter(r => r.satisfied))
      console.log(`  ✅ ${r.name}@${r.version}  要求: ${r.range}  → vite ${r.vite}`)
    console.log()
  }

  if (broken.length === 0) {
    console.log('✅ 上流のレンジを満たさないパッケージはありません。')
    return
  }

  console.log('❌ 上流のレンジを満たさないパッケージがあります:\n')
  for (const r of broken)
    console.log(`  ${r.name}@${r.version}\n    上流の要求: ${r.range}\n    解決結果  : vite ${r.vite}\n`)

  console.log('対処: 対応版へ上げる override を追加するか、vite を戻してください。')
  console.log('      `pnpm peers check` はこの状態でも通るので当てになりません。')
  process.exit(1)
}

main()
