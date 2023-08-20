import {defineNuxtConfig} from 'nuxt/config'
import { NavigationGuard } from 'vue-router';
import { pwaVite } from './config/pwa';
import { appDescription } from './constants/index';
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
 // Twitter埋め込みで'Hydration node mismatch'エラーが出るため
 ssr: process.env.NODE_ENV !== "development",

 typescript: {
   shim:true
 },

 vue: {
   defineModel: true,
   propsDestructure: true
 },

 // devServer: {
 //   host:'0',
 // },
 // serverMiddleware: {
 //   '/_ipx': '@/server/middleware/ipx.js'
 // },
 // runtimeConfig: {
 //   apiSecret: '123',
 //   public: {
 //     apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
 //   }
 // },
 app: {
   pageTransition: { name: 'page', mode: 'out-in' },
   layoutTransition: { name: 'fade-layout', mode: 'in-out' },
 },

 pwa: {
   workbox: {
     enabled: true,
   }
 },

 components: {
   global: true,
   dirs: ['~/components'],
   Sitemap: 'https://nuxtation.vercel.app/sitemap.xml'
 },

 modules: [
   '@vueuse/nuxt',
   '@unocss/nuxt',
   'nuxt-icon',
   '@nuxt/content',
   '@nuxt/image',
   '@pinia/nuxt',
   '@nuxtjs/color-mode',
   'unplugin-icons/nuxt',
   '@kevinmarrec/nuxt-pwa',
   'nuxt-pwa-public-manifest',
   '@nuxtjs/robots',
   '@nuxt/devtools',
   'nuxt-typed-router',
   '@vite-pwa/nuxt',
    ],

 content: {
  documentDriven: false,
   watch: {
     ws: {
       port: 4000,
       showURL: true
     }
   },
  highlight: {
       // theme:'dark-plus',
       theme: {
        // Default theme (same as single string)
        default: 'monokai',
        // Theme used if `html.dark`
        dark: 'github-dark',
       },
       preload: [
         'bash',
         'javascript',
         'vue'
       ],
},
 markdown: {
     toc: {
       depth: 5,
       searchDepth: 5,
     },
     locales: ['ja', 'en'],
     defaultLocale: 'ja',
   // https://content.nuxtjs.org/api/configuration
      // Object syntax can be used to override default options
      // Array syntax can be used to add plugins
     rehypePlugins: [
  //      'rehype-figure'
       [
           'rehype-external-links',
           {
               target: '_blank',
               rel: 'noopener noreferer'
           }
       ]
     ]
   }
 },

 unocss: {
   uno: true,
   icons: true,
   attributify: true,
   components: false,
   shortcuts: ['btn', 'w-full px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
   rules: [],
 },

 experimental: {
//    restoreState: true,
   payloadExtraction: true,
   viewTransition: true,
   inlineSSRStyles: true,
   renderJsonPayloads: true,
   typedPages: true,
 },

 css: [
   '@unocss/reset/tailwind.css',
   // '~/assets/styles/scss/global.scss',
   // windi preflight
   // 'virtual:windi-base.css',
   // your stylesheets which overrides the preflight
     // '~/assets/styles/less/main.less',
   '@/assets/styles/scss/main.scss',

   // windi extras
   // 'virtual:windi-components.css',
   // 'virtual:windi-utilities.css',
   //     '@/assets/styles/contact.css',
   '@/node_modules/lite-youtube-embed/src/lite-yt-embed.css',
 ],

 image: {
   inject: true,
   screen: {
     sm: 320,
     md: 640,
     tb: 768,
     lg: 1024,
     xl: 1280,
     xxl: 1536,
     '2xl': 1536
   },
   imgix: {
     baseURL: 'https://nuxtation.imgix.net/'
   },
   domains: [
     'nuxtation.vercel.app'
   ],
//     alias: {
//       imgix: 'https://nuxtation.imgix.net/'
//     },
   // cloudinary: {
   //   baseURL: 'https://res.cloudinary.com/dvdv07wjt/image/fetch/',
   // },

  presets: {
     blog: {
       modifiers: {
         format: 'avif,webp,',
         fit: 'cover',
         quality: '80',
       },
     },
   },
 },

 colorMode: {
   classSuffix: '',
   preference: 'system',
   fallback: 'dark',
 },

 sourcemap: {
   "server": false,
   "client": true,
 },

 robots: {
   UserAgent: '*',
   Disallow: '',
   Allow: '/',
   Allow: '/api/og/*'
 },

 nitro: {
  esbuild: {
    options: {
      target: 'esnext',
    },
  },
  storage: {
     data: { driver: 'vercelKV'}
   },
   prerender: {
//      crawlLinks: true,
//      routes: [ '/sitemap.xml', '/robots.txt'],
     routes: ['/','/blog','/friends','/cat', '/sitemap.xml', '/robots.txt'],
//      ignore: ['/api']
   },
   future: {
    nativeSWR: true,
    },
 },

 // compressPublicAssets: {
 //   brotli: true
 // },
 preset: 'vercel_edge',
//  routeRules: {
//       "/**": {
//       swr: true,
//     },
//       "/**": {
//       static: true,
//     },
//   "/blog/**": {
//       swr: true,
//       // or
//       //cache: {
//        // maxAge: 60 * 60
//       //}
//     },
//      "/blog/**": {
//       static: true,
//     },
//    "/friends/**": {
//       swr: true,
//     },
//     "/friends/**": {
//       static: true,
//     },
//     "/cat/**": {
//       swr: false,
//     },
//     "/cat/**": {
//       static: true,
//     },
//   '/assets/**': { headers: { 'cache-control': 's-maxage=0' } },
//    // all routes will be background revalidated (ISR) at most every 60 seconds
//    '/**': { isr: 60 },
//    // this page will be generated on demand and cached permanently
//   '/static': { isr: true }
//  },

 router: {
   options: {
     strict: true
   }
 },

 build: {
   transpile: ['lite-youtube'],
 },

 vite: {
   vue: {
     script: {
       defineModel: true,
       propsDestructure: true
     }
   },
  css: {
    preprocessorOptions: {
      charset: false,
      scss: {
        additionalData: `@import "@/assets/styles/scss/global.scss";`,
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
    }
  },
},

 vue: {
     compilerOptions: {
      "types": ["vite-plugin-pages/client"],
       isCustomElement: tag => ['lite-youtube'].includes(tag),
     }
   },

 pwaVite,

 devtools: {
   // Enable devtools (default: true)
   enabled: true,

  timeline: {
   enabled: true,
   // VS Code Server options
   // vscode: {},
   // ...other options
    },
  },

 plugins: ['~/plugins/vueapperrorhandler.ts', '~/plugins/format-date.ts', '~/plugins/utils.ts', '~/plugins/youtube.client.ts']
})
