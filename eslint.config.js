// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

const configs = nuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
      ignores: [
        '.github/copilot-instructions.md',
        '.vscode/**',
        'COMPONENT_PATTERNS.md',
        'DESIGN_TOKENS.md',
        'content/**/*.md',
        'public/html/**',
        'public/sw.js',
        // 過去の設計書・計画書。コード片は断片なので lint しない
        'tasks/**',
        'templates/**',
      ],
      rules: {
        'node/prefer-global/buffer': 'off',
        'node/prefer-global/process': 'off',
        'no-console': 'warn',
        'style/no-tabs': 'off',
        '@stylistic/no-tabs': 'off',
      },
    },
  ),
  {
    rules: {
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'no-console': 'warn',
      'style/no-tabs': 'off',
      '@stylistic/no-tabs': 'off',
    },
  },
  {
    // CLI スクリプトは標準出力に結果を出すのが仕事なので console.log を許す
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // overrides は経緯のコメントと一緒に手で並べている。docustation・private-nuxtation とも
    // 同じ並びなので、アルファベット順に並べ替えない
    files: ['pnpm-workspace.yaml'],
    rules: {
      'yaml/sort-keys': 'off',
    },
  },
)

// flat config の解決後に 'unicorn/'、'vue/' および 'unocss/' 関連のルールを動的に削除する
export default configs.then((resolved) => {
  return resolved.map((config) => {
    if (config.rules) {
      const cleanedRules = { ...config.rules }
      for (const ruleName of Object.keys(cleanedRules)) {
        if (ruleName.startsWith('unicorn/') || ruleName.startsWith('vue/') || ruleName.startsWith('unocss/')) {
          delete cleanedRules[ruleName]
        }
      }
      return { ...config, rules: cleanedRules }
    }
    return config
  })
})
