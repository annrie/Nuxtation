# OGP 取得をビルド時解決へ移行する設計

- 日付: 2026-08-04
- 対象: nuxtation / docustation / private-nuxtation
- 起点: 2026-08-04 の undici 脆弱性対応中に `server/api/ogp.ts` の SSRF 面を発見

## 背景と問題

3リポジトリは `server/api/ogp.ts` を持ち、`?url=` クエリで渡された URL を
open-graph-scraper にそのまま渡している。宛先の検証は「空でないこと」だけで、
許可リストもプライベートIPの拒否もない。

3リポとも SSR で本番稼働している。

- nuxtation: `nuxt.config.ts` の `preset: 'vercel'`（Node ランタイム）。
  `vercel.json` が `github.enabled: true` なので main への push で本番自動デプロイ
- docustation / private-nuxtation: Dockerfile が `pnpm run build`（generate ではない）
  で SSR ビルドし `node server/index.mjs` で起動

したがって公開エンドポイントからサーバーサイドの任意ホストへの HTTP リクエストを
誘発できる。open-graph-scraper は `followRedirect: true` がデフォルトなので、
初回URLだけ検証しても追従先で抜けられる形でもある。

副次的な問題として、取得先のレスポンスヘッダが第三者の制御下に入るため、undici 側の
脆弱性の踏み台にもなる。2026-08-04 の undici Information Exposure（不正な
`Cache-Control` で処理が中断される）を「ビルド専用だから受容」にできなかったのは
この経路があったため。

## 決定的な観測

`/api/ogp` を呼ぶのは `app/components/content/LinkCard.vue` だけで、URL は自サイトの
markdown に書かれた `::link-card{propsUrl="..."}` から来る。実測した使用箇所は
3リポとも同一で、`content/blog/06.nuxt-link-card-implementation.md` の3箇所のみ。

```
::link-card{propsUrl="https://qiita.com/kurokawa516/items/80ea1a0e3a3f51a44f2b"}
::link-card{propsUrl="https://www.mt-work.com/blog/post-5/"}
::link-card{propsUrl="https://exanple.com"}
```

記法は `::link-card{propsUrl="..."}` の1種類だけで揺れはない（3リポ×3箇所＝9件を確認）。

つまり正当な入力はビルド時に確定する閉じた集合であり、実行時に任意URLを受け付ける
必要が最初から無い。宛先検証を足すのではなく、実行時エンドポイントそのものを無くす。

## 方針

OGP をビルド前に解決してコミット済み JSON に保存し、実行時エンドポイントを廃止する。

| 判断 | 選んだ理由 |
|---|---|
| 実行時エンドポイントを廃止 | 検証を足すより攻撃面をゼロにする方が確実 |
| コミット済JSON＋手動更新 | ビルドが外部サイトの生死に依存しない。取得内容が git でレビューできる |
| JSON は静的 import | SSR でもクライアント遷移でも往復ゼロ。ローディング状態自体が消える |
| 失敗時は素のリンク | リンク先には到達できるので情報が失われない |

## 構成

### 追加

| ファイル | 役割 |
|---|---|
| `scripts/refresh-ogp.mjs` | content を走査して OGP を取得し JSON を出力。`pnpm ogp:refresh` |
| `app/data/ogp-cache.json` | 取得結果。git にコミットする |

### 削除

`server/api/ogp.ts`

### 変更

- `app/components/content/LinkCard.vue`
- `package.json`: `ogp:refresh` スクリプト追加、`open-graph-scraper` を
  `dependencies` から `devDependencies` へ移動
- `content/blog/06.nuxt-link-card-implementation.md`: `exanple.com` → `example.com`

## スクリプトの動作

1. `content/**/*.md` を glob
2. `::link-card{propsUrl="..."}` から URL を抽出し重複を除去
3. 予約ドメイン（後述）をスキップ
4. 残りを open-graph-scraper で取得
5. URL をキーに JSON を出力

保存するフィールドは4つに限定する。OGS の生レスポンスは大きく、内部構造の変化に
引きずられたくないため。

```json
{
  "https://qiita.com/kurokawa516/items/80ea1a0e3a3f51a44f2b": {
    "ogTitle": "...",
    "ogDescription": "...",
    "ogImage": "https://...",
    "ogUrl": "https://..."
  }
}
```

