export default {
  '**/*.ts?(x)': () => 'nuxi prepare',
  // css/scss も含める（antfu eslint の formatters:true が内蔵 prettier で整形）。
  // 旧 'app/**/*': 'prettier --write' 行は削除した。理由:
  //   1) eslint --fix と二重整形で冗長
  //   2) プロジェクト非依存のグローバル prettier(1.19.1) に依存し不安定
  //   3) [slug].vue の角括弧を prettier が glob 誤認しコミット全体を落としていた
  'app/**/*.{js,jsx,ts,tsx,vue,css,scss}': 'eslint --fix --no-ignore --max-warnings=0',
  // content の md は MDC 対応の専用整形（prettier/markdownlint は MDC を壊すため使わない）。
  // スクリプトが「変化しなくなるまで」内部で収束させるので1回実行で安定する。
  'content/**/*.md': 'node scripts/format-content-md.mjs',
}
