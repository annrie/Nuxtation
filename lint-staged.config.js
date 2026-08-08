export default {
  '**/*.ts?(x)': () => 'nuxi prepare',
  // css/scss も含める（antfu eslint の formatters:true が内蔵 prettier で整形）。
  // 旧 'app/**/*': 'prettier --write' 行は削除した。理由:
  //   1) eslint --fix と二重整形で冗長
  //   2) プロジェクト非依存のグローバル prettier(1.19.1) に依存し不安定
  //   3) [slug].vue の角括弧を prettier が glob 誤認しコミット全体を落としていた
  'app/**/*.{js,jsx,ts,tsx,vue,css,scss}': 'eslint --fix --no-ignore --max-warnings=0',
  // link-card の OGP キャッシュ検査はここに置かない。package.json の
  // simple-git-hooks（pre-commit）から直接呼んでいる。
  // **lint-staged の既定の diff-filter は ACMR で削除を含まないため、
  // ogp-cache.json を消すだけのコミットで検査が走らず素通りする**（実測）。
  // 対象の判定はスクリプト側の --if-relevant が D 込みで行う。
}
