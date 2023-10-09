import { SiteName, SiteDescription } from './logic/constants';
import { RuntimeConfig } from 'nuxt/schema';
// import { OgImage } from './.nuxt/components.d';
import {defineNuxtConfig} from 'nuxt/config'
import { NavigationGuard } from 'vue-router';
import { pwaVite } from './config/pwa';
import { appDescription } from './logic/index';
// https://nuxt.com/docs/api/configuration/nuxt-config
// import { BASE_URL, API_KEY } from process.env;
export default defineNuxtConfig({
 // Twitter埋め込みで'Hydration node mismatch'エラーが出るため
 ssr: process.env.NODE_ENV !== "development",
spaLoadingTemplate: true, // per default disabled since Nuxt 3.7

  telemetry:false,

// publicRuntimeConfig: {
//   baseURL: process.env.MICROCMS_SERVICE_DOMAIN,
//   apiKey: process.env.MICROCMS_API_KEY,
// },

 typescript: {
    tsConfig: {
      compilerOptions: {
        isolatedModules: false,
        useDefineForClassFields: false
      }
    },
   shim:true
 },

 devServer: {
   host: '',
 },
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

 OgImage: {
  // runtimeBrouwser: true,
  fonts: [
    'Noto+Sans:400,700',
    'Noto+Sans+JP:400,700',
    ],
  },

 modules: [
   '@vueuse/nuxt',
   '@unocss/nuxt',
   'nuxt-icon',
   '@nuxt/content',
   '@nuxt/image',
   '@nuxtseo/module',
   'nuxt-og-image',
   '@pinia/nuxt',
   '@nuxtjs/color-mode',
   'unplugin-icons/nuxt',
   '@nuxtjs/robots',
   '@nuxt/devtools',
   'nuxt-typed-router',
   '@vite-pwa/nuxt',
   'nuxt-og-image',
   'nuxt-link-checker',
   '@nuxtjs/critters',
  //  'nuxt-microcms-module',
   '@nuxthq/studio',
  ],
    // generate: {
    //  async routes () {
    //   const { $content } = require('@nuxt/content')
    //   const files = await $content().only(['path']).fetch()
    //   return files.map(file => file.path === '/index' ? '/' : file.path)
    // }
    // },


  //  microCMS: {
  //    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  //    apiKey: process.env.MICROCMS_API_KEY,
  //    target: 'server',
  //  },

    site: {
      identity: {
        type: 'person',
      },
    name: 'annrie',
    logo: '/icon.png',
    titleSeparator: '-',
    url: 'https://nuxtation.vercel.app',
    description: 'Nuxt, contentで構築したブログサイト',
    language: 'ja',
    twitter: '@muraie_jin',
    trailingSlash: true,
  },


 content: {
  // api: {
  //   baseURL: 'api/_content',
  // },
   experimental: {
     clientDB: true
   },
//   contentHead: false,
  documentDriven: true,
   watch: {
     ws: {
       port: 4000,
       showURL: true
     }
   },
  highlight: {
       // theme:'dark-plus',
      theme: {
        dark: true,
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
//         sepia: 'monokai'
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
   // https://content.nuxtjs.org/api/configuration
      // Object syntax can be used to override default options
      // Array syntax can be used to add plugins
     rehypePlugins: [
      //  'rehype-figure',
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

critters: {
  config: {
    preload: 'swap',
  }
  },

linkChecker: {
  // failOnError: false,
    enabled: false,
    excludeLinks: [
      'https://twitter.com/muraie_jin',
    ],
  },

 experimental: {
//    restoreState: true,
   payloadExtraction: false,
   viewTransition: true,
   inlineSSRStyles: true,
   renderJsonPayloads: true,
   typedPages: true,
   headNext: true,
   asyncContext: true,
   clientFallback: true,
   polyfillVueUseHead: false,
 },

 css: [
   '@unocss/reset/tailwind.css',
   '@/assets/styles/scss/main.scss',
   '@/node_modules/lite-youtube-embed/src/lite-yt-embed.css',
 ],

 image: {
   inject: true,
   screens: {
     'sm': 320,
     'md': 640,
     'tb': 768,
     'lg': 1024,
     'xl': 1280,
     'xxl': 1536,
     '2xl': 1536
   },
   provider: 'imgix',
   imgix: {
     baseURL: 'https://nuxtation.imgix.net/',
     modifiers: {
      effect: 'sharpen:100',
      quality: 'auto:best',
    },
   },
   domains: [
     'nuxtation.imgix.net',
   ],
    alias: {
      imgix: 'https://nuxtation.imgix.net/',
    },
   // cloudinary: {
   //   baseURL: 'https://res.cloudinary.com/dvdv07wjt/image/fetch/',
   // },

  presets: {
     cover: {
       modifiers: {
         format: 'avif, webp',
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
   "client": false,
 },

 robots: {
   UserAgent: '*',
   Disallow: '',
   Allow: '/',
   Allow: '/api/og/*'
 },
//  ssr: false,
// generate: {
//   routes: ['/blog'],
//   },
// routeRules: {
//         '/**': { prerender: true },
//         '/blog/**': { ssr: true },
//         '/friends/**': { ssr: true },
//         '/cat/**': { ssr: false },
//         '/cms/**': { ssr: false },
//     },
 preset: 'vercel_edge',

studio: {
  enabled: false,
  },

 nitro: {
//    preset: 'service-worker', // for generate
  esbuild: {
    options: {
      target: 'esnext',
    },
    plugins: [ '~/plugins/nitro.error.ts' ],
  },
  //  storage: {
  //    data: { driver: 'vercelKV'}
  //  },
  prerender: {
     crawlLinks: true,
     failOnError: false,
     routes: [ '/', '/sitemap.xml', '/robots.txt' ],
//      routes: [ '/sitemap.xml', '/robots.txt' ],
//      routes: [ '/','/blog','/friends','/cat','/sitemap.xml', '/robots.txt' ], // for generate
//      ignore: ['/blog', '/friends'],
   },
//    future: {
//     nativeSWR: true,
//     },
 },
    // hooks: {
    //     async "nitro:config"(nitroConfig) {
    //         if (nitroConfig.dev) {
    //             return;
    //         }
    //         nitroConfig.prerender.crawlLinks = false
    //         const limit = 10
    //         const client = createClient({
    //             serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
    //             apiKey: process.env.MICROCMS_API_KEY,
    //         })
    //         const data = await client.getList(
    //             {
    //                 endpoint: 'blogs',
    //                 queries: {
    //                     limit: 100,
    //                     fields: 'id'
    //                 }
    //             }
    //         )
    //         const totalCount = data.totalCount
    //         const perRequestCount = 50
    //         const reqCount = Math.ceil(totalCount / perRequestCount)
    //         const allPostData = []
    //         for (let i = 0; i < reqCount; i++) {
    //             const offset = i * perRequestCount
    //             const data = await client.getList(
    //                 {
    //                     endpoint: 'blogs',
    //                     queries: {
    //                         limit: perRequestCount,
    //                         offset: offset,
    //                         fields: 'id,tag'
    //                     }
    //                 })
    //             for (const elm of data.contents) {
    //                 allPostData.push(elm)
    //             }
    //         }
    //         // タグに紐づいている記事の数
    //         const tagCount: Record<string, number> = {}
    //         // 記事を繰り返す
    //         for (const elm of allPostData) {
    //             const slug = elm.id
    //             const tags = elm.tag
    //             // 記事の数をカウントアップ
    //             for (const tag of tags) {
    //                 if (tagCount[tag.id]) {
    //                     tagCount[tag.id]++
    //                 } else {
    //                     tagCount[tag.id] = 1
    //                 }
    //             }
    //             // 記事詳細をルートに加える
    //             nitroConfig.prerender.routes.push(`/${slug}`)
    //         }
    //         // ページ数をルートに加える
    //         const pageCount = Math.ceil(totalCount / limit)
    //         for (let p = 1; p < pageCount + 1; p++) {
    //             nitroConfig.prerender.routes.push(`/page/${p}`)
    //         }
    //         // タグごとにページ数を計算してルートに加える
    //         for (const tagId in tagCount) {
    //             const cnt = tagCount[tagId]
    //             const tagPageCount = Math.ceil(cnt / limit)
    //             for (let p = 1; p < tagPageCount + 1; p++) {
    //                 nitroConfig.prerender.routes.push(`/tags/${tagId}/page/${p}`)
    //             }
    //         }
    //     },
    // },
 router: {
   options: {
     strict: true,
   }
 },

vue: {
  defineModel: true,
//   propsDestructure: true
   compilerOptions: {
     isCustomElement: (tag) => ['lite-youtube'].includes(tag),
   },
 },

 vite: {
  css: {
    preprocessorOptions: {
      charset: false,
      scss: {
        additionalData: `@import "@/assets/styles/scss/global.scss";`,
      },
    },
  },
  $server: {
//     watch: {
//       usePolling: true,
//     }
  },
  $client: {
//     build: {
//       rollupOptions: {
//         output: {
//           chunkFileNames: '_nuxt/[hash].js',
//           assetFileNames: '_nuxt/[hash][extname]',
//           entryFileNames: '_nuxt/[hash].js',
//         },
//       },
//     },
  },
 },

 pwaVite,
//   pwa: {
//     registerType: 'autoUpdate',
//     manifest: {
//       name: 'Nuxt Vite PWA',
//       short_name: 'NuxtVitePWA',
//       theme_color: '#ffffff',
//       icons: [
//         {
//           src: 'pwa-192x192.png',
//           sizes: '192x192',
//           type: 'image/png',
//         },
//         {
//           src: 'pwa-512x512.png',
//           sizes: '512x512',
//           type: 'image/png',
//         },
//         {
//           src: 'pwa-512x512.png',
//           sizes: '512x512',
//           type: 'image/png',
//           purpose: 'maskable'
//         },
//       ],
//       id: "/?source=NuxtVitePWA",
//       start_url: "/?source=NuxtVitePWA"
//     },
//     workbox: {
//       navigateFallback: '/',
//       globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
//     },
//     client: {
//       installPrompt: true,
//       // you don't need to include this: only for testing purposes
//       // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
//       periodicSyncForUpdates: 20,
//     },
//     devOptions: {
//       enabled: true,
//       suppressWarnings: true,
//       navigateFallbackAllowlist: [/^\/$/],
//       type: 'module',
//     },
//   },

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

 plugins: ['~/plugins/vueapperrorhandler.ts', '~/plugins/format-date.ts', '~/plugins/utils.ts', '~/plugins/youtube.client.ts', '~/plugins/my-plugin.ts']
});
