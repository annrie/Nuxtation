export default {
  '**/*.ts?(x)': () => 'nuxi prepare',
  'app/**/*.{js,jsx,ts,tsx,vue}': 'eslint --fix --no-ignore --max-warnings=0',
  'app/**/*': 'prettier --write',
}
