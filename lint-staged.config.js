export default {
  '**/*.ts?(x)': () => 'nuxi prepare',
  // css/scss も含める（antfu eslint の formatters:true が内蔵 prettier で整形）。
  // 旧 'app/**/*': 'prettier --write' 行は削除した。理由:
  //   1) eslint --fix と二重整形で冗長
  //   2) プロジェクト非依存のグローバル prettier(1.19.1) に依存し不安定
  //   3) [slug].vue の角括弧を prettier が glob 誤認しコミット全体を落としていた
  'app/**/*.{js,jsx,ts,tsx,vue,css,scss}': 'eslint --fix --no-ignore --max-warnings=0',
  // 記事に link-card を足して `pnpm ogp:refresh` を忘れるとカードが静かに
  // ただのリンクへ劣化する。content/ を触ったコミットで検査する。
  // 変更ファイル名は渡さない（content/ 全体を走査して初めて欠落が判る）ので
  // 上の nuxi prepare と同じく関数形式にしている。
  //
  // **--staged が要る。** lint-staged は完全に未ステージのファイルまでは
  // 隠さないので、作業ツリーを読むと「refresh は実行したが ogp-cache.json を
  // add し忘れた」コミットが素通りする（実測で確認済み）。
  'content/**/*.md': () => 'pnpm check:ogp-cache --staged',
}
