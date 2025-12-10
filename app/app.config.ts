export default defineAppConfig({
  seo: {
    title: 'Nuxtation',
    description: 'Nuxt 4で構築したブログサイトです。'
  },
  header: {
    title: 'Nuxtation',
    logo: {
      light: '/logo.svg',
      dark: '/logo.svg',
      alt: 'Nuxtation'
    },
    links: [
      {
        label: 'トップ',
        to: '/'
      },
      {
        label: 'ブログ',
        to: '/blog'
      },
      {
        label: 'Cats',
        to: '/cat'
      }
    ]
  },
  ui: {
    colors: {
      primary: 'emerald',
      secondary: 'purple',
      neutral: 'slate',
      tertiary: 'indigo'
    },
    button: {
      color: {
        blogBlue: {
          solid: 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 border-none transition-all duration-200'
        },
        blogGreen: {
          solid: 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white dark:text-slate-900 shadow-md hover:shadow-xl hover:-translate-y-0.5 border-none transition-all duration-200'
        },
        featuredCta: {
          solid: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 border-none transition-all duration-200 rounded-full'
        },
        tag: {
          solid: 'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-900 dark:text-blue-100 border border-blue-300/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md'
        }
      },
      variant: {
      }
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
      warning: 'i-lucide-triangle-alert'
    }
  },
  search: {
    placeholder: '検索...',
    button: {
      label: '検索',
      icon: 'i-heroicons-magnifying-glass',
      color: 'neutral',
      variant: 'ghost'
    }
  },
  github: {
    url: 'https://github.com/annrie/nuxtation'
  }
})
