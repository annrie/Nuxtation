import { defineNuxtConfig } from 'nuxt/config'
import { bundledLanguages } from 'shiki';
import { imagetools } from 'vite-imagetools';
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import yaml from '@rollup/plugin-yaml'
import { pwa } from './app/config/pwa'
import remarkGfm from 'remark-gfm'
import { SiteDescription, SiteName } from './app/logic/constants'
import { rollup as unwasm } from 'unwasm/plugin'
import wasm from "@rollup/plugin-wasm"
import { readFileSync } from 'node:fs'

// https://nuxt.com/docs/api/configuration/nuxt-config
// import { BASE_URL, API_KEY } from process.env;

export default defineNuxtConfig({
  devtools: {
   enabled: true,
  },
  future: {
    compatibilityVersion: 4,
    // inlineStyles: false,
    // devLogs: 'silent'
  },
  compatibilityDate: '2024-04-03',
  // debug: true,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://nuxtation.vercel.app',
    },
  },


  // robotsの設定を修正
  robots: {
    configPath: './robots.config.ts',  // 設定ファイルを外部化
  },

  ssr: true,

  devtools: {
    enabled: true,
  },

  experimental: {
    payloadExtraction: false,
    sharedPrerenderData: false,
    scanPageMeta:'after-resolve',
    renderJsonPayloads: true,
    viewTransition: true,
//    granularCachedData: true,
    // buildCache: true,
    //   viewTransition: true,
    //   inlineSSRStyles: false,
    //   renderJsonPayloads: true,
    //   typedPages: true,
    //   headNext: true,
    //   asyncContext: true,
    //   clientFallback: false,
    //   componentIslands: true,
    appManifest: {
      override: true,
    },
    defaults: {
      useAsyncData: {
        deep: true,
      },
      nuxtLink: {
        // default values
        componentName: 'NuxtLink',
        externalRelAttribute: 'noopener noreferrer',
//        activeClass: 'router-link-active',
//        exactActiveClass: 'router-link-exact-active',
//        prefetchedClass: undefined, // can be any valid string class name
        trailingSlash: 'remove', // can be 'append' or 'remove'
        prefetch: true,
        prefetchOn: { visibility: true }
      }
    },
  },


//  debug: true,
  // target: 'static',

  // pages: true,

  // per default disabled since Nuxt 3.7
  spaLoadingTemplate: true,

  // definePageMeta: {
  //   keepalive: true,
  // },
  telemetry: false,

  ogImage: { enabled: false },

  typescript: {
    // typeCheck: true,
    tsConfig: {
      compilerOptions: {
        isolatedModules: false,
        useDefineForClassFields: false,
      },
    },
   shim:true
 },

 devServer: {
   host: '',
   port: 3000,
    cors: {
      origin: ['https://nuxtation.vercel.app'],
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
   layoutTransition: { name: 'fade-layout', mode: 'out-in' },
 },

 modules: [
   '@vueuse/nuxt',
   '@unocss/nuxt',
    'nuxt-shiki',
    'nuxt-content-twoslash',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
   '@nuxt/content',
   '@nuxtjs/mdc',
   '@nuxt/image',
   '@nuxtjs/seo',
   '@nuxt/eslint',
   '@nuxtjs/color-mode',
   'unplugin-icons/nuxt',
   '@nuxt/devtools',
   '@vite-pwa/nuxt',
   'nuxt-link-checker',
   '@nuxthq/studio',
   'nuxt-gtag',
   '@nuxtjs/web-vitals',
		'@nuxt/icon',
    'nuxt-jsonld',
  ],

  components: [
    {
      path: '~/components/blog/',
      pathPrefix: false,
    },
    {
      path: '~/components/top/',
      pathPrefix: false,
    },
    {
      path: '~/components/nav/',
      pathPrefix: false,
    },
    {
      path: '~/components/tags/',
      pathPrefix: false,
    },
    {
      path: '~/components/icons/',
      pathPrefix: false,
    },
		{
			path: '~/components/cat/',
			pathPrefix: false,
		},
    {
      path: '~/components',
      ignore: ['**/*.d.ts'],
    },
  ],

  fonts: {
    experimental: {
      // Required for TailwindCSS v4. You can enable support for processing CSS variables for font family names. This may have a performance impact.
      processCSSVariables: true,
      // Defines whether to enable adding local fallbacks. Default is `false`.
      disableLocalFallbacks: false,
    },
    defaults: {
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: [],
    },
    fallbacks: {
      'serif': ['Noto Serif JP'],
      'sans': ['Noto Sans JP'],
      'monospace': ['Fira Code'],
    },
  },

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
  scripts: [
    {
      src: 'https://www.youtube.com/iframe_api',
      async: true,
      defer: true,
      callback: 'onYouTubeIframeAPIReady'
    }
  ],

  shiki: {},
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
      },
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
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
    trailingSlash: false,
  },

  formkit: {
    // autoImport: true,
    configFile: './formkit.config.ts',
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio',
      dev: true,
    },
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme: {
            default: 'github-light',
            dark: 'github-dark',

//          langs: Object.keys(bundledLanguages),
//          langs: [
//            // Read more about Shiki languages: https://shiki.style/guide/load-lang
//            JSON.parse(
//              readFileSync('./shiki/languages/gdscript.tmLanguage.json', 'utf-8'),
//            ),
//          ]
        },
        anchorLinks: true,
