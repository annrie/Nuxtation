# Nuxtation 

> ポートフォリオ用リポジトリ　THX [debs-obrien](https://github.com/debs-obrien) and [miracleonyenma](https://github.com/miracleonyenma/content-v2-blog)

![nuxtation](https://user-images.githubusercontent.com/5172584/219685899-f21d7608-2cd0-4fe1-872f-f25822ae2551.png)

旧オリジナル"Nuxtation"から**Nuxt3**仕様に全面的に作り直してポートフォリオ用に再公開しました。

諸々最新環境で動くようにはしています。

## セットアップ

テンプレートを手動でセットアップするには、まず Git でダウンロードします。

```bash
 git clone git@github.com:annrie/Nuxtation.git projectname
 cd projectname
```

## インストール

その後、コマンドラインでフォルダを開き、必要な依存関係をインストールします。 npm も使えますが、yarn2 を使用しています。

```bash
yarn set version berry #  Setup of yarn2
echo "nodeLinker: node-modules" > .yarnrc.yml
yarn install
```

最後に、 `yarn dev` を実行して サーバーを立ち上げます。

```bash
http://localhost:3000
```

## Nuxt DevToolsを有効化
Nuxt DevToolsが提供されました。

```bash
npx nuxi@latest devtools enable
```

## ライセンス

[MIT](https://github.com/annrie/Vuedation/main/LICENSE)
Copyright &copy; 2020-present, Annrie
