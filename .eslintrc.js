{
  "extends": [
    "@nuxtjs/eslint-config-typescript",
    "@antfu",
    "@unocss"
  ],
  "rules": {
    "@unocss/blocklist": "warn"
  },
  const process = require('node:process')

  process.env.ESLINT_TSCONFIG = 'tsconfig.json'

  module.exports = {
    extends: '@antfu'
  }
}
