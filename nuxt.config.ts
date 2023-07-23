import {defineNuxtConfig} from 'nuxt/config'
import { NavigationGuard } from 'vue-router';
// https://nuxt.com/docs/api/configuration/nuxt-config

const description = 'annrieのNuxt,Vueを中心にしたポートフォリオサイト';
const ogTitle = 'annrie\'s Nuxtation';
const twitterDescription = 'Nuxt, contentで構築したブログサイト';
const twitterCard = 'https://nuxtation.vercel.app/twitter-card.png';
const mySite = 'https://nuxtation.vercel.app/';
const siteName = 'Nuxtation';

export default defineNuxtConfig({
 // Twitter埋め込みで'Hydration node mismatch'エラーが出るため
 ssr: process.env.NODE_ENV !== "development",

 typescript: {
   shim:false
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
   head: {
     // charset: 'utf-8',
     // viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
     titleTemplate: `%s｜ Nuxtation`,
     meta: [
       { name: 'description', content: description },
       //  {  name: "description", content: siteDesc },

       { property: "og:site_name", content: siteName },
       { property: "og:type", content: "website" },
       { property: "og:url", content: mySite },
       { property: "og:title", content: siteName },
       { property: "og:description", content: description },
       { property: "og:image",  content: twitterCard },
       { name: "twitter:site", content: '@muraie_jin' },
       { name: "twitter:card", content: "summary_large_image" },
       {
         name: 'twitter:url',
         content: mySite,
       },
       {
         name: 'twitter:title',
         content: ogTitle,
       },
       {
         name: 'twitter:description',
         content: twitterDescription,
       },
       {
         name: 'twitter:image',
         content: twitterCard,
       },
       // { property: "article:publisher", content: "FacebookURL" },
       // { property: "fb:app_id", content: "FacebookAppID" },
       // { name: "msapplication-TileColor", content:"#ffffff" },
       // { name: "msapplication-TileImage", content: "/ms-icon-144x144.png" },
       // { name: "theme-color", content: "#ffffff" },
     ],
   },
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

 // plugins: ('~/plugins/youtube.client.ts'),
 modules: [
   '@vueuse/nuxt',
   '@unocss/nuxt',
   'nuxt-icon',
   // 'nuxt-windicss',
   '@nuxt/content',
   '@nuxt/image',
   '@pinia/nuxt',
   '@nuxtjs/color-mode',
   'unplugin-icons/nuxt',
   '@kevinmarrec/nuxt-pwa',
   'nuxt-pwa-public-manifest',
   '@nuxtjs/robots',
   '@nuxt/devtools',
 ],

 // },

 content: {
   // documentDriven: true,
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
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai'
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
      remarkPlugins: {
        // Override remark-emoji options
        'remark-emoji': {
          emoticon: true
        },

        // Disable remark-gfm
        'remark-gfm': false,

        // Add remark-oembed
        'remark-oembed': {
          // Options
        }
      },
     // Array syntax can be used to add plugins
     rehypePlugins: [
        'rehype-figure'
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

 // windicss: {
 //   analyze: true
 // },

 experimental: {
   restoreState: true,
   payloadExtraction: false,
   viewTransition: true,
   inlineSSRStyles: true
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
   // fallback: 'light',
 },

 sourcemap: {
   "server": true,
   "client": false,
 },

 robots: {
   UserAgent: '*',
   Disallow: '',
   Allow: '/'
 },

 nitro: {
    storage: {
     data: { driver: 'vercelKV'}
   },
   prerender: {
     routes: ['/sitemap.xml'],
     crawlLinks: true
   },
 },

 // compressPublicAssets: {
 //   brotli: true
 // },
 // preset: 'vercel',
 routeRules: {
   // all routes will be background revalidated (ISR) at most every 60 seconds
   '/**': { isr: 60 },
   // this page will be generated on demand and cached permanently
   // '/static': { isr: true }
 },

 router: {
   options: {
     strict: false
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
       isCustomElement: tag => ['lite-youtube'].includes(tag),
     }
   },

 devtools: {
   // Enable devtools (default: true)
   enabled: true,
   // VS Code Server options
   // vscode: {},
   // ...other options
 },

 plugins: ['~/plugins/vueapperrorhandler.ts', '~/plugins/format-date.ts', '~/plugins/utils.ts', '~/plugins/youtube.client.ts']
})
