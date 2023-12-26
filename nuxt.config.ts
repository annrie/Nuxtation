import { defineNuxtConfig } from 'nuxt/config'
// import { SiteName, SiteDescription } from './logic/constants';
import { RuntimeConfig } from 'nuxt/schema';
// import { OgImage } from './.nuxt/components.d';
import { NavigationGuard } from 'vue-router';
import { pwaVite } from './config/pwa';
import { appDescription } from './logic/index';
// import wasm from 'shikiji/onig.wasm';

// import genSitemap from './scripts/gen-sitemap';
// https://nuxt.com/docs/api/configuration/nuxt-config
// import { BASE_URL, API_KEY } from process.env;

export default defineNuxtConfig({
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
        head: {
          prefix: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#',
          meta: [
              { property: "fb:app_id", content: "process.env.FB_APP_ID"},
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'msapplication-TileColor', content: '#da532c' },
              { name: 'theme-color', content: '#ffffff' },
            ],
          link: [
             {
               rel: 'manifest',
                href: '/manifest.webmanifest'
              },
              {
              rel: "canonical",
              href: "https://nuxtation.phantomoon.com/",
              },
              {
                rel: "icon",
                href: "/favicon-32x32.png",
                sizes: "32x32",
              },
              {
                rel: "icon",
                href: "/favicon-16x16.png",
                sizes: "16x16",
              },
              {
                rel: "mask-icon",
                type: "image/svg+xml",
                href: "/safari-pinned-tab.svg",
                color: "#5bbad5",
              },
              {
                rel: "apple-touch-icon",
                href: "/apple-touch-icon.png",
                sizes: "180x180",
              },
            ],
        },
   pageTransition: { name: 'page', mode: 'out-in' },
   layoutTransition: { name: 'fade-layout', mode: 'in-out' },
 },

 modules: [
   '@vueuse/nuxt',
   '@unocss/nuxt',
   '@nuxt/content',
   '@nuxt/image',
   '@nuxtjs/mdc',
   '@nuxtseo/module',
   'nuxt-og-image',
   '@pinia/nuxt',
   '@nuxtjs/color-mode',
   'unplugin-icons/nuxt',
   '@nuxt/devtools',
   'nuxt-typed-router',
   '@vite-pwa/nuxt',
   'nuxt-link-checker',
   '@nuxthq/studio',
   'nuxt-gtag',
   'nuxt-simple-robots',
   'nuxt-icon',
  ],
  gtag: {
    id: process.env.GA_MEASUREMENT_ID,
    loadingStrategy: 'async',
  },
  nuxtIcon: {
    size: '24px',
    class: 'icon',
    color: '#000000',
  },
// ogImage: {
//   enabled: false,
// },

    site: {
      identity: {
        type: 'person',
      },
    name: 'Nuxtation',
    logo: '/logo.png',
    titleSeparator: '-',
    url: 'https://nuxtation.vercel.app',
    description: 'Nuxt, contentで構築したブログサイト',
    language: 'ja',
    twitter: '@muraie_jin',
  },


 content: {
  // api: {
  //   baseURL: 'api/_content',
  // },
   experimental: {
     clientDB: true
   },
  contentHead: false,
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
        default: 'github-dark',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        // sepia: 'monokai'
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
     ],
    remarkPlugins: {
       'remark-rehype': false,

        // Disable remark-gfm
       'remark-gfm': false,

       // Override remark-emoji options
       'remark-emoji': {
          emoticon: true,
        },

        // 'remark-html': false,

        // Add remark-oembed
        // 'remark-oembed': {
        //   // options
        //   mode: 'extract',
        //   usePrefix: false,
        //   providers: {
        //     include: ['Twitter', 'YouTube']
        //   },
        // },
      },
 },
},

 unocss: {
   uno: true,
   icons: true,
   attributify: true,
   components: false,
   rules: [],
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
   appManifest: true,
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
  blockNonSeoBots: true,
},

routeRules: {
        '/**': { isr: 60, spa: true },
        // '/blog/**': { ssr: true },
        // '/friends/**': { ssr: true },
        // '/cat/**': { ssr: false },
        // '/cms/**': { ssr: false },
    },

 studio: {
  enabled: true,
  },


  hooks: {
    'robots:config': (config) => {
      config.Sitemap = '/sitemap.xml';
    },
  },

 nitro: {
  // preset: 'node-server',
  // preset: 'vercel-edge',
  wasm: {
    rollup: {
      targetEnv: 'browser',
    }
  },
  esbuild: {
    options: {
      target: 'esnext',
    },
    plugins: [ '~/plugins/nitro.error.ts' ],
  },
   storage: {
     data: { driver: 'vercelKV'}
   },
  prerender: {
     crawlLinks: true,
     failOnError: false,
     routes: [ '/', '/sitemap.xml', '/robots.txt' ],
   },
// hooks: {
//   'robots:config': (config) => {
//      config.sitemap = '/sitemap.xml';
//      },
// },
        // hooks: {
        //     'compiled': genSitemap,
        // }
//    future: {
//     nativeSWR: true,
//     },
 },

 router: {
   options: {
     strict: true,
   }
 },

vue: {
  defineModel: true,
//   propsDestructure: true,
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
});
