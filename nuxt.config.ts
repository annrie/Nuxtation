import { defineNuxtConfig } from 'nuxt/config'
// import { SiteName, SiteDescription } from './logic/constants';
import { RuntimeConfig } from 'nuxt/schema';
// import { OgImage } from './.nuxt/components.d';
import { NavigationGuard } from 'vue-router';
import { pwaVite } from './config/pwa';
import { appDescription } from './logic/index';
import { bundledLanguages } from 'shiki';
import { imagetools } from "vite-imagetools";
import vsharp from 'vite-plugin-vsharp';

// import genSitemap from './scripts/gen-sitemap';
// https://nuxt.com/docs/api/configuration/nuxt-config
// import { BASE_URL, API_KEY } from process.env;

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
    // inlineStyles: false,
    // devLogs: 'silent'
  },
  compatibilityDate: '2024-04-03',
  // debug: true,
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
//  ssr: process.env.NODE_ENV !== "development",
ssr: true,
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
   port: 3100,
    cors: {
      origin: ['https://nuxtation.phantomoon.com'],
    },
 },
 // serverMiddleware: {
 //   '/_ipx': '@/server/middleware/ipx.js'
 // },
  runtimeConfig: {
    public: {
      apiBase: import.meta.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
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
   '@nuxtjs/mdc',
   '@nuxt/image',
   '@nuxtjs/mdc',
   '@nuxtjs/seo',
   '@nuxt/eslint',
   'nuxt-og-image',
   '@nuxtjs/color-mode',
   'unplugin-icons/nuxt',
   '@nuxt/devtools',
//   'nuxt-typed-router',
   '@vite-pwa/nuxt',
   '@nuxtjs/sitemap',
   '@nuxtjs/robots',
   'nuxt-link-checker',
   '@nuxthq/studio',
   'nuxt-gtag',
   'nuxt-shiki',
   '@nuxtjs/web-vitals',
   'nuxt-icon',
  ],

  icon: {
    provider: 'iconify',
    clientBundle: {
      scan: true,
    },
    serverBundle: false,
    // serverBundle: {
    //   collections: ['uil', 'mdi', 'logos', 'carbon'] // Specify the collections you want to include
    // }
  },
  mdc: {
    remarkPlugins: {},
    rehypePlugins: {
      // options: {
      // // Configure rehype options to extend the parser
      // },
      // plugins: {
      // // Register/Configure rehype plugin to extend the parser
      // },
    },
    headings: {
      anchorLinks: {
      // Enable/Disable heading anchor links. { h1: true, h2: false }
      },
    },
    highlight: 'shiki', // Control syntax highlighting
    components: {
      prose: true, // Add predefined map to render Prose Components instead of HTML tags, like p, ul, code
      map: {
      // This map will be used in `<MDCRenderer>` to control rendered components
      },
    },
  },

  shiki: {},
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
      },
      stadalone: false,
    },
   },
 gtag: {
    enabled: import.meta.env.NODE_ENV === 'production',
    id: require('node:process').env.GA_MEASUREMENT_ID,
    config: {
      page_title: 'Nuxtation',
    },
    loadingStrategy: 'async',
  },
  webVitals: {
    provider: 'google-analytics',
    debug: false,
    disabled: true, // Enable to test locally
  },
  nuxtIcon: {
    size: '24px',
    class: 'icon',
    color: '#000000',
  },
  ogImage: {
    enabled: false,
  },

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
    trailingSlash: true,
  },
  schemaOrg: {
    identity: 'Person',
    },
 content: {
   contentHead: false,
   documentDriven: true,
   experimental: {
     clientDB: true,
     search: false,
   },
   watch: {
     ws: {
       port: 4000,
       showURL: true
     }
   },
  highlight: {
      langs: Object.keys(bundledLanguages),
      // theme:'dark-plus',
      theme: {
        dark: true,
        // Default theme (same as single string)
        default: 'vitesse-dark',
        // Theme used if `html.dark`
        dark: 'vitesse-dark',
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
      anchorLinks: true,
       toc: {
        depth: 5,
        searchDepth: 5,
      },
      // // Object syntax can be used to override default options
      remarkPlugins: {
//        'remark-emoji': {
//          emoticon: true,
//        },
       'remark-gfm': true,
      //   'remark-oembed': {
      //     // Options
      //   }
    },
      //   // Override remark-emoji options
      //   // 'remark-emoji': {
      //   //   emoticon: true
      // },
      rehypePlugins: [
        // [
        //   'rehype-external-links',
        //   {
        //       target: '_blank',
        //       rel: 'noopener'
        //   }
        // ],
        // 'rehype-slug',
        // 'rehype-autolink-headings',
        // 'rehype-highlight',
        // 'rehype-prism-plus',
        // 'rehype-figure',
      ],
      //   // Disable remark-gfm
      //   // Add remark-oembed
       // },
    },
  externals: {
      // 外部リソースのタイムアウト時間を30秒に設定（デフォルトは5秒）
      timeout: 30000,
      // エラーが発生してもビルド処理を続行する
      skipBroken: true,
    },
  },

 unocss: {
   uno: true,
   icons: true,
   attributify: true,
   components: true,
   nuxtLayers: true,
   rules: [],
 },

linkChecker: {
    failOnError: false,
    enabled: false,
    excludeLinks: [
      'https://twitter.com/muraie_jin',
    ],
  },

  experimental: {
    scanPageMeta:'after-resolve',
    sharedPrerenderData: false,
    renderJsonPayloads: false,
    appManifest: {
      override: true,
    },
    defaults: {
      useAsyncData: {
        deep: true,
      },
    },
  },


 css: [
   '@unocss/reset/tailwind.css',
   'assets/styles/scss/global.scss',
   '@@/node_modules/lite-youtube-embed/src/lite-yt-embed.css',
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
   "server": true,
   "client": false,
 },
  sitemap: {
   strictNuxtContentPaths: true,
    xsl: false,
    credits: false,
    exclude: ['/_content'],
    cacheMaxAgeSeconds: 10000,
  },
robots: {
    blockAiBots: false,
    blockNonSeoBots: true,
    cacheControl: 'max-age=14400, must-revalidate',
},

 studio: {
  enabled: true,
  },


//  hooks: {
//    'robots:config': (config) => {
//      config.Sitemap = '/sitemap.xml';
//    },
//  },

 nitro: {
  experimental: {
      wasm: true,
    },
  devProxy: {
    host: 'localhost',
  },
  // future: {
  //   nativeSWR: true,
  // },
  preset: 'vercel',
//   static: true,
 esbuild: {
    options: {
      target: 'esnext',
    },
    plugins: [ '~/plugins/nitro.error.ts' ],
  },
  prerender: {
     crawlLinks: true,
     failOnError: false,
     routes: [ '/', '/sitemap.xml', '/_vercel/speed-insights/*' ],
   },
    experimental: {
      wasm: true,
    },
 },

  routeRules: {
       '/': { prerender: true },
       robots: false,
    },

  vue: {
    defineModel: true,
    // customElement: true,
    propsDestructure: true,
    compilerOptions: {
      isCustomElement: (tag: string) => ['lite-youtube'].includes(tag)
      }
  },
 vite: {
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(import.meta.env.VITE_APP_ENV),
    },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1600, // Adjust as needed
      assetsInclude: '**/*.wasm',
      rollupOptions: {
        external: [
          'shiki/onig.wasm', // !Important: externalize the wasm import
        ],
      },
    },
  css: {
    preprocessorOptions: {
      charset: false,
      scss: {
        api: 'modern-compiler',
//        additionalData: `@use "@/assets/styles/scss/global.scss";`,
      },
    },
  plugins: [imagetools(), vsharp()],
  preprocessorMaxWorkers: true,
 },
 },

  pwaVite,
});
