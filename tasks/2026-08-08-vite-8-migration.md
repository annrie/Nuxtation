# vite 8 への移行（nuxtation・2026-08-09 完了）

2026-08-08 記録、**2026-08-09 に完了**（PR: `build/vite-8`）。link-card 抽出の修正の
途中で必要性が判明したが、スコープが大きく別作業として切り出したもの。

## 結果

`pnpm-workspace.yaml` の overrides を2段構えにして解決した。**片方だけでは成立しない。**

```yaml
vite-dev-rpc: ^2.0.0
vite-hot-client: ^2.2.0
vite-plugin-inspect: ^11.4.1
vite-plugin-pwa: ^1.3.0
vite-plugin-vue-tracer: ^1.4.0
vite@^7.0.0: ^8.1.5
```

加えて `@nuxt/devtools` を 3.3.1 → 3.4.1 へ。

完了条件（`pnpm peers check` で vite の unmet peer が消える）を達成し、
`vitest.config.ts` と `test/ogp-link-cards.spec.ts` を private-nuxtation から
持ち込んで **45 spec が通ることを確認**した。

検証結果:

- `pnpm test` — 45 passed（当初の目的）
- `pnpm build` — 48 routes、実エラーなし
- **PWA** — v1.3.0 で service worker 生成、precache 231 entries。
  `pwa:beforeBuildServiceWorker` フックも動作（globPattern が `_payload.js` に置換済み）
- **dev サーバ** — Vite 8.1.5 で起動、DevTools v3.4.1 認識、HTTP 200
- **HMR** — content を変更→反映、復元→反映の双方向を確認
- `pnpm lint` — エラー数は既存の 29 件のまま（増分ゼロ）
- `pnpm test:e2e` — firefox のスモークが不安定だが、**develop（vite 7）でも同じテストが
  落ちる**ことを確認済み。移行とは無関係の既存フレーク

`.pnpm` に vite 7.3.6 のインスタンスは残るが、pnpm が複数バージョンを共存させる正常な
状態。**重要なのは peer 要求が満たされていること。**

## なぜ必要か

**vitest 4 が動かない。** vitest 4 は rolldown ベースの vite 8（`rolldown ~1.1.5` を
内蔵）を前提にしており、rolldown を持たない vite 7 に載せると transform 時に落ちる:

```
Error: Missing field `moduleType`
  Plugin: builtin:replace
❯ rolldown@1.2.0/dist/shared/normalize-string-or-regex-*.mjs
❯ vite@7.3.6/dist/node/chunks/config.js
```

このリポジトリには `vitest.config.ts` が無く単体テストを一度も走らせていなかったため、
不整合が表面化していなかった。docustation / private-nuxtation は元から vite 8 のみで
解決されており、同じ設定で 29 spec が通ることを実測で確認済み。

現状 nuxtation の link-card 抽出には単体テストが無く、`scripts/check-ogp-cache.ts`
（tsx 実行）でキャッシュ欠落だけを検査している。抽出ロジック自体のテストは
private-nuxtation 側にある。

## なぜ単純に上げられないか

`pnpm-workspace.yaml` の `vite@^7.0.0: ^7.3.5` を `^8.1.5` に変えるだけでは駄目。
**vite 7 までしか peer 宣言していないパッケージの要求まで書き換えてしまい、
peer conflict が報告されないまま非対応の組み合わせを飲み込む。**

`pnpm peers check` で実測した影響範囲（9パッケージ）:

```
✕ unmet peer vite — Installed: 8.1.5, Wanted: ^7.3.5
  unplugin@3.3.0 / @nuxt/devtools@3.3.1 / @nuxt/devtools-kit@3.3.1
  vite-plugin-inspect@11.3.3 / vite-dev-rpc@1.1.0 / vite-hot-client@2.1.0
  vite-plugin-vue-tracer@1.3.0 / fontless@0.2.1 / @nuxt/devtools-kit@2.7.0
```

lockfile 上でも解決が書き換わる:

```
- vite-plugin-pwa: 1.2.0(...vite@7.3.6...)
+ vite-plugin-pwa: 1.2.0(...vite@8.1.5...)
```

`vitest>vite: ^8.1.5` というスコープ指定も試したが、**pnpm の peer 解決はグループ単位
のため vitest だけを切り離せず**、同じ書き換えが残った。`pnpm update vite --depth Infinity`
と lockfile の完全再生成でも解消しない（どちらも vite 7 のグループが残る）。

vite-plugin-pwa は `nuxt.config.ts` で有効な `@vite-pwa/nuxt` が実際に使う
（`pwa:beforeBuildServiceWorker` フックを含む）ので、無視してよい警告ではない。

## 上流の対応状況（2026-08-08 時点・実測）

**全パッケージに vite 8 対応版が存在する。**

| パッケージ               | 現在   | 最新   | 最新の peer vite    |
| ------------------------ | ------ | ------ | ------------------- |
| `@nuxt/devtools`         | 3.3.1  | 3.4.1  | `>=6.0`             |
| `@nuxt/devtools-kit`     | 3.3.1  | 3.4.1  | `>=6.0`             |
| `vite-plugin-pwa`        | 1.2.0  | 1.3.0  | `... \|\| ^8.0.0`   |
| `vite-plugin-inspect`    | 11.3.3 | 12.0.2 | `^8.0.0-0`（8のみ） |
| `vite-plugin-vue-tracer` | 1.3.0  | 1.4.0  | `... \|\| ^8.0.0-0` |
| `vite-dev-rpc`           | 1.1.0  | 2.0.0  | `... \|\| ^8.0.0`   |
| `vite-hot-client`        | 2.1.0  | 2.2.0  | `... \|\| ^8.0.0`   |
| `unplugin`               | 3.3.0  | 3.3.0  | `*`                 |
| `fontless`               | 0.2.1  | 0.2.1  | `*`                 |

`unplugin` と `fontless` は peer が `*` なので、警告に出ていたのは override が
要求を書き換えていたため。上げる必要はない。

`vite-plugin-inspect` と `vite-dev-rpc` はメジャー更新になる。多くは
`@nuxt/devtools` の依存なので、devtools を上げれば連動して解決する可能性が高い。

## 進め方（案）

1. `@nuxt/devtools` / `@nuxt/devtools-kit` を 3.4.1 へ（`package.json` は `^3.3.1` なので
   `pnpm update @nuxt/devtools --depth Infinity` で上がるはず）
2. `@vite-pwa/nuxt` 経由の `vite-plugin-pwa` を 1.3.0 へ
3. 残った非対応パッケージを override で個別に引き上げる
4. `vite@^7.0.0: ^7.3.5` を `^8.1.5` に変更
5. **`pnpm peers check` で vite の unmet peer が消えることを確認**（これが完了条件）
6. `vitest.config.ts` と `test/ogp-link-cards.spec.ts` を private-nuxtation から byte 同一で持ち込む

## 検証範囲

vite はビルドだけでなく dev サーバと devtools にも効くので、build だけでは足りない。

- `pnpm build`（`.vercel/output` 生成、48 routes）
- `pnpm dev` の起動と HMR
- **PWA**: service worker の生成、`pwa:beforeBuildServiceWorker` フックが動くこと
- **devtools**: 起動して主要パネルが開くこと
- `pnpm lint`
- `pnpm test:e2e`

## 参考

- 一度 PR にして codex から P2 指摘を受けクローズした: https://github.com/annrie/Nuxtation/pull/18
