export default defineAppConfig({
  seo: {
    title: 'Nuxtation',
    description: 'Nuxt 4で構築したブログサイトです。',
  },
  header: {
    title: 'Nuxtation',
    logo: {
      light: '/logo.svg',
      dark: '/logo.svg',
      alt: 'Nuxtation',
    },
    links: [
      {
        label: 'トップ',
        to: '/',
      },
      {
        label: 'ブログ',
        to: '/blog',
      },
      {
        label: 'Cats',
        to: '/cat',
      },
    ],
  },
  ui: {
    // Nuxt UI のカラーエイリアス。値には「Tailwind の色名」を渡す。
    // hex を直接渡すと var(--color-#xxxxxx-500) という不正な CSS になる。
    colors: {
      primary: 'emerald',
      secondary: 'purple',
      neutral: 'slate',
      tertiary: 'indigo',
    },
    // 記事本文（prose）のスタイル。
    // ContentRenderer が描画する Nuxt UI v4 の Prose コンポーネントを
    // tailwind-variants の仕組みで上書きするのが v4 の作法。
    // 生 CSS を後から !important で被せる形にはしない。
    // 色は app/assets/css/tailwind.css の --color-prose-* を参照
    // （.dark で値が入れ替わるので dark: バリアントは不要）。
    //
    // 注意: Nuxt UI に ProseH5 / ProseH6 は存在しないため、
    // h5 / h6 は prose.css 側で素の要素として指定している。
    prose: {
      h1: { slots: { base: 'mt-8 mb-4 text-4xl leading-[1.2] font-extrabold text-prose-heading' } },
      h2: { slots: { base: 'mt-8 mb-4 pb-2 text-3xl leading-[1.3] font-bold text-prose-heading-2 border-b-2 border-prose-rule' } },
      h3: { slots: { base: 'mt-6 mb-3 text-2xl leading-[1.4] font-semibold text-prose-heading-3' } },
      h4: { slots: { base: 'mt-6 mb-3 text-xl leading-[1.4] font-semibold text-prose-heading-4' } },
      p: { base: 'my-4 leading-[1.75]' },
      a: { base: 'text-prose-link hover:text-prose-link-hover border-b-0 underline decoration-1 underline-offset-2' },
      ul: { base: 'my-4 ps-6 list-disc' },
      ol: { base: 'my-4 ps-6 list-decimal' },
      li: { base: 'my-2 leading-[1.75]' },
      blockquote: { base: 'my-6 ps-4 italic border-s-4 border-prose-quote-border text-prose-quote-text' },
      hr: { base: 'my-8 border-t border-prose-rule' },
      img: { slots: { base: 'my-6 h-auto max-w-full rounded-lg' } },
      table: { slots: { root: 'my-6', base: 'w-full border-collapse' } },
      th: { base: 'px-4 py-3 bg-prose-th-bg border border-prose-table-rule' },
      td: { base: 'px-4 py-3 border border-prose-table-rule' },
      // インラインコード（既定バリアントは color="neutral"）
      code: {
        variants: {
          color: {
            neutral: 'border-0 bg-prose-code-bg text-prose-code-text font-semibold',
          },
        },
      },
      pre: {
        slots: {
          root: 'my-6',
          base: 'rounded-lg leading-[1.7] bg-prose-pre-bg text-prose-pre-text border-prose-rule [tab-size:2]',
          // コピーボタン（UButton variant="outline"）の ring を消す。
          // focus-visible:outline-3 は残るのでフォーカス表示は失われない。
          copy: 'ring-0',
        },
      },
      codeCollapse: {
        slots: {
          trigger: 'px-4 py-2 rounded-md border-0 font-medium opacity-50 transition-colors bg-prose-collapse-bg text-prose-collapse-text hover:bg-prose-collapse-bg-hover hover:opacity-100',
        },
      },
    },
    icons: {
      arrowDown: 'i-lucide-arrow-down',
      arrowLeft: 'i-lucide-arrow-left',
      arrowRight: 'i-lucide-arrow-right',
      arrowUp: 'i-lucide-arrow-up',
      caution: 'i-lucide-circle-alert',
      check: 'i-lucide-check',
      chevronDoubleLeft: 'i-lucide-chevrons-left',
      chevronDoubleRight: 'i-lucide-chevrons-right',
      chevronDown: 'i-lucide-chevron-down',
      chevronLeft: 'i-lucide-chevron-left',
      chevronRight: 'i-lucide-chevron-right',
      chevronUp: 'i-lucide-chevron-up',
      close: 'i-lucide-x',
      copy: 'i-lucide-copy',
      copyCheck: 'i-lucide-copy-check',
      dark: 'i-lucide-moon',
      ellipsis: 'i-lucide-ellipsis',
      error: 'i-lucide-circle-x',
      external: 'i-lucide-arrow-up-right',
      eye: 'i-lucide-eye',
      eyeOff: 'i-lucide-eye-off',
      file: 'i-lucide-file',
      folder: 'i-lucide-folder',
      folderOpen: 'i-lucide-folder-open',
      hash: 'i-lucide-hash',
      info: 'i-lucide-info',
      light: 'i-lucide-sun',
      loading: 'i-lucide-loader-circle',
      menu: 'i-lucide-menu',
      minus: 'i-lucide-minus',
      panelClose: 'i-lucide-panel-left-close',
      panelOpen: 'i-lucide-panel-left-open',
      plus: 'i-lucide-plus',
      reload: 'i-lucide-rotate-ccw',
      search: 'i-lucide-search',
      stop: 'i-lucide-square',
      success: 'i-lucide-circle-check',
      system: 'i-lucide-monitor',
      tip: 'i-lucide-lightbulb',
      upload: 'i-lucide-upload',
      warning: 'i-lucide-triangle-alert',
    },
  },
  search: {
    placeholder: '検索...',
    button: {
      label: '検索',
      icon: 'i-heroicons-magnifying-glass',
      color: 'neutral',
      variant: 'ghost',
    },
  },
  github: {
    url: 'https://github.com/annrie/nuxtation',
  },
})
