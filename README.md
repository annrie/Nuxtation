# Nuxtation

> Docus 5.3.1ベースのブログサイト - THX [Docus](https://docus.com/))

![nuxtation](https://user-images.githubusercontent.com/5172584/219685899-f21d7608-2cd0-4fe1-872f-f25822ae2551.png)

旧オリジナル"[Nuxtation](https://github.com/annrie/Nuxtation-nuxt2-)"から**Nuxt 4 + Docus 5.3.1**仕様に全面的に作り直したブログサイトです。

## 技術スタック

- **Framework**: Nuxt 4.2.1
- **SSG**: Docus 5.3.1
- **Content**: @nuxt/content 3.3.1
- **CSS**: Tailwind CSS v4
- **Deployment**: Vercel
- **Analytics**: Vercel Speed Insights

## 主な機能

- ✨ Docus標準構成によるブログ機能
- 🎨 Tailwind CSS v4完全対応
- 📱 レスポンシブデザイン + ダークモード
- 🐱 Cat API統合（Masonryレイアウト）
- 🔍 SEO最適化（schema.org対応）
- ⚡ Vercel Speed Insights統合

## セットアップ

テンプレートを手動でセットアップするには、まず Git でダウンロードします。

```bash
git clone git@github.com:annrie/Nuxtation.git projectname
cd projectname
```

## インストール

依存関係をインストールします（pnpm推奨）。

```bash
pnpm install
```

開発サーバーを起動します。

```bash
pnpm dev
```

ブラウザで以下にアクセス:

```bash
http://localhost:3000
```

## ビルド

静的サイトを生成します。

```bash
pnpm generate
```

## ライセンス

[MIT](https://github.com/annrie/Nuxtation/blob/main/LICENSE)
Copyright &copy; 2020-present, Annrie
