# CLAUDE

Claude エージェントと協働する際の注意点をまとめています。

**重要**: 基本的な依頼・レビューの流れは必ず **`AGENTS.md`** を参照してください。このファイルには以下の重要な情報が含まれています:
- プロジェクト構成（pnpmワークスペース、Docus 5.2.0）
- 技術スタック（Nuxt Content API、@nuxt/ui、@nuxt/icon）
- 基本的な作業の流れとガイドライン
- 詳細な作業ログと学習内容

## コミットメッセージ規約

コミット時は `.claude/skills/commit-message/SKILL.md` のルールに従ってください。

- **形式**: `<type>(<scope>): <emoji> <subject>`
- **タイプ**: feat, fix, refactor, perf, docs, chore, etc.
- **絵文字**: ✨(feat), 🐛(fix), ♻️(refactor), 🏹(release)
- **Breaking Change**: `feat!:` のように `!` を付与

## Claude固有の注意事項

- プロンプトには目的・入力・期待出力・検証方法をセットで記載し、再実行時の再現性を確保します。
- 差分は GitHub 上でレビューできる粒度に保ち、生成内容の要約や検証結果を共有します。
- 生成したコード／テキストは必ず人間がレビューし、`pnpm lint` や `pnpm build` などの検証コマンドを通してから反映します。

## CSS フレームワーク - Tailwind CSS（Docus統合）

### 現在の構成
このプロジェクトでは **Docus 5.2.0 を採用** しており、Tailwind CSS が標準で統合されています。

**技術スタック**:
- **Tailwind CSS**: Docus 5.2.0に統合済み
- **カスタムカラーパレット**: `docs/assets/css/tailwind.css` で管理
- **@nuxt/ui 4.0.1**: Docusの依存関係として利用可能
- **@nuxt/icon 2.0.0**: アイコン管理

**今後のスタイル実装は Tailwind CSS を使用してください。**

### Tailwind CSS スタイル適用の注意点
- `@apply` ディレクティブは SCSS ファイルや `<style>` タグ内で利用可能です
- レスポンシブ指定には `@apply md:text-lg lg:text-xl` のように Tailwind のバリアント（md:, lg: など）を使用すると、`@media` クエリを直接記述するより簡潔です
- `.prose` 由来の要素には Typography プラグインが `padding` や `line-height` を設定するため、`:deep(.prose …)` で明示的に上書きするか `not-prose` で除外します
- CSS Grid の既定値は `align-items: stretch`。画像と同じ行のブロックが伸びる場合は `self-start` / `items-start` を併記して高さを固定します
- `dark:` バリアントはライト用ユーティリティより前に置く。順序を誤ると最適化時に削除され、ライト側のみ反映されます
- カスタムカラー（tailwind.css で定義）は `bg-primary-head`, `bg-sf-500` のように直接指定できます

詳細な技術情報と作業ログは **`AGENTS.md`** を参照してください。
