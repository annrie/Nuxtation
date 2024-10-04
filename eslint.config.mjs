// eslint.config.js
// npx eslint-flat-config-viewer
import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import { transpileModule } from 'typescript'

const compat = new FlatCompat()

export default antfu({
  unocss: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // Type of the project. 'lib' for libraries, the default is 'app'
  type: 'lib',

  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
    semi: true,
  },

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '**/fixtures',
    '**/*.md',
    // ...globs
  ],
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier',

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  },
},
  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {
      "typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off"
    },
  },
  {
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
)
