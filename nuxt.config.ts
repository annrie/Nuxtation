// import { rollup as unwasm } from 'unwasm/plugin'  // Nitro の experimental.wasm で代替
import yaml from '@rollup/plugin-yaml'
import tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineNuxtConfig } from 'nuxt/config'
import { imagetools } from 'vite-imagetools'
import { pwa } from './app/config/pwa'
import { SiteDescription, SiteUrl } from './app/logic/constants'

// https://nuxt.com/docs/api/configuration/nuxt-config

// 共通で使う Shiki 言語リスト（重複を避けるため定数化）
const SHIKI_PRELOAD = ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'markdown']
const SHIKI_LANGS = ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'markdown', 'html', 'css', 'scss']
const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  extends: ['docus'],

  modules: [
    '@vueuse/nuxt',
    // '@nuxt/ui',  // 削除: Docusのextendsで自動的に含まれるかテスト
    'nuxt-content-twoslash', // twoslash: @nuxt/content より前に配置必須
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    // '@nuxtjs/mdc',  // 削除: Docusに含まれているため不要
    '@nuxtjs/seo',
    '@nuxt/eslint',
    // '@nuxtjs/color-mode',
    'unplugin-icons/nuxt',
    // '@nuxt/devtools' は modules に登録しない。devtools.enabled: true が
    // あれば Nuxt が自動でロードするため、明示登録は冗長（二重登録になる）。
    '@vite-pwa/nuxt',
    'nuxt-link-checker',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxt/icon',
    // '@formkit/nuxt', // 未使用のため削除（251KiB節約）
    // 'nuxt-jsonld', // 削除: useSchemaOrg（@nuxtjs/seo）で代替
    'vue3-carousel-nuxt',
    '@vercel/speed-insights/nuxt',
    '@vercel/analytics/nuxt',
  ],
  $development: {
    routeRules: {
      '/api/**': { isr: false },
    },
  },

  $production: {
    routeRules: {
      '/api/**': { isr: false },
    },
  },

  ssr: true,

  components: {
    dirs: [
      {
        path: '~/components',
        global: true,
        priority: 10,
      },
    ],
  },

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
        class: 'scroll-smooth',
        prefix: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#',
      },
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
        // 画像はすべて imgix から読む。最初の画像のリクエストより先に接続を始めておく（画像は CORS なしで読むので crossorigin は付けない）
        {
          rel: 'preconnect',
          href: 'https://nuxtation.imgix.net',
        },
        {
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
        {
          rel: 'canonical',
          href: SiteUrl,
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
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: false,
  },

  css: [
    // kiso.css はここでは読み込まない。ここから読むとレイヤー外になり
    // Tailwind の @layer utilities を打ち消すため、
    // app/assets/css/main.css で `layer(base)` 付きで import している。
    // 'v-network-graph/lib/style.css', // 削除: 未使用
    '@shikijs/twoslash/style-rich.css', // twoslash のホバーツールチップ用スタイル
  ],

  vue: {
    // @ts-expect-error `vue.defineModel` は型に無いキー(Vue 3.5 では defineModel は常に有効)。ビルド出力を変えないため、値は触らずに残している。
    defineModel: true,
    propsDestructure: true,
  },

  router: {
    options: {
      strict: true,
    },
  },

  site: {
    identity: {
      type: 'person',
    },
    name: 'Nuxtation',
    logo: '/logo.png',
    titleSeparator: '-',
    url: SiteUrl,
    description: 'Nuxt 4で構築したブログサイト',
    language: 'ja',
    // <html lang> の実際の供給元。nuxt-seo-utils の applyDefaults が
    // `siteConfig.currentLocale || siteConfig.defaultLocale || 'en'` で
    // htmlAttrs.lang を決めており、上の `language` は参照されない。
    // これを入れないと日本語サイトなのに lang="en" が出力され、
    // kiso.css の `:lang(ja)` ルールが一切効かなくなる。
    defaultLocale: 'ja',
    twitter: '@muraie_jin',
    trailingSlash: false,
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
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
        // @ts-expect-error `anchorLinks` は @nuxt/content v3 の markdown オプションの型に無いキー(v2 の名残の可能性)。ビルド出力を変えないため、値は触らずに残している。
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
        h1: true,
        h2: true,
        h3: true,
        h4: true,
        h5: true,
      },
    },
    toc: {
      depth: 5,
      searchDepth: 5,
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      // @ts-expect-error string[] は Shiki の BundledLanguage[] に代入できない(shiki は直接の依存ではなく、型を import できない)。中身は Shiki の言語名のみ。
      langs: SHIKI_LANGS,
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

  ui: {
    theme: {
      // Nuxt UI のカラーエイリアス。ここに並べた名前は app.config.ts の
      // `ui.colors` で「Tailwind の色名」を割り当てて初めて機能する。
      // 割り当てのないエイリアスは未解決の --ui-color-* を吐くだけになる。
      //
      // デザイントークン（fontSize/boxShadow/borderRadius 等）はここではなく
      // Tailwind CSS v4 の @theme で定義する（app/assets/css/tailwind.css）。
      // Nuxt UI の theme オプションは colors / transitions / unstyled /
      // defaultVariants / prefix のみを受け付ける。
      colors: [
        'primary',
        'secondary',
        'tertiary',
        // セマンティックカラー
        'info',
        'success',
        'warning',
        'error',
      ],
    },
  },

  spaLoadingTemplate: true,

  runtimeConfig: {
    public: {
      APP_ROOT: SiteUrl,
      API_URL: '/api',
    },
  },

  build: {
    transpile: ['nuxt'],
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/cat': { prerender: true },
    '/robots.txt': {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, must-revalidate', // 24時間
      },
    },
  },

  sourcemap: {
    server: false,
    client: true,
  },

  devServer: {
    host: '',
    port: 3100,
    cors: {
      origin: [SiteUrl],
    },
  },

  experimental: {
    inlineSSRStyles: true,
    payloadExtraction: isDev ? false : 'client',
    sharedPrerenderData: false,
    scanPageMeta: 'after-resolve',
    // 記事の本文のコード例に `</script>` がそのまま入っているので、JSON のペイロード（<script type="application/json">）は
    // ブラウザがそこで閉じてしまう。残りがページの末尾に文字として出て、ペイロードを読めず hydration も食い違っていた
    // （2026-10-29 に本番で確認。docustation は同じ理由で false にしている）。JS の形（window.__NUXT__）なら起きない。
    // ローカルの nuxi generate の出力でも同じで、__NUXT_DATA__ の中に生の `<` が 12 個あり、`<` へのエスケープは 0 個だった
    renderJsonPayloads: false,
    viewTransition: false,
    componentIslands: true,
    treeshakeClientOnly: true,
    typedPages: true,
    // @ts-expect-error `experimental.appManifest` の型は boolean だが、オブジェクトを渡している。ビルド出力を変えないため、値は触らずに残している。
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
        prefetchOn: { interaction: true },
      },
    },
  },

  //  future: {
  //    compatibilityVersion: 4,
  //  },
  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'vercel', // Edge Functions ではなく Node.js ランタイムを使用
    storage: {
      'cache:nuxt:payload': isDev
        ? { driver: 'memory' }
        : undefined,
    },
    rollupConfig: {
      plugins: [
        Vue({
          template: {
            // @ts-expect-error `customElement` は template オプションの型に無いキー。ビルド出力を変えないため、値は触らずに残している。
            customElement: true,
          },
        }) as any,
        vueJsx() as any,
      ],
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
      // @ts-expect-error `nitro.esbuild` の型に `plugins` は無い。ビルド出力を変えないため、値は触らずに残している。
      plugins: ['@/plugins/nitro.error.ts'],
    },
    // compressPublicAssets: ホスティング先がオンザフライ圧縮するため無効化
    // compressPublicAssets: true,
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
      wasm: false, // unwasm 警告を回避
    },
    devProxy: {
      host: 'localhost',
    },
  },

  vite: {
    server: {
      // Vite の root は srcDir(app/) なので glob は ./pages, ./layouts。
      // 起動直後に主要ルートを事前変換し、初回アクセスのオンデマンド
      // 変換集中による遅延を軽減する。
      warmup: {
        clientFiles: ['./pages/**/*.vue', './layouts/**/*.vue'],
        ssrFiles: ['./pages/**/*.vue', './layouts/**/*.vue'],
      },
    },
    // 外部ディレクトリにおいた場合は追加。HMRが効かなくなるため
    //    server: {
    //      watch: {
    //        usePolling: true,
    //        interval: 1000,
    //      },
    //    },
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
            return { code: '' }
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
      include: [
        'buffer', // CJS
        '@heroicons/vue/20/solid',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
      exclude: ['shiki', 'shiki/onig.wasm'],
      entries: [
        'pages/**/*.vue',
        'layouts/**/*.vue',
        'components/**/*.vue',
      ],
    },
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 1600,
      // @ts-expect-error `assetsInclude` は `vite.build` ではなく `vite` 直下のオプション(置き場所の誤りの可能性)。ビルド出力を変えないため、値は触らずに残している。
      assetsInclude: '**/*.wasm',
      cssCodeSplit: true,
      cssMinify: 'esbuild',
      minify: 'esbuild',
      rollupOptions: {
        external: [
          'shiki/onig.wasm',
          // 注意: @sqlite.org/sqlite-wasm と sqlite3.wasm を external にすると、
          // @nuxt/content のクライアント側クエリ（検索モーダル等）で
          // 「Failed to resolve module specifier '@sqlite.org/sqlite-wasm'」に
          // なるため external にしない。wasm のアセット化は assetsInclude を想定しているが、
          // その assetsInclude は vite.build 配下にあり(Vite では vite 直下のオプション)、効いているかは未確認。
        ],
        onwarn(warning, warn) {
          // unwasm の shiki WASM 警告を抑制
          if (warning.plugin === 'unwasm' && warning.message?.includes('onig.wasm')) {
            return
          }
          warn(warning)
        },
      },
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
        },
      },
    },
    css: {
      preprocessorMaxWorkers: true,
    },
    // JS のファイル名は Nuxt 既定のハッシュ付きのままにする。固定名（_nuxt/[name].js）にすると、
    // immutable のキャッシュと PWA のプリキャッシュに旧 JS が残り、デプロイ後に旧ハッシュの CSS が 404 になる。
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        isolatedModules: false,
        useDefineForClassFields: false,
        // 未使用の import / ローカル変数を型検査で検出する(references 形式にする前の tsconfig.json が持っていた指定)。
        noUnusedLocals: true,
      },
    },
    shim: true,
  },

  postcss: {
    plugins: {
      'postcss-media-hover-any-hover': {},
      'cssnano': {
        preset: ['default', {
          discardComments: { removeAll: true },
          calc: false,
        }],
      },
    },
  },

  telemetry: false,

  hooks: {
    // options の型は @vite-pwa/nuxt の ModuleHooks から決まる(vite-plugin-pwa は直接の依存ではなく import できない)
    'pwa:beforeBuildServiceWorker': function (options) {
      const globPatterns = options.workbox.globPatterns
      const payloadPatternIndex = globPatterns?.indexOf('**/_payload.json') ?? -1

      if (payloadPatternIndex !== -1) {
        // payloadPatternIndex !== -1 のときは globPatterns が必ずある(optional chaining の結果を型が追えないだけ)
        (globPatterns as string[])[payloadPatternIndex] = '**/_payload.js'
      }
    },
  },

  // docus 5.14 から入った nuxt-agent-discovery の既定を、このサイトに合わせて切る。
  agentDiscovery: {
    robots: {
      // AI ボットごとの `Allow: /` グループを足さない。足すと下の robots.groups の
      // Disallow(/_content/ や検索結果)が AI ボットにだけ効かなくなる。5.13 以前の挙動に戻す。
      aiPolicy: false,
    },
    // skills/create-docs は docus テンプレート由来で、このサイトの訪問者向けではない。
    skills: false,
  },

  // docus は Vercel の VERCEL_OIDC_TOKEN があるだけで AI チャット(/__docus__/assistant)を有効にする。
  // このサイトでは使わないので、明示的に切る。
  docus: {
    assistant: {
      enabled: false,
    },
  },

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
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
    // @ts-expect-error `fonts.fallbacks` は型に無いキー(`fonts.defaults.fallbacks` の置き場違いの可能性)。ビルド出力を変えないため、値は触らずに残している。
    fallbacks: {
      serif: ['Noto Serif JP'],
      sans: ['Noto Sans JP'],
      monospace: ['Fira Code'],
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
    serverBundle: 'local',
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
    format: ['avif', 'webp'],
    densities: [1, 2],
    quality: 80,
    imgix: {
      baseURL: 'https://nuxtation.imgix.net/',
      // @ts-expect-error `modifiers` は imgix プロバイダのオプション型に無いキー。型には無いが効いている（2026-10-29 に URL で確認）。
      // 品質は上の `quality: 80` で付く。ここに `q: 80` も書くと URL に q が 2 つ並び、部品で quality を変えても読みにくくなるので外した
      modifiers: {
        auto: 'format,compress', // Phase 24: 自動最適化（format + compress）
        fit: 'crop', // Phase 24: トリミング最適化
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

  linkChecker: {
    failOnError: false,
    enabled: false,
    excludeLinks: [
      'https://twitter.com/muraie_jin',
    ],
  },

  nuxtIcon: {
    size: '24px',
    class: 'icon',
    color: '#000000',
  },

  ogImage: { enabled: false },

  pwa,

  robots: {
    groups: [
      {
        userAgent: ['*'],
        disallow: [
          '/_content/', // Nuxt Contentの内部APIをブロック
          '/*?query=', // 検索結果ページをブロック
          '/*?sort=', // ソート結果ページをブロック
          '/*?filter=', // フィルター結果ページをブロック
        ],
        allow: ['/'],
      },
    ],
    sitemap: `${SiteUrl}/sitemap.xml`,
  },

  schemaOrg: {
    identity: 'Person',
  },

  // nuxt-seo-utils（@nuxtjs/seo）のビルド時の縮小を止める。既定の { build: true } は、プリレンダーした HTML の
  // インラインの <style> を本文の分まで縮めるため、記事本文の shiki の <style> が HTML とペイロードで食い違い、
  // ハイドレーションの不一致（Hydration text mismatch in HTMLStyleElement）になる。実行時の縮小は既定で無効。
  seo: {
    minify: false,
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

  sitemap: {
    zeroRuntime: true, // サーバーバンドルサイズを削減
    // docus 5.14 のレイヤーが excludeAppSources: true(content だけを材料にする)を設定するようになり、
    // prerender したアプリ側のページ(blog/tags・jenre/tags など)が sitemap から消えた。既定の [] に戻す
    // (false は不可: sitemap 8.6.1 は配列か true を前提にしており `false.includes` で落ちる)。
    excludeAppSources: [],
    defaults: {
      priority: 0.5,
      changefreq: 'monthly', // デフォルトは月次更新
    },
    urls: [
      // トップページ - 最高優先度、週次更新
      {
        loc: '/',
        priority: 1.0,
        changefreq: 'weekly',
      },
      // 主要インデックスページ - 高優先度、週次更新
      {
        loc: '/blog',
        priority: 0.9,
        changefreq: 'weekly',
      },
      {
        loc: '/cat',
        priority: 0.7,
        changefreq: 'monthly',
      },
    ],
    xsl: false,
    credits: false,
    exclude: ['/_partials/**'],
    cacheMaxAgeSeconds: 10000,
  },

  twoslash: {
    // Nuxt の自動生成型を注入（デフォルト: true）
    // @ts-expect-error `injectNuxtTypes` は nuxt-content-twoslash のモジュールオプションの型に無いキー。ビルド出力を変えないため、値は触らずに残している。
    injectNuxtTypes: true,
  },
})
