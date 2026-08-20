# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## v4.5.3

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.5.2...v4.5.3)

### 📦 ビルド

- **deps:** ⬆️ Snyk指摘のhono 4.13.3ほかロックファイル再解決で更新 ([334cbef](https://github.com/annrie/Nuxtation/commit/334cbef))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.5.2

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.5.1...v4.5.2)

### 📖 ドキュメント

- 📛 READMEにステータスバッジを追加 ([6bd5a63](https://github.com/annrie/Nuxtation/commit/6bd5a63))

### 📦 ビルド

- **deps:** ⬆️ nuxt 4.5.2 / @nuxtjs/mdc 0.23.1 ほかminor/patch一括更新 ([57bea28](https://github.com/annrie/Nuxtation/commit/57bea28))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.5.1

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.5.0...v4.5.1)

### 🐛 バグ修正

- **deps:** 🔒 Snyk 指摘の推移的依存5件を修正版へ引き上げる ([#21](https://github.com/annrie/Nuxtation/pull/21))

### 📖 ドキュメント

- **test:** 📝 vitest まわりのコメントを実態に合わせる ([#22](https://github.com/annrie/Nuxtation/pull/22))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.5.0

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.4.6...v4.5.0)

### 📦 ビルド

- **deps:** Vite 8 へ移行し vitest を使えるようにする ([#20](https://github.com/annrie/Nuxtation/pull/20))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.4.6

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.4.5...v4.4.6)

### 🐛 バグ修正

- **ogp:** Link-card の抽出を MDC の AST へ移しキャッシュ欠落を検出する ([3fb1861](https://github.com/annrie/Nuxtation/commit/3fb1861))
- **ogp:** キャッシュ検査をステージの内容に対して行う ([32a2151](https://github.com/annrie/Nuxtation/commit/32a2151))
- **ogp:** ステージにキャッシュが無いケースの判定を直す ([b32008b](https://github.com/annrie/Nuxtation/commit/b32008b))
- **ogp:** キャッシュファイルの不在をエラーにする ([cdf6f41](https://github.com/annrie/Nuxtation/commit/cdf6f41))
- **ogp:** キャッシュ検査を pre-commit へ移し削除も捕まえる ([eb6dff3](https://github.com/annrie/Nuxtation/commit/eb6dff3))
- **ogp:** Rename・壊れたエントリ・抽出側の変更を検査対象に含める ([2bd5d75](https://github.com/annrie/Nuxtation/commit/2bd5d75))
- **ogp:** 検査コード自身のステージずれを検出する ([80e2a2e](https://github.com/annrie/Nuxtation/commit/80e2a2e))
- **ogp:** 古いエントリ・型変更・バインド記法・フック未更新を塞ぐ ([11e7503](https://github.com/annrie/Nuxtation/commit/11e7503))
- **ogp:** V-bind の全綴りと予約ホストのエントリを拒否する ([bf02725](https://github.com/annrie/Nuxtation/commit/bf02725))
- **ogp:** URL バインドの判定を接頭辞の列挙からやめる ([b886c9b](https://github.com/annrie/Nuxtation/commit/b886c9b))
- **ogp:** キャッシュのルートがオブジェクトであることを検証する ([3144c15](https://github.com/annrie/Nuxtation/commit/3144c15))
- **ogp:** Index から消えた検査スクリプトも検出する ([c0c4352](https://github.com/annrie/Nuxtation/commit/c0c4352))
- **ogp:** 検査スクリプトが通常ファイルであることを index の mode で確かめる ([8e1aa4f](https://github.com/annrie/Nuxtation/commit/8e1aa4f))
- **ogp:** キャッシュも通常ファイルであることを index の mode で確かめる ([3b7bf75](https://github.com/annrie/Nuxtation/commit/3b7bf75))

### 📖 ドキュメント

- **agents:** OGP キャッシュ検査の位置づけと削除禁止を明記する ([457ac49](https://github.com/annrie/Nuxtation/commit/457ac49))

### 🧹 ビルドプロセスまたは補助ツールの変更

- MCP の生成スナップショットを ignore する ([069a1aa](https://github.com/annrie/Nuxtation/commit/069a1aa))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.4.5

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.4.4...v4.4.5)

### 🐛 バグ修正

- **seo:** 正規URLを nuxtation.vercel.app に統一し、manifest を相対パス化 ([946e4a0](https://github.com/annrie/Nuxtation/commit/946e4a0))
- **perf:** Lighthouse の計測先を nuxtation に直し、死んだ manifest を削除 ([ad8c442](https://github.com/annrie/Nuxtation/commit/ad8c442))

### ♻️ リファクタリング

- **seo:** 正規URLを SiteUrl 定数に集約し、死んだ logic/ を削除 ([790f44f](https://github.com/annrie/Nuxtation/commit/790f44f))

### 📖 ドキュメント

- **agents:** Logic/ の記述を現状に合わせる ([fb0300e](https://github.com/annrie/Nuxtation/commit/fb0300e))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.4.4

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.4.3...v4.4.4)

### 🐛 バグ修正

- **blog:** Update updatedAt for link card article security notice ([cb58174](https://github.com/annrie/Nuxtation/commit/cb58174))
- **a11y:** Link-card のURL表示のコントラストをAA準拠に修正 ([dfac96c](https://github.com/annrie/Nuxtation/commit/dfac96c))

### 📖 ドキュメント

- **security:** 記事に /api/ogp の危険性と現行方式の注記を追加 ([90b80f6](https://github.com/annrie/Nuxtation/commit/90b80f6))
- **blog:** 記事のコードサンプルを修正後の実装に同期 ([c3f31af](https://github.com/annrie/Nuxtation/commit/c3f31af))
- **security:** 注記の主張を正確にし、サンプルの timeout も修正 ([52a0335](https://github.com/annrie/Nuxtation/commit/52a0335))
- **security:** サイト固有の露出範囲の記述を削除し、fence範囲を修正 ([43702c3](https://github.com/annrie/Nuxtation/commit/43702c3))
- **security:** 存在しないOGSオプションの記述を正し、注記の主張を限定 ([740ee40](https://github.com/annrie/Nuxtation/commit/740ee40))
- OGSのオプション列挙をやめ、公式の型定義を参照させる ([02cd09c](https://github.com/annrie/Nuxtation/commit/02cd09c))
- **security:** サンプルのタイムアウト判定を OGS の二重ラップに対応させる ([c5c145d](https://github.com/annrie/Nuxtation/commit/c5c145d))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.4.3

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.4.2...v4.4.3)

### 🐛 バグ修正

- **security:** 🔒 /api/ogp を廃止し OGP をビルド時解決へ移行 ([3e2f306](https://github.com/annrie/Nuxtation/commit/3e2f306))
- **a11y:** LinkCard フォールバックリンクのコントラスト比を AA 準拠に修正 ([c94c307](https://github.com/annrie/Nuxtation/commit/c94c307))
- レビュー指摘4件を反映(LinkCardフォールバック/rel/コメント/複製注意) ([2a80423](https://github.com/annrie/Nuxtation/commit/2a80423))
- **ogp:** 全滅ガードを書き込み前に移し、破損キャッシュは中断する ([81a0ae9](https://github.com/annrie/Nuxtation/commit/81a0ae9))
- **scripts:** Open-graph-scraper の timeout 単位をミリ秒→秒に修正 ([d6a86a6](https://github.com/annrie/Nuxtation/commit/d6a86a6))

### 📖 ドキュメント

- **spec:** OGP取得をビルド時解決へ移行する設計 ([672ce97](https://github.com/annrie/Nuxtation/commit/672ce97))
- **plan:** OGP ビルド時解決への移行 実装計画 ([4ac974e](https://github.com/annrie/Nuxtation/commit/4ac974e))
- **plan:** 実行方針をfeatureブランチ＋PRに変更 ([0b8b248](https://github.com/annrie/Nuxtation/commit/0b8b248))
- 検証手順を build から generate に修正 ([1472b48](https://github.com/annrie/Nuxtation/commit/1472b48))
- デプロイ経路の誤認を訂正し、次PRの課題を明記 ([fc4ef95](https://github.com/annrie/Nuxtation/commit/fc4ef95))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.4.2

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.4.1...v4.4.2)

### 🐛 バグ修正

- **test:** 実行されていなかった Playwright 設定を修復 ([#14](https://github.com/annrie/Nuxtation/pull/14))
- **deps:** 🔒 undici を 7.29.0 に上げ Information Exposure を解消 ([a092d01](https://github.com/annrie/Nuxtation/commit/a092d01))

### 🧹 ビルドプロセスまたは補助ツールの変更

- **config:** 🔧 .entire/ を削除 ([9729b3a](https://github.com/annrie/Nuxtation/commit/9729b3a))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.4.1

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.4.0...v4.4.1)

### 🐛 バグ修正

- **deps:** ⬆️ postcss/brace-expansion の脆弱性を解消し未使用の js-yaml を削除 ([96bd1a1](https://github.com/annrie/Nuxtation/commit/96bd1a1))
- **css:** 🐛 kiso.css をレイヤーに入れ lang="ja" を実際に出力させる ([4d86ca0](https://github.com/annrie/Nuxtation/commit/4d86ca0))
- **css:** 🐛 kiso.css のフォーム要素ボーダー既定値を外しタブの枠を解消 ([9b40987](https://github.com/annrie/Nuxtation/commit/9b40987))
- **deps:** 🔒 Snyk / pnpm audit 指摘の脆弱性を解消 ([3245a46](https://github.com/annrie/Nuxtation/commit/3245a46))
- **deps:** 🔒 @hono/node-server を1系最新に留める ([471f783](https://github.com/annrie/Nuxtation/commit/471f783))

### 📦 ビルド

- **deps:** ⬆️ nuxt 4.5.1・@nuxt/devtools 3.3.1 ほかminor/patch一括更新 ([7b40157](https://github.com/annrie/Nuxtation/commit/7b40157))

### 🧹 ビルドプロセスまたは補助ツールの変更

- **home:** 🔧 機能していない訪問カウンタを削除 ([61fde1d](https://github.com/annrie/Nuxtation/commit/61fde1d))

### 🤖 CI関連

- 🔧 CSSコントラストとカスケードレイヤーの検査をCIに追加 ([cdf5e8f](https://github.com/annrie/Nuxtation/commit/cdf5e8f))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.4.0

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.3.6...v4.4.0)

### 🚀 新機能

- **tooling:** ✨ Tailwind版 WCAGコントラストチェックを追加 ([6b33aac](https://github.com/annrie/Nuxtation/commit/6b33aac))

### ⚡ パフォーマンスの向上

- **search:** ⚡ 検索データをモーダル起動時まで遅延読み込み ([3e6fa88](https://github.com/annrie/Nuxtation/commit/3e6fa88))
- **blog:** ⚡ タグページのpayload肥大を解消（body除外） ([10d6bb0](https://github.com/annrie/Nuxtation/commit/10d6bb0))

### 🐛 バグ修正

- **content:** 🐛 blog/[slug]ページに404分岐を追加 ([e3a5848](https://github.com/annrie/Nuxtation/commit/e3a5848))
- **tooling:** 🐛 欠落していた lighthouse-production.sh を補完 ([2d30415](https://github.com/annrie/Nuxtation/commit/2d30415))
- **content:** 🔗 blog/10 のリンク切れを解消（実践編リンクを除去） ([1dfe63b](https://github.com/annrie/Nuxtation/commit/1dfe63b))
- **deploy:** 🚀 Vercelビルド失敗を解消（pnpm 11をcorepackで使用） ([ade17fd](https://github.com/annrie/Nuxtation/commit/ade17fd))
- **server:** 🐛 favicon/アイコンファイルの500(FUNCTION_INVOCATION_FAILED)を解消 ([84dbfb5](https://github.com/annrie/Nuxtation/commit/84dbfb5))
- **deploy:** 🚀 Vercelビルドをnpxでpnpm 11実行に変更＋Node 22固定 ([1d848f9](https://github.com/annrie/Nuxtation/commit/1d848f9))
- **deploy:** 🚀 NITRO_PRESET=vercel を強制しedgeビルド失敗を回避 ([f0a6086](https://github.com/annrie/Nuxtation/commit/f0a6086))
- **ui:** 🎨 404/エラーページをTailwindで作り直す ([40b8d0b](https://github.com/annrie/Nuxtation/commit/40b8d0b))
- **deps:** 🔒 sharp/@hono/node-server のCVEをpnpm overrideで解消 ([31aa42b](https://github.com/annrie/Nuxtation/commit/31aa42b))
- **search:** 🐛 非同期モーダルが開いた状態でマウントされた際の検索データ未読込を修正 ([52c0e0d](https://github.com/annrie/Nuxtation/commit/52c0e0d))
- **content:** 🔒 Codex指摘対応（MDC整形ツール撤去・コンテンツ復元ほか） ([b3c3c2b](https://github.com/annrie/Nuxtation/commit/b3c3c2b))
- **tooling:** 🐛 lighthouseレポートの読取パスに .report を反映 ([0c806bc](https://github.com/annrie/Nuxtation/commit/0c806bc))
- **search:** 🐛 Vercelで検索モーダルが「読み込み中」で固まる問題を修正 ([3cb901c](https://github.com/annrie/Nuxtation/commit/3cb901c))
- **content:** 🐛 検索が動かない原因の@sqlite.org/sqlite-wasm external指定を除去 ([91a7d6b](https://github.com/annrie/Nuxtation/commit/91a7d6b))

### ♻️ リファクタリング

- **css:** ♻️ Nuxt UI v4 / Tailwind v4 の作法に合わせ biblio 残骸を削除 ([7180703](https://github.com/annrie/Nuxtation/commit/7180703))

### 📦 ビルド

- **tooling:** 🔧 husky撤去しsimple-git-hooksへ統一・pre-commit修正 ([024381e](https://github.com/annrie/Nuxtation/commit/024381e))
- **tooling:** 🔧 MDC対応のcontent md整形ツールを追加 ([ca38344](https://github.com/annrie/Nuxtation/commit/ca38344))
- **tooling:** 🔧 md整形ツールを堅牢化（docustation/private-nuxtationと統一） ([94da62f](https://github.com/annrie/Nuxtation/commit/94da62f))

### 🧹 ビルドプロセスまたは補助ツールの変更

- **config:** 🔧 devtools二重登録の削除とvite.server.warmup追加 ([86c462f](https://github.com/annrie/Nuxtation/commit/86c462f))
- **tooling:** 🧹 不要な lint:md スクリプトを削除 ([222ff0f](https://github.com/annrie/Nuxtation/commit/222ff0f))
- **content:** 🧹 blog記事6本を削除（02,03,04,11,12,13） ([c4ca466](https://github.com/annrie/Nuxtation/commit/c4ca466))

### 🎨 コードスタイル

- **content:** 🎨 全blog記事をMDC対応ツールで整形 ([17da174](https://github.com/annrie/Nuxtation/commit/17da174))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

## v4.3.6

[compare changes](https://github.com/annrie/Nuxtation/compare/v4.3.5...v4.3.6)

### 🐛 バグ修正

- **security:** 🔒 ws 8.21.1をoverridesで強制しDoS脆弱性を解消 ([01ad7d9](https://github.com/annrie/Nuxtation/commit/01ad7d9))
- **security:** 🔒 ws 7系も7.5.13へ強制しCVE-2026-48779を完全に解消 ([daf7c7c](https://github.com/annrie/Nuxtation/commit/daf7c7c))

### 📖 ドキュメント

- **tasks:** 📝 脆弱性アラートの読み違いに関するlessonsを記録 ([f4c5116](https://github.com/annrie/Nuxtation/commit/f4c5116))

### 📦 ビルド

- **release:** 🔧 standard-versionをchangelogenに置き換え ([5147e1d](https://github.com/annrie/Nuxtation/commit/5147e1d))
- **deps:** ⬆️ nuxt 4.5.0・@nuxt/ui 4.10.0・pnpm 11.15.1 ほかminor/patch一括更新 ([fb40b0e](https://github.com/annrie/Nuxtation/commit/fb40b0e))

### 🧹 ビルドプロセスまたは補助ツールの変更

- **config:** 🔧 開発ループの許可ルールをsettings.jsonに集約 ([29f9d0d](https://github.com/annrie/Nuxtation/commit/29f9d0d))

### ❤️ Contributors

- Annrie ([@annrie](https://github.com/annrie))

### [4.3.5](https://github.com/annrie/Nuxtation/compare/v4.3.4...v4.3.5) (2026-07-16)


### CI関連

* 🔧 GitHub Pagesデプロイを廃止し、SSG出力の健全性チェックに置き換え ([e5efe97](https://github.com/annrie/Nuxtation/commit/e5efe97d4e5d8ee24e17fa7b728a2e457c019544))


### バグ修正

* **security:** 🔒 handlebars 4.7.9・shell-quote 1.10.0をoverridesで強制 ([79dc977](https://github.com/annrie/Nuxtation/commit/79dc977d07796e155c154de804e00f8f39929811))

### [4.3.4](https://github.com/annrie/Nuxtation/compare/v4.3.3...v4.3.4) (2026-07-15)


### バグ修正

* **deps:** 🐛 pnpm dedupeでvue二重解決(3.5.34/3.5.39)を解消 ([c6f440a](https://github.com/annrie/Nuxtation/commit/c6f440abc7834da697cc1d6a575b7d8b542aaf75))

### [4.3.3](https://github.com/annrie/Nuxtation/compare/v4.3.2...v4.3.3) (2026-07-14)


### ビルドシステムや外部依存に関する変更

* **deps:** ⬆️ nuxt 4.4.8・@nuxt/content 3.15.0・@nuxt/ui 4.9.0・docus 5.12.3ほかminor/patch一括更新 ([005f853](https://github.com/annrie/Nuxtation/commit/005f853ffc02373d8cbf56f3fd5ebab62831b404))

### [4.3.2](https://github.com/annrie/Nuxtation/compare/v4.3.0...v4.3.2) (2026-05-23)


### バグ修正

* support updated Nuxt dependencies ([68d990e](https://github.com/annrie/Nuxtation/commit/68d990e443bb9d8bdf429318449dff4f2a36a933))


### 機能の追加、変更、削除

* 🎉 upgrade dependencies, simplify header with AppHeaderLeft and enable styles auto-import ([8d9b38a](https://github.com/annrie/Nuxtation/commit/8d9b38ab9cc16b4f357243ec8ca476ea65b29ebc))
* 🎸 add SKILLS files ([d3b112f](https://github.com/annrie/Nuxtation/commit/d3b112f3cd50ae2ff25512a9dbea5ba43f715eee))


### ビルドプロセスまたは補助ツールの変更

* merge develop into main ([8029a59](https://github.com/annrie/Nuxtation/commit/8029a59169f47f0f302ef0e892d99050af38228e))
* merge develop into main ([19f8ff8](https://github.com/annrie/Nuxtation/commit/19f8ff81ea401a4863f4f149c41925d77e114232))
* sync develop with main ([7b99763](https://github.com/annrie/Nuxtation/commit/7b99763bebf93d7e5ed02ac7a5922efa562c6ca9))

## [4.3.0](https://github.com/annrie/Nuxtation/compare/v4.2.2...v4.3.0) (2026-03-20)

### [4.2.2](https://github.com/annrie/Nuxtation/compare/v4.2.1...v4.2.2) (2026-03-07)

### [4.2.1](https://github.com/annrie/Nuxtation/compare/v4.2.0...v4.2.1) (2026-03-03)


### ビルドプロセスまたは補助ツールの変更

* upgrade shiki & twoslash to v4, cleanup package resolutions and vite config ([81685c2](https://github.com/annrie/Nuxtation/commit/81685c21efe4ce312b2e373ebfedc5a50a7da946))

## [4.2.0](https://github.com/annrie/Nuxtation/compare/v4.1.1...v4.2.0) (2026-03-01)


### バグ修正

* adjust card image positioning in HomeCard ([2a544eb](https://github.com/annrie/Nuxtation/commit/2a544eb48d7d45ecd0f4ed24302d69d7e03a24d6))
* adjust image aspect ratios and layout for cards in nuxtation ([868ab65](https://github.com/annrie/Nuxtation/commit/868ab6545a8bf15053954d33b7061bf22b733b42))


### パフォーマンスの改善

* **build:** ⚡ ビルド高速化とtwoslash統合 ([a720c30](https://github.com/annrie/Nuxtation/commit/a720c3082e16ae57a9126dd2c16d155bc452c34c))


### 機能の追加、変更、削除

* **deps:** ⬆️ docus 5.5.0・@nuxt/content 3.11.2へアップデート、create-docsスキル追加 ([5f3319d](https://github.com/annrie/Nuxtation/commit/5f3319d73cf4166dc120ac96e6a95e62f2ab8e04))

### [4.1.1](https://github.com/annrie/Nuxtation/compare/v4.1.0...v4.1.1) (2026-02-01)


### バグ修正

* **pages:** 🐛 明示的なuseRoute/useRouterインポートを削除、サーバーミドルウェア修正 ([56322d3](https://github.com/annrie/Nuxtation/commit/56322d3ce3787c85255bfbdd835cfacfde7d8bc0))
* **perf,seo:** ⚡🐛 パフォーマンス改善、JSON-LD修正、header CSS最適化 ([bba58d6](https://github.com/annrie/Nuxtation/commit/bba58d6f1f8d84d550e031db9fc456ad5fce4e28))

## [4.1.0](https://github.com/annrie/Nuxtation/compare/v4.0.2...v4.1.0) (2026-01-24)

### [4.0.2](https://github.com/annrie/Nuxtation/compare/v4.0.1...v4.0.2) (2026-01-18)


### バグ修正

* ensure single root for content components ([bdb07c7](https://github.com/annrie/Nuxtation/commit/bdb07c70efd132ec0f931047daacf19459768e6a))

### [4.0.1](https://github.com/annrie/Nuxtation/compare/v3.0.2...v4.0.1) (2026-01-12)


### 機能の追加、変更、削除

* 🎉 Docus 5.3.1完全移行 - v4.0.0 ([0d63f3b](https://github.com/annrie/Nuxtation/commit/0d63f3b304cd8d5457d229c63176840f8111ea41))


### バグ修正

* /_vercel/speed-insights/*をprerender routesから削除 ([151a7e4](https://github.com/annrie/Nuxtation/commit/151a7e42909698673c5c6e9e672cb22f9cc45adc))


### ビルドプロセスまたは補助ツールの変更

* 📊 ページ訪問数の更新 ([2f0788c](https://github.com/annrie/Nuxtation/commit/2f0788c00e3a6a2e1f1c2a079c7c0a6facffe31d))

### [3.0.2](https://github.com/annrie/Nuxtation/compare/v3.0.1...v3.0.2) (2025-12-10)

### [3.0.1](https://github.com/annrie/Nuxtation/compare/v3.0.0...v3.0.1) (2025-08-19)

## [3.0.0](https://github.com/annrie/Nuxtation/compare/v2.8.4...v3.0.0) (2025-07-16)

### [2.8.4](https://github.com/annrie/Nuxtation/compare/v2.8.3...v2.8.4) (2025-07-16)


### 機能の追加、変更、削除

* 🎸 content v3 設定準備 ([b6fe64f](https://github.com/annrie/Nuxtation/commit/b6fe64f89a87972cf5621a71d91f3f0f74db33cc))

### [2.8.3](https://github.com/annrie/Nuxtation/compare/v2.8.2...v2.8.3) (2025-02-24)

### [2.8.2](https://github.com/annrie/Nuxtation/compare/v2.8.1...v2.8.2) (2025-01-27)

### [2.8.1](https://github.com/annrie/Nuxtation/compare/v2.8.0...v2.8.1) (2025-01-25)

## [2.8.0](https://github.com/annrie/Nuxtation/compare/v2.7.4...v2.8.0) (2024-12-26)

### [2.7.4](https://github.com/annrie/Nuxtation/compare/v2.7.3...v2.7.4) (2024-11-28)

### [2.7.3](https://github.com/annrie/Nuxtation/compare/v2.7.2...v2.7.3) (2024-11-23)

### [2.7.2](https://github.com/annrie/Nuxtation/compare/v2.7.1...v2.7.2) (2024-11-07)

### [2.7.1](https://github.com/annrie/Nuxtation/compare/v2.7.0...v2.7.1) (2024-11-06)

## [2.7.0](https://github.com/annrie/Nuxtation/compare/v2.6.1...v2.7.0) (2024-11-06)

### [2.6.1](https://github.com/annrie/Nuxtation/compare/v2.6.0...v2.6.1) (2024-11-05)

## [2.6.0](https://github.com/annrie/Nuxtation/compare/v2.5.6...v2.6.0) (2024-10-04)

### [2.5.6](https://github.com/annrie/Nuxtation/compare/v2.5.5...v2.5.6) (2024-04-06)


### ビルドプロセスまたは補助ツールの変更

* **package.json:** update devDependencies versions for eslint-config, @nuxt/devtools, @nuxt/eslint, @nuxtjs/color-mode, @types/node, and various [@unocss](https://github.com/unocss) packages ([5902557](https://github.com/annrie/Nuxtation/commit/590255708fd649f8d139760f9ab7c2f8345d8485))


### 機能の追加、変更、削除

* **nuxt.config.ts:** add allow rule to robots.txt to allow all bots to crawl the site ([2697959](https://github.com/annrie/Nuxtation/commit/2697959a74d0a1273e0c50e0440c7b49806e5f8c))


### バグ修正

* **kv:** update pageVisits count from 71 to 74 ([5fe672b](https://github.com/annrie/Nuxtation/commit/5fe672b653390fec5f1444fd570a889caec0e4eb))

### [2.5.5](https://github.com/annrie/Nuxtation/compare/v2.5.4...v2.5.5) (2024-03-22)


### ビルドプロセスまたは補助ツールの変更

* 🤖 Add eslint experimental config ([3b12363](https://github.com/annrie/Nuxtation/commit/3b123634b58f6f33fe2e7f8e1c20956e2ce68a8a))
* 🤖 add vite-imagetools and vite-plugin-vsharp ([65dde48](https://github.com/annrie/Nuxtation/commit/65dde48e6ad505e3c91656b9113df804aa1a4b44))

### [2.5.4](https://github.com/annrie/Nuxtation/compare/v2.5.3...v2.5.4) (2024-03-20)


### ビルドプロセスまたは補助ツールの変更

* 🤖 Update dependencies ([9133210](https://github.com/annrie/Nuxtation/commit/91332105336dcf4ae1937888fa0689e4164e9c70))
* 🤖 update nuxt to v3.11.1 ([28eea38](https://github.com/annrie/Nuxtation/commit/28eea38ec66f846a85e5e776948bab5c98761d15))

### [2.5.3](https://github.com/annrie/Nuxtation/compare/v2.5.2...v2.5.3) (2024-03-05)

### [2.5.2](https://github.com/annrie/Nuxtation/compare/v2.5.1...v2.5.2) (2024-02-23)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update nuxt to 3.10.3 and npm-check-updates ([552fa70](https://github.com/annrie/Nuxtation/commit/552fa706e9343aa0f3d24ecb19805388d889b405))

### [2.5.1](https://github.com/annrie/Nuxtation/compare/v2.5.0...v2.5.1) (2024-02-03)


### バグ修正

* 🐛 change preset to vercel ([4914794](https://github.com/annrie/Nuxtation/commit/4914794abd8a966f3b2c946c9d89706944869abc))

## [2.5.0](https://github.com/annrie/Nuxtation/compare/v2.4.5...v2.5.0) (2024-02-01)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update Nuxt and Vue to version 3.9.3 and 3.4.15 ([6e605c6](https://github.com/annrie/Nuxtation/commit/6e605c6980cbe2d375cc25037f6b4070bf315091))


### 機能の追加、変更、削除

* 🎸 update nuxt to v3.10.0 ([68b6944](https://github.com/annrie/Nuxtation/commit/68b6944e72d83348624758d9b995c0c9d4095d4c))

### [2.4.5](https://github.com/annrie/Nuxtation/compare/v2.4.4...v2.4.5) (2024-01-18)


### ビルドプロセスまたは補助ツールの変更

* 🤖 npm-check-updates ([3946966](https://github.com/annrie/Nuxtation/commit/394696667a3b05cd334b0ad9d80429e1209a7f7b))
* 🤖 remove shamefull ([18198c9](https://github.com/annrie/Nuxtation/commit/18198c93e123fe8bbc504b71764fe073b0cecf61))
* 🤖 update @nuxt/image to version 1.3.0 ([bb23998](https://github.com/annrie/Nuxtation/commit/bb239989b4d6ca5f6ef928a70f257c65629ef90e))
* 🤖 update Nuxt to v3.9.0 ([085e27b](https://github.com/annrie/Nuxtation/commit/085e27bb04a73128af43693c584dbf800e7c8da7))
* 🤖 update nuxt to v3.9.1 ([7bdb0f2](https://github.com/annrie/Nuxtation/commit/7bdb0f2a9343d58eb098b5b32fe5baede395ebaa))
* 🤖 依存関係のアップデート ([711cdda](https://github.com/annrie/Nuxtation/commit/711cdda2a5103f8d153efc8254e30013dcb9b0d0))

### [2.4.4](https://github.com/annrie/Nuxtation/compare/v2.4.3...v2.4.4) (2023-12-24)


### バグ修正

* 🐛 remove fireinds from components adn pages ([c1d3c8d](https://github.com/annrie/Nuxtation/commit/c1d3c8dd4ee1111596bbb624f7e691f666913ad4))


### コードスタイル

* 💄 npm-check-updates ([a413e33](https://github.com/annrie/Nuxtation/commit/a413e33e30f572d8623cb41b67effb7685e6c9ff))

### [2.4.3](https://github.com/annrie/Nuxtation/compare/v2.4.2...v2.4.3) (2023-11-06)


### ビルドプロセスまたは補助ツールの変更

* 🤖 npm-check-updates ([e6f7e8b](https://github.com/annrie/Nuxtation/commit/e6f7e8b71ff0f222b342cdb0448b7c1a3f988893))

### [2.4.2](https://github.com/annrie/Nuxtation/compare/v2.4.1...v2.4.2) (2023-10-27)


### コードスタイル

* 💄 [...slug].vue margin-top ([6868008](https://github.com/annrie/Nuxtation/commit/686800814affe27897ad2643030550653a0fb3d5))

### [2.4.1](https://github.com/annrie/Nuxtation/compare/v2.3.12...v2.4.1) (2023-10-27)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update Nuxt to v3.8.0 ann add Vercel KV ([785497a](https://github.com/annrie/Nuxtation/commit/785497af9bcc797969ecb1291e5406e7d7fd1f49))
* **release:** 🏹2.4.0 ([bc82718](https://github.com/annrie/Nuxtation/commit/bc8271892db0cbc3cf23acf65b9869582d85182b))

## [2.4.0](https://github.com/annrie/Nuxtation/compare/v2.3.12...v2.4.0) (2023-10-27)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update Nuxt to v3.8.0 ann add Vercel KV ([785497a](https://github.com/annrie/Nuxtation/commit/785497af9bcc797969ecb1291e5406e7d7fd1f49))

### [2.3.12](https://github.com/annrie/Nuxtation/compare/v2.3.11...v2.3.12) (2023-10-09)


### ビルドプロセスまたは補助ツールの変更

* 🤖 commented microCMS ([018dd88](https://github.com/annrie/Nuxtation/commit/018dd88d1a2102d7eff0fb04c65140d203dd137a))

### [2.3.11](https://github.com/annrie/Nuxtation/compare/v2.3.10...v2.3.11) (2023-10-02)

### [2.3.10](https://github.com/annrie/Nuxtation/compare/v2.3.9...v2.3.10) (2023-10-01)


### バグ修正

* 🐛 Adjustment of cms/[id].vue ([a7eddb4](https://github.com/annrie/Nuxtation/commit/a7eddb4aa0d70e117b76ba31aadede52f2afe49c))
* 🐛 nitro:hooks was commented on ([27b4ca4](https://github.com/annrie/Nuxtation/commit/27b4ca46b21c9499bc3cdb5d82175639fe5048b7))

### [2.3.9](https://github.com/annrie/Nuxtation/compare/v2.3.8...v2.3.9) (2023-10-01)

### [2.3.8](https://github.com/annrie/Nuxtation/compare/v2.3.7...v2.3.8) (2023-09-30)


### 機能の追加、変更、削除

* 🎸 Add detail page ([86eec5a](https://github.com/annrie/Nuxtation/commit/86eec5af80d691d82550d502b263f4501b9474a9))

### [2.3.7](https://github.com/annrie/Nuxtation/compare/v2.3.6...v2.3.7) (2023-09-30)


### バグ修正

* 🐛 Adjustment of breadcrumbs ([0b7c7a9](https://github.com/annrie/Nuxtation/commit/0b7c7a9ff172db8dafd8ff022e564348e34e0207))


### ビルドプロセスまたは補助ツールの変更

* 🤖 add target option to microCMS ([f71f4d1](https://github.com/annrie/Nuxtation/commit/f71f4d162c57d34e7056da50cc998f4ad1e02dd4))
* 🤖 update @nuxt/content to v2.8.5 ([79fe7f9](https://github.com/annrie/Nuxtation/commit/79fe7f976aa57e41fc0153d18a275cd102e1dee1))
* 🤖 update nuxt,content and uno.css ([5c47a55](https://github.com/annrie/Nuxtation/commit/5c47a5545bf282cdee5c1128c3f3da4927927245))

### [2.3.6](https://github.com/annrie/Nuxtation/compare/v2.3.5...v2.3.6) (2023-09-26)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update nuxt, @nuxt/content and unocss ([590d84b](https://github.com/annrie/Nuxtation/commit/590d84bd90bd68c3c13557085bfc5639b67309c8))
* 🤖 update unocss to v0.56.2 ([81fc39e](https://github.com/annrie/Nuxtation/commit/81fc39ee2f899fd74ca4fec04be2cc1207ae313b))

### [2.3.5](https://github.com/annrie/Nuxtation/compare/v2.3.4...v2.3.5) (2023-09-25)


### ビルドプロセスまたは補助ツールの変更

* 🤖 add nuxt.studio ([8c4efd7](https://github.com/annrie/Nuxtation/commit/8c4efd7aa7f291b785f412bff5134f34ac8a8a63))
* 🤖 Add provisional treatment for generate ([b944d42](https://github.com/annrie/Nuxtation/commit/b944d420db55c801ed4eac643ed6f57319151750))


### バグ修正

* 🐛 Eliminate 404 (Document not found!) ([4c20754](https://github.com/annrie/Nuxtation/commit/4c20754211f940cf391c0570ac62bb19af92548e))
* 🐛 Forgot to include breadcrumbs ([55835ea](https://github.com/annrie/Nuxtation/commit/55835ea7fecd88dacf584e6a15935176d0326361))
* 🐛 middlewareを元に戻した。scrollToTopが効いていない。 ([84385b0](https://github.com/annrie/Nuxtation/commit/84385b0e053caaf76386ccc4985b51e73294efe0))

### [2.3.4](https://github.com/annrie/Nuxtation/compare/v2.3.3...v2.3.4) (2023-09-14)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update to nuxt@3.7.3 ([d5c5f7d](https://github.com/annrie/Nuxtation/commit/d5c5f7d16b0509fb33ec7610ef1ae0610806e63c))

### [2.3.3](https://github.com/annrie/Nuxtation/compare/v2.3.2...v2.3.3) (2023-09-13)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update to nuxt@3.7.2 ([8221d25](https://github.com/annrie/Nuxtation/commit/8221d250b3a5bb9cb647484fde7fcea239b49276))


### バグ修正

* 🐛 :slotted(pre code) wordの区切りがなくなっていた。 ([9ea22dd](https://github.com/annrie/Nuxtation/commit/9ea22ddb81462b90d878e9ba9e2c0a97e4e77333))

### [2.3.2](https://github.com/annrie/Nuxtation/compare/v2.3.1...v2.3.2) (2023-09-13)

### [2.3.1](https://github.com/annrie/Nuxtation/compare/v2.4.0...v2.3.1) (2023-09-06)


### ビルドプロセスまたは補助ツールの変更

* 🤖 update to nuxt3@latest ([05e8525](https://github.com/annrie/Nuxtation/commit/05e8525210cdce8ebb694cf4dbee56e56744f4c0))


### バグ修正

* 🐛 Build-related procedures ([4f750cc](https://github.com/annrie/Nuxtation/commit/4f750cca94e1fa54c7a39ff11ad7426cff06f7e7))

## [2.4.0](https://github.com/annrie/Nuxtation/compare/v2.3.0...v2.4.0) (2023-09-05)


### 機能の追加、変更、削除

* 🎸 add cache control ([0f49014](https://github.com/annrie/Nuxtation/commit/0f49014b80e45da15cd71dac4feeccefc856aebe))


### ドキュメント

* ✏️ README.mdを現状に沿うように変更 ([81e02ea](https://github.com/annrie/Nuxtation/commit/81e02ead4610555d120c174fcfcff5ff334d78f3))


### バグ修正

* 🐛 'findSurround' was incorrectly specified ([d43eee2](https://github.com/annrie/Nuxtation/commit/d43eee2250428d2223399f5d0801aaa80269da75))
* 🐛 add "unstrage":"1.9.0" at "resolutions" section ([3573c1b](https://github.com/annrie/Nuxtation/commit/3573c1b69f877b48949a8f145386d15f2e4051c1))
* 🐛 add Tags on [number].vue ([5ca8d0c](https://github.com/annrie/Nuxtation/commit/5ca8d0c9f08ba6e725125e812ed62e0828cbdf7c))
* 🐛 for build failed ([86ee0fa](https://github.com/annrie/Nuxtation/commit/86ee0fa34b057c7dc9fd5f6c0ae920027617b8bc))
* 🐛 formatting error ([cfa71bf](https://github.com/annrie/Nuxtation/commit/cfa71bf55587ed0cc9183d8e078ed4b0c2f93546))
* 🐛 router:options:strict:false ([a9447fe](https://github.com/annrie/Nuxtation/commit/a9447feb2c598403fd11a5bc9cafa5f6e8149e5e))
* 🐛 title tag on <head> ([e659a1c](https://github.com/annrie/Nuxtation/commit/e659a1c25e810d0d8f084ae30bc2944d7128a0bf))
* 🐛 twitterCard value ([73e0ffd](https://github.com/annrie/Nuxtation/commit/73e0ffd1300f3cf42f6161041339c4bd4498583d))

## [2.3.0](https://github.com/annrie/Nuxtation/compare/v2.2.0...v2.3.0) (2023-08-14)

## [2.2.0](https://github.com/annrie/Nuxtation/compare/v2.1.0...v2.2.0) (2023-08-10)


### ビルドプロセスまたは補助ツールの変更

* 🤖 correct settings.json ([41b940d](https://github.com/annrie/Nuxtation/commit/41b940d78f275367373c6161776d82828b07c8f6))
* 🤖 update nuxt ([4c8e38f](https://github.com/annrie/Nuxtation/commit/4c8e38f3d471dcb351f16976c5cdf030900907cc))
* 🤖 update to nuxt@3.6 ([e183e55](https://github.com/annrie/Nuxtation/commit/e183e55c59379ac76cfae38614e9b9ab62f3fad4))


### 機能の追加、変更、削除

* 🎸 imgix:baseURL変更 ([697584e](https://github.com/annrie/Nuxtation/commit/697584e79b399dcb50828f9bc050de7a8ef83c9a))
* 🎸 provider追加 ([aeaaa1b](https://github.com/annrie/Nuxtation/commit/aeaaa1bcb6c2b8aa759f96f6760569b84eb12c5a))
* 🎸 記事の体裁を調整。日付、social icon追加等。 ([b6bdeb6](https://github.com/annrie/Nuxtation/commit/b6bdeb6e20e4db8782aa16e5a00464aec17725fc))


### コードスタイル

* 💄 imgixのパラメータ修正 ([0fbc0da](https://github.com/annrie/Nuxtation/commit/0fbc0da5385babd33faa5d0225888712699625e9))
* 💄 記事のコード部分のlightモード時の表示調整 ([a6a1855](https://github.com/annrie/Nuxtation/commit/a6a18555a84c04e7ee091928891fbaca020f8ed2))


### バグ修正

* 🐛 for typescript ([bbb716b](https://github.com/annrie/Nuxtation/commit/bbb716b24541fc1da10bd0496f1d51fbf00f33db))
* 🐛 nuxt-pictureのイメージサイズの調整 ([a2fbcf3](https://github.com/annrie/Nuxtation/commit/a2fbcf31cf4d6935d88aa9fa5b4fdf4d0bee64f9))
* 🐛 omit remark plugins ([a7a9dda](https://github.com/annrie/Nuxtation/commit/a7a9ddad4391bced0b9905dd52ff53973a7ffa54))
* 🐛 pagination ([7a4a117](https://github.com/annrie/Nuxtation/commit/7a4a1177b04efdb915ba377f5e3bd3e1e6af4d2d))
* 🐛 typescript ([ecbe950](https://github.com/annrie/Nuxtation/commit/ecbe95079112329b651b9aca3e877e740e1da257))
* 🐛 余計なnull判定を削除 ([5aac3cc](https://github.com/annrie/Nuxtation/commit/5aac3cc5f78111d52d9e4ebda0887037f545b711))

## [2.1.0](https://github.com/annrie/Nuxtation/compare/v2.0.5...v2.1.0) (2023-06-28)


### ドキュメント

* ✏️ fix typos ([672912b](https://github.com/annrie/Nuxtation/commit/672912b06bf8da86fbf53c4b051b44f23361e3fe))


### ビルドシステムや外部依存に関する変更

* 🔨 update Nuxt to v3.4.1 ([75a0df9](https://github.com/annrie/Nuxtation/commit/75a0df9c5174f85a27f81db9dd796239c933c952))


### バグ修正

* 🐛 change twitter card to .png ([1ecbea2](https://github.com/annrie/Nuxtation/commit/1ecbea2031488c8e86a3e9363b59d69b674f55c6))
* 🐛 sitemap url ([76130fd](https://github.com/annrie/Nuxtation/commit/76130fdd839812208798dc5fabec3b7fce09344a))


### ビルドプロセスまたは補助ツールの変更

* 🤖 modifier settings.json ([f20d269](https://github.com/annrie/Nuxtation/commit/f20d269947de7e0c0642da27994fe6d84077e02d))
* 🤖 update devDependencies ([8d24532](https://github.com/annrie/Nuxtation/commit/8d24532bdf0e76bdcb855c962697837a01b0b71a))
* 🤖 update devtools ([0a938a6](https://github.com/annrie/Nuxtation/commit/0a938a6a9587d72eeb223c6fb93856849aa3d075))
* 🤖 update nuxt ([61d72ea](https://github.com/annrie/Nuxtation/commit/61d72ea1b451ca6089037bbf74dd7e5eb1a2de23))
* 🤖 update nuxt and @nuxt/image-edge ([1242f43](https://github.com/annrie/Nuxtation/commit/1242f43906fd8e5239b92d705ed0c539074490e5))
* 🤖 update nuxt to v3.3.1 ([3cdbc54](https://github.com/annrie/Nuxtation/commit/3cdbc545cfd4ff07b8c02385b05d154672cdcc07))
* 🤖 vscode themeの調整 ([5db348e](https://github.com/annrie/Nuxtation/commit/5db348e77dc40a26d953d44e06079acca2ab11b3))


### 機能の追加、変更、削除

* 🎸 add breadcrumbs ([ad924c4](https://github.com/annrie/Nuxtation/commit/ad924c417080dc7bbe3f988370fa8a9985cd867c))
* 🎸 Auto Deploy Stop Script ([6f8ad75](https://github.com/annrie/Nuxtation/commit/6f8ad75df07e71e4aa7b6c4c7ec34e03a32e0b9b))
* 🎸 Complete vercel configuration ([2d03995](https://github.com/annrie/Nuxtation/commit/2d0399570daa00c0fa5911d16bb219308571f253))

### [2.0.5](https://github.com/annrie/Nuxtation/compare/v2.0.4...v2.0.5) (2023-02-28)


### 機能の追加、変更、削除

* 🎸 deploy to vercel ([ccc1812](https://github.com/annrie/Nuxtation/commit/ccc181223b5006d22ce143261779158fc964e8c7))
* 🎸 deploy先をvercelに ([2305254](https://github.com/annrie/Nuxtation/commit/2305254f363f5c13cc59b8a2b996e66252aed2e3))


### ビルドプロセスまたは補助ツールの変更

* 🤖 add `yarn vercel` script ([ab7e1c5](https://github.com/annrie/Nuxtation/commit/ab7e1c5e286d5a442575294055133f4020ce010b))


### CI関連

* 🎡 twitter cardの修正 ([6a5a712](https://github.com/annrie/Nuxtation/commit/6a5a712b4aa20737bba57ea1ca2e9f8f564a86a3))

### [2.0.4](https://github.com/annrie/Nuxtation/compare/v2.0.3...v2.0.4) (2023-02-23)


### ドキュメント

* ✏️ git commentの修正 ([d870d77](https://github.com/annrie/Nuxtation/commit/d870d770f9ce703d9755d4500c6385992c920aa8))
