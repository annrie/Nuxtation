import { defineNuxtConfig } from 'nuxt/config'
import { imagetools } from 'vite-imagetools'
import tailwindcss from "@tailwindcss/vite";
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import yaml from '@rollup/plugin-yaml'
import { pwa } from './app/config/pwa'
import { SiteDescription, SiteName } from './app/logic/constants'
// import { rollup as unwasm } from 'unwasm/plugin'  // Nitro の experimental.wasm で代替
import { readFileSync } from 'node:fs'

// https://nuxt.com/docs/api/configuration/nuxt-config

// 共通で使う Shiki 言語リスト（重複を避けるため定数化）
const SHIKI_PRELOAD = ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'markdown']
const SHIKI_LANGS = ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'markdown', 'html', 'css', 'scss']

export default defineNuxtConfig({
  extends: ['docus'],

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    public: {
				APP_ROOT: 'https://nuxtation.vercel.app',
      API_URL: '/api'
    },
  },

  robots: {
    groups: [
      {
        userAgent: ['*'],
        disallow: [
          '/_content/',  // Nuxt Contentの内部APIをブロック
          '/*?query=',   // 検索結果ページをブロック
          '/*?sort=',    // ソート結果ページをブロック
          '/*?filter=',  // フィルター結果ページをブロック
        ],
        allow: ['/'],
      }
    ],
    sitemap: 'https://nuxtation.phantomoon.com/sitemap.xml',
  },

  ssr: true,

  devtools: {
    enabled: true,
  },

  experimental: {
    inlineSSRStyles: true,
    payloadExtraction: true,
    sharedPrerenderData: false,
    scanPageMeta:'after-resolve',
    renderJsonPayloads: true,
    viewTransition: true,
    componentIslands: true,
    treeshakeClientOnly: true,
	typedPages: true,
    appManifest: {
      override: true,
    },
    defaults: {
      useAsyncData: {
        deep: true,
      },
      nuxtLink: {
        componentName: 'NuxtLink',
        externalRelAttribute: 'noopener noreferrer',
        trailingSlash: 'remove',
        prefetch: true,
        prefetchOn: { interaction: true }
      }
    },
  },

  spaLoadingTemplate: true,

  telemetry: false,

  ogImage: { enabled: false },

  typescript: {
    tsConfig: {
      compilerOptions: {
        isolatedModules: false,
        useDefineForClassFields: false,
      },
    },
    shim: true,
  },

  devServer: {
    host: '',
    port: 3100,
    cors: {
				origin: ['https://nuxtation.vercel.app'],
    },
  },

  app: {
    trailingSlash: false,
    head: {
      htmlAttrs: {
        lang: 'ja',
        class: 'scroll-smooth'
      },
      prefix: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#',
      meta: [
        { property: 'fb:app_id', content: '207844090171446' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: SiteDescription },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-ranslucent' },
        { name: 'msapplication-TileColor', content: '#da532c' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0d1117' },
      ],
      link: [
        {
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
        {
          rel: 'canonical',
          href: 'https://nuxtation.vercel.app',
        },
        {
          rel: 'icon',
          href: '/favicon-16x16.png',
          type: 'image/png',
          sizes: '16x16',
        },
        {
          rel: 'icon',
          href: '/favicon-32x32.png',
          type: 'image/png',
          sizes: '32x32',
        },
        {
          rel: 'icon',
          href: '/favicon.ico',
          type: 'image/x-icon',
          sizes: '48x48',
        },
        {
          rel: 'mask-icon',
          type: 'image/svg+xml',
          href: '/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
      ],
    },
    pageTransition: { name: 'fade-layout', mode: 'out-in' },
    layoutTransition: { name: 'fade-layout', mode: 'out-in' },
  },

  modules: [
    '@vueuse/nuxt',
    'nuxt-shiki',
    // '@nuxt/ui',  // 削除: Docusのextendsで自動的に含まれるかテスト
//    'nuxt-content-twoslash',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    // '@nuxtjs/mdc',  // 削除: Docusに含まれているため不要
    '@nuxtjs/seo',
    '@nuxt/eslint',
    // '@nuxtjs/color-mode',
    'unplugin-icons/nuxt',
    '@nuxt/devtools',
    '@vite-pwa/nuxt',
    'nuxt-link-checker',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxt/icon',
    // '@formkit/nuxt', // 未使用のため削除（251KiB節約）
    'nuxt-jsonld',
    'vue3-carousel-nuxt',
  ],

  components: {
    dirs: [
      {
        path: "~/components",
        global: true,
        priority: 10
      }
    ]
  },
  fonts: {
    experimental: {
      processCSSVariables: true,
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
      sizeLimitKb: 512,
      icons: [
        // Lucide icons
        'lucide:arrow-down',
        'lucide:arrow-left',
        'lucide:arrow-right',
        'lucide:arrow-up',
        'lucide:arrow-up-right',
        'lucide:check',
        'lucide:chevron-down',
        'lucide:chevron-left',
        'lucide:chevron-right',
        'lucide:chevron-up',
        'lucide:chevrons-left',
        'lucide:chevrons-right',
        'lucide:circle-alert',
        'lucide:circle-check',
        'lucide:circle-x',
        'lucide:copy',
        'lucide:copy-check',
        'lucide:ellipsis',
        'lucide:eye',
        'lucide:eye-off',
        'lucide:file',
        'lucide:folder',
        'lucide:folder-open',
        'lucide:hash',
        'lucide:info',
        'lucide:lightbulb',
        'lucide:loader-circle',
        'lucide:menu',
        'lucide:minus',
        'lucide:monitor',
        'lucide:moon',
        'lucide:panel-left-close',
        'lucide:panel-left-open',
        'lucide:plus',
        'lucide:rotate-ccw',
        'lucide:search',
        'lucide:square',
        'lucide:sun',
        'lucide:triangle-alert',
        'lucide:upload',
        'lucide:x',
        // Heroicons
        'heroicons:arrow-path',
        'heroicons:chevron-down',
        'heroicons:chevron-up',
        'heroicons:magnifying-glass',
        // Carbon icons
        'carbon:checkmark-filled',
        'carbon:checkmark-filled-error',
        'carbon:checkmark-filled-warning',
        'carbon:chevron-down',
        'carbon:chevron-up',
        'carbon:warning',
        // Line MD icons
        'line-md:home-md-twotone',
      ],
    },
    serverBundle: false,
  },

  shiki: {
    defaultTheme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultLang: 'typescript',
    highlightOptions: {
      lineNumbers: true,
    },
    bundledLangs: ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'markdown', 'html', 'css', 'scss'],
  },

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

nuxtIcon: {
    size: '24px',
    class: 'icon',
    color: '#000000',
  },

  site: {
    identity: {
      type: 'person',
    },
    name: 'Nuxtation',
    logo: '/logo.png',
    titleSeparator: '-',
    url: 'https://nuxtation.vercel.app',
    description: 'Nuxt 4で構築したブログサイト',
    language: 'ja',
    twitter: '@muraie_jin',
    trailingSlash: false,
  },

  content: {
    markdown: {
      remarkPlugins: {
        'remark-gfm': {},
      },
      rehypePlugins: {
        'rehype-raw': {},
        'rehype-external-links': {
          options: {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        },
      },
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      preload: SHIKI_PRELOAD,
      langs: SHIKI_LANGS,
      options: {
        lineNumbers: true,
      },
    },
    build: {
      markdown: {
        anchorLinks: true,
        toc: {
          depth: 5,
          searchDepth: 5,
        },
        remarkPlugins: {
          'remark-gfm': {},
        },
        rehypePlugins: {
          'rehype-raw': {},
          'rehype-external-links': {
            options: {
              target: '_blank',
              rel: ['noopener', 'noreferrer'],
            },
          },
        },
      },
    },
  },

  mdc: {
    prose: true,
    remarkPlugins: {
      'remark-gfm': {},
    },
    rehypePlugins: {
      'rehype-raw': {},
      'rehype-external-links': {
        options: {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      },
    },
    headings: {
      anchorLinks: {
        h1: true, h2: true, h3: true, h4: true, h5: true
      },
    },
    toc: {
      depth: 5,
      searchDepth: 5
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      langs:SHIKI_LANGS,
      preload: SHIKI_PRELOAD,
      lineNumbers: true,
    },
    components: {
      prose: true,
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

  css: [
    '@@/node_modules/kiso.css/kiso.css',
    '~/assets/css/main.css',
    'v-network-graph/lib/style.css',
  ],

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        // セマンティックカラー
        'info',
        'success',
        'warning',
        'alert',
        'error',
        // カスタムボタンカラー
        'blogBlue',
        'blogGreen',
        'featuredCta',
        'tag'
      ],
      extend: {
        // レスポンシブフォントサイズ（clamp使用、320px〜1600px）
        fontSize: {
          'xxs': 'clamp(0.438rem, 0.063rem + 1.172vw, 0.563rem)',
          'h6': 'clamp(0.938rem, 0.313rem + 1.953vw, 1.25rem)',
          'h5': 'clamp(1.125rem, 0.656rem + 1.469vw, 1.5rem)',
          'h4': 'clamp(1.375rem, 0.906rem + 1.469vw, 1.75rem)',
          'h3': 'clamp(1.75rem, 1.125rem + 1.953vw, 2.25rem)',
          'h2': 'clamp(2.125rem, 1.344rem + 2.441vw, 2.75rem)',
          'h1': 'clamp(2.625rem, 1.656rem + 3.027vw, 3.5rem)',
          'highlight': 'clamp(4rem, 2.5rem + 4.688vw, 5rem)',
        },
        // 行間
        lineHeight: {
          'xxs': '1.55',
          'h6': '1.45',
          'h5': '1.4',
          'h4': '1.35',
          'h3': '1.3',
          'h2': '1.25',
          'h1': '1.15',
          'highlight': '1.1',
        },
        // カスタムボックスシャドウ
        boxShadow: {
          'card-light': '0 18px 40px rgba(15, 23, 42, 0.2)',
          'card-dark': '0 18px 40px rgba(0, 0, 0, 0.5)',
          'card-hover-light': '0 24px 55px rgba(15, 23, 42, 0.35)',
          'card-hover-dark': '0 24px 55px rgba(0, 0, 0, 0.6)',
          'link': '0 8px 16px rgba(0, 0, 0, 0.1)',
          'blue-sm': '0 4px 12px rgba(37, 99, 235, 0.4)',
          'blue-md': '0 6px 16px rgba(37, 99, 235, 0.5)',
          'green-sm': '0 4px 12px rgba(34, 197, 94, 0.4)',
          'green-md': '0 6px 16px rgba(34, 197, 94, 0.5)',
        },
        // アスペクト比
        aspectRatio: {
          'video': '16 / 9',
          'square': '1 / 1',
          'portrait': '3 / 4',
          'landscape': '4 / 3',
        },
        // Border Radius（よく使う値）
        borderRadius: {
          'card': '1.25rem',      // 20px - utilities.cssのカードベース
          'card-lg': '1.75rem',   // 28px
          'card-xl': '2rem',      // 32px
          'button': '0.5rem',     // 8px
          'pill': '9999px',       // 完全な丸
        },
        // Transition Duration（アニメーション用）
        transitionDuration: {
          'card': '350ms',        // utilities.cssのカードトランジション
          'fast': '200ms',        // 高速アニメーション
          'normal': '300ms',      // 通常アニメーション
        },
        // Spacing（カスタム間隔）
        spacing: {
          '18': '4.5rem',         // 72px
          '88': '22rem',          // 352px
        },
      }
    }
  },
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
    provider: 'imgix',
    format: ["avif", "webp"],
    densities: [1, 2],
    quality: 80,
    imgix: {
      baseURL: 'https://nuxtation.imgix.net/',
      modifiers: {
        auto: 'format,compress',  // Phase 24: 自動最適化（format + compress）
        q: 80,                     // Phase 24: 明示的な品質指定
        fit: 'crop',               // Phase 24: トリミング最適化
      },
    },
    domains: [
      'nuxtation.imgix.net',
    ],
    alias: {
      imgix: 'https://nuxtation.imgix.net/',
    },
    densities: [1, 2],
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
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  build: {
    transpile: [ 'nuxt', '@imgix/vue', 'v-network-graph' ],
  },

  sourcemap: {
    server: true,
    client: true,
  },


  schemaOrg: {
    identity: 'Person',
  },

  sitemap: {
    zeroRuntime: true,  // サーバーバンドルサイズを削減
    defaults: {
      priority: 0.5,
      changefreq: 'monthly'  // デフォルトは月次更新
    },
    urls: [
      // トップページ - 最高優先度、週次更新
      {
        loc: '/',
        priority: 1.0,
        changefreq: 'weekly'
      },
      // 主要インデックスページ - 高優先度、週次更新
      {
        loc: '/blog',
        priority: 0.9,
        changefreq: 'weekly'
      },
      {
        loc: '/cat',
        priority: 0.7,
        changefreq: 'monthly'
      }
    ],
    xsl: false,
    credits: false,
    exclude: [ '/_partials/**' ],
    cacheMaxAgeSeconds: 10000,
  },

  routeRules: {
      '/': { prerender: true },
      '/blog/**': { prerender: true },
      '/cat': { prerender: true },
      '/robots.txt': {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, must-revalidate' // 24時間
        }
      },
  },

  nitro: {
    preset: 'vercel',  // Edge Functions ではなく Node.js ランタイムを使用
    rollupConfig: {
      plugins: [Vue({
        template: {
          customElement: true,
          },
      }), vueJsx()],
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
      plugins: ['@/plugins/nitro.error.ts'],
    },
	compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: [
        '/',
        '/blog',
        '/cat',
        '/sitemap.xml',
      ],
    },
    experimental: {
      wasm: false,  // unwasm 警告を回避
    },
    devProxy: {
      host: 'localhost',
    },
  },

  router: {
    options: {
      trailingSlash: false,
      strict: true
    },
  },

  vue: {
    defineModel: true,
    propsDestructure: true,
  },

  vite: {
    plugins: [
      imagetools(),
      yaml(),
	  tailwindcss(),
      // unwasm は Nitro の experimental.wasm: true で代替
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
			vue: {
				features: {
					optionsAPI: false,
				},
			},			
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(import.meta.env.VITE_APP_ENV),
    },
    ssr: {
      noExternal: ['@nuxt/content', '@nuxtjs/mdc'],
      external: ['shiki/onig.wasm'],
    },
    optimizeDeps: {
      include: [ '@heroicons/vue/20/solid' ],
      exclude: ['shiki', 'shiki/onig.wasm'],
      entries: [
        "app/pages/**/*.vue",
        "app/layouts/**/*.vue",
        "app/components/**/*.vue",
      ]
    },
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 1600,
      assetsInclude: '**/*.wasm',
      cssCodeSplit: true,
      cssMinify: 'esbuild',
      minify: 'esbuild',
      rollupOptions: {
        external: [
          'shiki/onig.wasm',
          '@sqlite.org/sqlite-wasm',
          /sqlite3.*\.wasm$/,
        ],
        onwarn(warning, warn) {
          // unwasm の shiki WASM 警告を抑制
          if (warning.plugin === 'unwasm' && warning.message?.includes('onig.wasm')) {
            return;
          }
          warn(warning);
        },
      },
	terserOptions: {
		compress: {
			drop_console: process.env.NODE_ENV === "production",
			drop_debugger: process.env.NODE_ENV === "production",
		},
	},
},
css: {
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
  },
  $development: {
    routeRules: {
      '/api/**': { isr: false },
    },
  },
  },

  linkChecker: {
    failOnError: false,
    enabled: false,
    excludeLinks: [
      'https://twitter.com/muraie_jin',
    ],
  },

  postcss: {
    plugins: {
      'autoprefixer': {},
      'cssnano': {
        preset: ['default', {
          discardComments: { removeAll: true },
        }]
      },
      'postcss-nested': {},
      'postcss-custom-media': {},
      'postcss-media-hover-any-hover': {},
      'postcss-calc': {},
      '@csstools/postcss-color-mix-function': {
        preserve: true,
      },
    }
  },

  llms: {
    domain: "https://nuxtation.vercel.app"
  },

  pwa,
})