`ogImage` は OGS の `ogImage[0].url` を文字列に平坦化して持つ。

### 予約ドメインのスキップ

RFC 2606 / 6761 で例示・ドキュメント用に予約されているものは取得を試みない。

- TLD: `.test` / `.example` / `.invalid` / `.localhost`
- ドメイン: `example.com` / `example.net` / `example.org` およびそのサブドメイン

`example.com` は IANA の最小ページで OG タグを持たないため、取得しても空のカードに
なるだけ。失敗ではなく除外として扱い、**出力では「除外」と「失敗」を別の枠に分けて
表示する**。失敗一覧に混ざると本物の障害が埋もれるため。

これはセキュリティ制御ではなく「取りに行く意味がない先」の定義である。SSRF 対策は
エンドポイント廃止そのものが担う。

### 失敗の扱い

- **既存エントリを消さない。** 取得失敗時は JSON にある前回の値を残す。一時的な障害で
  取得済みの良いデータを失わないため
- **全件失敗したら exit 1。** ネットワーク断のときに空の JSON をコミットする事故を防ぐ
- 一部失敗は警告を出して exit 0

## コンポーネントの動作

`LinkCard.vue` は `ogp-cache.json` を静的 import し `propsUrl` で引く。
`useLazyFetch` / `onMounted` / `isDevRun` の分岐はすべて削除する。

現状は dev で `onMounted`、本番で `useLazyFetch` という非対称な構造になっており、
private-nuxtation の同ファイルには「dev の非ブロッキング化と SSG 出力の両立を狙った
暫定策。後日 useAsyncData 等へ統一を検討する」というコメントが残っている。
今回の変更はこの暫定策を解消する。

**キーが JSON に存在すればカードを描画する。** その中で `ogImage` が空の場合は、現行どおり
`/img/ogp.png` にフォールバックする（既存の見た目を変えない）。`ogTitle` が空なら markdown の
`title`、それも無ければ空文字。既存の文字数制限（タイトル40字・説明120字）はそのまま維持する。

**キーが存在しない場合のみ**カードを描画せず、素のリンクにフォールバックする。
「取得に失敗した」と「予約ドメインで除外した」は実行時には区別しない。どちらも素のリンクになる。

```
<NuxtLink :to="propsUrl" target="_blank" rel="noopener noreferrer">
```

表示文字列は markdown の `title` があればそれ、無ければ URL そのもの。
ローディング状態は存在しなくなる。

## テスト

- **単体テスト**: URL 抽出ロジック（記法パターン・複数URL・重複除去・予約ドメイン判定）を
  private-nuxtation に置く。vitest の config と `test` スクリプトが揃っているのが
  3リポ中ここだけのため。nuxtation / docustation に通すには vitest 設定の新規追加が
  必要で、今回の目的から外れるので見送る
- **回帰防止**: 3リポ共通で playwright smoke に `/api/ogp` が 404 を返すアサーションを
  追加する。エンドポイント復活を検知するため
- **ビルド検証**: nuxtation はこちらで実行。docustation / private-nuxtation は運用どおり
  ユーザーが実行する
- **効果測定**: nuxtation の `.vercel/output/functions/__fallback.func/package.json` から
  undici の宣言が消えることを実測する（変更前は `"undici": "7.29.0"` が入っている）

## 展開順

nuxtation → docustation → private-nuxtation。

nuxtation を先頭にするのは、3リポ中で唯一 main への push で Vercel に自動デプロイされ、
検証が一番効くため。

`LinkCard.vue` は3リポで差分がある（docustation は10行差、private-nuxtation は220行差。
大半がコメントと整形）。機械的コピーはせず、各リポの既存スタイルとコメントを保ったまま
手で編集する。

`server/api/ogp.ts` も private-nuxtation だけ `console.log` の有無と
`result?.ogError` / `result?.error` の差があるが、削除するので影響しない。

## スコープ外

- ladybugs / nuxt-landing。`LinkCard` と `/api/ogp` を持たない
- 記事本文の内容変更。typo 修正 `exanple.com` → `example.com` のみ行う
- カードが数十件規模に増えた場合の JSON 分割。現状3件なので不要（増えたら記事単位の
  分割を検討する）
