import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true, // enable stylistic formatting rules
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  vue: true,
  jsonc: false,
  yml: false,
})
import {
  comments,
  ignores,
  imports,
  javascript,
  javascriptStylistic,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  typescript,
  typescriptStylistic,
  unicorn,
  vue,
  yml,
} from '@antfu/eslint-config'

export default [
  ...ignores,
  ...javascript(),
  ...comments,
  ...node,
  ...jsdoc,
  ...imports,
  ...unicorn,
  ...javascriptStylistic,

  ...typescript(),
  ...typescriptStylistic,

  ...vue(),
  ...jsonc,
  ...yml,
  ...markdown(),
]
