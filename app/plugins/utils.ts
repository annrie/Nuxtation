'use strict'

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      getAsset: (file?: string, relativePath?: string) => {
        if (!file) {
          return
        }

        // Get image from the `assets` folder.
        // @ts-expect-error Vite 5 で `import.meta.globEager` は廃止された(型にも無い)。呼ぶと実行時に TypeError になる既存の不具合で、
        // 挙動を変えないためここでは直さない(`import.meta.glob(..., { eager: true })` への置き換えが必要)。
        const images = import.meta.globEager('/assets/images/*.{jpg,png,svg}')
        const image = images[`/assets/images/${file}`]
        if (image !== undefined) {
          return image.default
        }

        // eslint-disable-next-line no-console -- 既存のログ出力。挙動を変えないため残している
        console.log(`${file} doesn't exist locally!`)

        if (!relativePath) {
          return
        }

        // Access the API_BASE_URL variable from the Nuxt config file.
        const config = useRuntimeConfig()
        const apiBaseUrl = config.API_BASE_URL

        // Get the image from the remote API.
        const array = relativePath.split('/')
        array.pop()
        const path = array.join('/')
        return `${apiBaseUrl}/${path}/${file}`
      },
    },
  }
})
