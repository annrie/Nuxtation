// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

const configs = nuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
      ignores: [
        '.entire/**',
        '.github/copilot-instructions.md',
        '.vscode/**',
        'COMPONENT_PATTERNS.md',
        'DESIGN_TOKENS.md',
        'content/**/*.md',
        'public/html/**',
        'public/sw.js',
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
