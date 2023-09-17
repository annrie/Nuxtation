import {defineNuxtConfig} from 'nuxt/config'
import { NavigationGuard } from 'vue-router';
// import { pwaVite } from './config/pwa';
import { appDescription } from './constants/index';
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
 // Twitter埋め込みで'Hydration node mismatch'エラーが出るため
 ssr: process.env.NODE_ENV !== "development",
// ssr: false, // for generate
telemetry:false,

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

// components: [
//  {
// //    'path': '~/components/content',
//    global: true,
//    dirs: ['~/components']
//   },
//   //  { path: '~/node_modules/@nuxt/content/dist/runtime/components/', prefix: 'mdc' },
//   //  { path: '~/node_modules/nuxt-mdc/dist/runtime/components/', prefix: 'nuxt-mdc' },
// //   '~/components' ,
// //   path: '~/components/content',
// //   pathPrefix: true,
// //   level: 1,
// //  },
// //  '~/components',
// //  { path: '~/node_modules/@nuxt/content/dist/runtime/components/', prefix: 'mdc' },
//   // Sitemap: 'https://nuxtation.vercel.app/sitemap.xml',
//  ],
 modules: [
   '@vueuse/nuxt',
   '@unocss/nuxt',
   'nuxt-icon',
   '@nuxt/content',
   '@nuxt/image',
   '@pinia/nuxt',
   '@nuxtjs/color-mode',
   'unplugin-icons/nuxt',
   '@nuxtjs/robots',
   '@nuxt/devtools',
   'nuxt-typed-router',
   '@vite-pwa/nuxt',
   'nuxt-og-image',
   '@nuxthq/studio',
  ],

 content: {
   experimental: {
     clientDB: true
   },
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
   headNext: true,
   asyncContext: true,
   clientFallback: true,
   polyfillVueUseHead: false,
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
 nitro: {
//    preset: 'service-worker', // for generate
  esbuild: {
    options: {
      target: 'esnext',
    },
    plugins: [ '~/plugins/nitro.error.ts' ],
  },
   prerender: {
     crawlLinks: true,
     failOnError: false,
//      routes: [ '/sitemap.xml', '/robots.txt'],
//      routes: [ '/sitemap.xml', '/robots.txt' ],
//      routes: [ '/','/blog','/friends','/cat','/sitemap.xml', '/robots.txt' ], // for generate
//      ignore: ['/blog', '/friends'],
   },
//    future: {
//     nativeSWR: true,
//     },
 },
// target: 'static',
//  $production: {
//   routeRules: {
//   "/modify-headers-route": { headers: { 'x-magic-of': 'nuxt and vercel' }},
//     routeRules: {
//         '/': {ssr: false} ,
//         '/blog': {ssr: false} ,
//       '/friends': {ssr: false} ,
//       '/cat': {ssr: false} ,
//   },
//   },
// },
//   $development: {
//     routeRules: {
//         '/': {ssr: false} ,
//     },
//   },
 // compressPublicAssets: {
 //   brotli: true
 // },
//  preset: 'vercel_edge',
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
     strict: false
   }
 },

vue: {
  defineModel: true,
//   propsDestructure: true
   compilerOptions: {
     isCustomElement: (tag) => ['lite-youtube'].includes(tag),
    //  isCustomElement: (tag) => tag.includes(['lite-youtube']),
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
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: '_nuxt/[hash].js',
          assetFileNames: '_nuxt/[hash][extname]',
          entryFileNames: '_nuxt/[hash].js',
        },
      },
    },
  },
 },

//  pwaVite,
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nuxt Vite PWA',
      short_name: 'NuxtVitePWA',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
      ],
      id: "/?source=NuxtVitePWA",
      start_url: "/?source=NuxtVitePWA"
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

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
});
