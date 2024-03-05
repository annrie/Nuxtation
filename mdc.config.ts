// mdc.config.ts
import { defineConfig } from '@nuxtjs/mdc/config'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { transformerNotationDiff } from 'shikiji-transformers'

export default defineConfig({
  // rehypePlugins: [
  //   rehypeDocument,
  //   rehypeForma,
	// () => {
  //      // custom inline plugins
  //   }
  // ],

  // remarkPlugins: [
  //   remarkRehype,
  //   // ...
  // ]

  // highlight: async (code, lang) => {
  //   // custom highlight function
  // },

  // or configure as an option with the default highlighter
  // highlight: {
  //   shikiji: {
  //     transformers: [
  //       transformerNotationDiff(),
  //     ]
  //   }
  // }
})