//        toc: {
//          depth: 5,
//          searchDepth: 5,
//        },
        remarkPlugins: {
          'remark-gfm': true,
          'remark-emoji': {
            options: {
              emoticon: true
            }
          },
          'remark-oembed': {
            // Options
          }
        },
        rehypePlugins: [
        ],
      },
    },
    experimental: {
      search: {
        indexed: true,
        filterQuery: { _draft: false, _partial: false }
      },
    nativeSqlite: true
    },
    watch: {
      ws: {
        port: 4000,
        showURL: true,
      },
    },
  },
},
    mdc: {
      prose: true,
      remarkPlugins: {},
      rehypePlugins: {
      },
      headings: {
        anchorLinks: {
//           Enable/Disable heading anchor links. { h1: true, h2: false }
          h1: true, h2: true, h3: true, h4: true, h5: true
        },
      },
      toc: {
        depth: 5,
        searchDepth: 5
      },
      highlight: 'shiki', // Control syntax highlighting
      components: {
        prose: true, // Add predefined map to render Prose Components instead of HTML tags, like p, ul, code
        map: {
          // This map will be used in <MDCRenderer> to control rendered components
        },
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
    //    mode: 'vue-scoped',
  },

postcss: {
  plugins: {
//    '@unocss/postcss': {},
    'autoprefixer': {},
    'postcss-nested': {},
    'postcss-custom-media': {},
    'postcss-media-hover-any-hover': {},
//    'postcss-calc': {},
  }
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
    'assets/styles/scss/global.scss',
    '@@/node_modules/lite-youtube-embed/src/lite-yt-embed.css',
  ],

  image: {
    inject: true,
    screens: {
      'xxxs': 10,
      'xxs': 240,
      'sm': 320,
      'md': 640,
      'tb': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536,
    },
    // dir: '../images',
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

  presets: {
     cover: {
       modifiers: {
         format: 'avif, webp, png',
         fit: 'cover',
         quality: '80',
       },
     },
   },
 },

  colorMode: {
    classSuffix: '',
  },

  build: {
    transpile: ['nuxt', '@iconify/vue', 'lite-youtube'],
  },

  sourcemap: {
    server: true,
    client: false,
  },

  robots: {
    disableNuxtContentIntegration: true,
//    UserAgent: '*',
//    Allow: '/',
//    Sitemap: ['https://nuxtation.phantomoon.com/sitemap.xml'],
  },

  generate: {
    crawler: true,
    trailingSlash: false,
    routes: [
        '/',
    ],
  },

  schemaOrg: {
    identity: 'Person',
  },

  sitemap: {
    xsl: false,
    credits: false,
    exclude: [ '/_partials/**' ],
    cacheMaxAgeSeconds: 10000,
  },
robots: {
     disableNuxtContentIntegration: true,
    cacheControl: 'max-age=14400, must-revalidate',
},

 studio: {
  enabled: true,
  },

  nitro: {
    rollupConfig: {
      plugins: [Vue({
        template: {
          customElement: true,
          },
      }), vueJsx()],
    },
    // hooks: {
    //   compiled: genSitemap,
    // },
    esbuild: {
      options: {
        target: 'esnext',
      },
      plugins: ['@/plugins/nitro.error.ts'],
    },
  prerender: {
     crawlLinks: true,
     failOnError: false,
     routes: [ '/', '/sitemap.xml', '/_vercel/speed-insights/*' ],
   },

    routeRules: {
      '/robots.txt': {
        prerender: false,  // 動的生成に変更
        cache: {
          maxAge: 60 * 60 * 24 // 24時間
        }
      }
    },
    experimental: {
      wasm: true,
    },
    externals: { traceInclude: ['shiki/dist/core.mjs'] },
    //    future: {
    //     nativeSWR: true,
    //     },
    devProxy: {
      host: 'localhost',
    },
  },

  router: {
    options: {
      trailingSlash: false,
      strict: true
    },
//    middleware: [
//      { path: 'manifest-route-rule', override: true }
//    ]
  },

  vue: {
    defineModel: true,
    propsDestructure: true,
//    customElement: true,
    compilerOptions: {
      isCustomElement: (tag: string) => ['lite-youtube'].includes(tag)
      }
  },
  vite: {
    plugins: [ // https://github.com/pi0/nuxt-shiki/issues/41
      imagetools(),
      yaml(),
      wasm(),
      import.meta.env.NODE_ENV === 'production' ? [unwasm({})] : undefined,
      {
        name: 'ignore-dts',
        enforce: 'pre',
        transform(src, id) {
          if (id.endsWith('.d.ts')) {
            return { code: '' };
          }
        },
      },
    ],
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(import.meta.env.VITE_APP_ENV),
    },
    ssr: {
      noExternal: ['@nuxt/content'],
    },
    optimizeDeps: {
      include: [ 'buffer', '@heroicons/vue/20/solid', '@unhead/schema-org/vue' ],
      entries: [ // https://zenn.dev/comm_vue_nuxt/articles/6f4da63b50a423
        // 実用的なスコープならこの3つくらい。もし必要なら.tsも。
        "pages/**/*.vue",
        "layouts/**/*.vue",
        "components/**/*.vue",

        // または、面倒なら全て
//        "**/*.vue",
      ]
    },
    build: {
    // ssr: true,
//      minify: false,
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
//        charset: false,
        scss: {
          api: 'modern-compiler',
//          additionalData: `@use "~/assets/styles/scss/global.scss";`,
        },
      },
    preprocessorMaxWorkers: true
    },
    $client: {
      build: {
        rollupOptions: {
          output: {
            chunkFileNames: '_nuxt/[name].js',
            entryFileNames: '_nuxt/[name].js'
          }
        }
      }
    },

   $production: {
      routeRules: {
        '/api/**': { isr: false },
      },
     scripts: {
      registry: {
        clarity: {
         id: 'om4gr7h0pn'
        }
      },
    },
  },
  $development: {
    routeRules: {
      '/api/**': { isr: false },
    },
  },
    },

  pwa,
})
