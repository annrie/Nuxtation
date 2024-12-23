// @unocss-include

import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'
import presetTagify from '@unocss/preset-tagify'
import transformerCompileClass from '@unocss/transformer-compile-class'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import { presetHeroPatterns } from '@julr/unocss-preset-heropatterns'
import { presetExtra } from 'unocss-preset-extra'
import extractorMdc from '@unocss/extractor-mdc'
import { animatedUno } from 'animated-unocss'
import transformerAlias from 'unocss-transformer-alias'

// const FormKitVariants = require('@formkit/themes/unocss')

export default defineConfig({
  theme: {
    extend: {
      textShadow: {
        chrono_1: '1px 1px 0 #fff, 2px 2px 0 #999',
      },
    },
    breakpoints: {
      'sm': '320px',
      'md': '640px',
      'tb': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    colors: {
      'white': '#fefefe',
      'black': '#0a0a0a',
      'primary': '#1779ba',
      'secondary': '#767676',
      'success': '#3adb76',
      'warning': '#ffae00',
      'alert': '#cc4b37',
      'jis-red': '#ff4b00',
      'jis-orange': '"#f6aa00',
      'jis-yellow': '#f2e700',
      'jis-green': '#00b06b',
      'jis-blue': '#1971ff',
      'jis-magenta': '#990',
      'primary-50': 'rgb(var(--primary-50))',
      'primary-100': 'rgb(var(--primary-100))',
      'primary-200': 'rgb(var(--primary-200))',
      'primary-300': 'rgb(var(--primary-300))',
      'primary-400': 'rgb(var(--primary-400))',
      'primary-500': 'rgb(var(--primary-500))',
      'primary-600': 'rgb(var(--primary-600))',
      'primary-700': 'rgb(var(--primary-700))',
      'primary-800': 'rgb(var(--primary-800))',
      'primary-900': 'rgb(var(--primary-900))',
      'primary-950': 'rgb(var(--primary-950))',
      'surface-0': 'rgb(var(--surface-0))',
      'surface-50': 'rgb(var(--surface-50))',
      'surface-100': 'rgb(var(--surface-100))',
      'surface-200': 'rgb(var(--surface-200))',
      'surface-300': 'rgb(var(--surface-300))',
      'surface-400': 'rgb(var(--surface-400))',
      'surface-500': 'rgb(var(--surface-500))',
      'surface-600': 'rgb(var(--surface-600))',
      'surface-700': 'rgb(var(--surface-700))',
      'surface-800': 'rgb(var(--surface-800))',
      'surface-900': 'rgb(var(--surface-900))',
      'surface-950': 'rgb(var(--surface-950))',
    },
    fontSize: {
      xxs: '0.5rem',
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      highlight: '5rem',
      h1: '4rem',
      h2: '3rem',
      h3: '2rem',
      h4: '1.5rem',
      h5: '1.25rem',
      highlight_sm: '3.5rem',
      h1_sm: '3rem',
      h2_sm: '2.25rem',
      h3_sm: '1.75rem',
      h4_sm: '1.5rem',
      h5_sm: '1.25rem',
    },
    lineHeight: {
      xxs: '0.75rem',
      xs: '1rem',
      sm: '1.25rem',
      base: '1.35rem',
      lg: '1.45rem',
      highlight: '5.5rem',
      h1: '4.25rem',
      h2: '3.25rem',
      h3: '2.25rem',
      h4: '1.75rem',
      h5: '1.5rem',
      highlight_sm: '3.75rem',
      h1_sm: '3.25rem',
      h2_sm: '2.5rem',
      h3_sm: '2rem',
      h4_sm: '1.75rem',
      h5_sm: '1.5rem',
    },
    padding: {
      section_x_sm: '1.5rem',
      section_x: '5rem',
      section_y_sm: '3rem',
      section_y: '5rem',
    },
    spacing: {
      nav: '120px',
      nav_sm: '116px',
      section_x: '5rem',
    },
  },
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'button-blue',
      'inline-block mx-auto px-4 py-1 rounded bg-jis-blue/50 text-white dark:(text-white hover:text-dark) cursor-pointer hover:(bg-success text-dark-600)  disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 no-underline width[fit-content]',
    ],
    [/^btn-(.*)$/, ([, c]) => `btn bg-${c}4:10 text-${c}5 rounded`],
     ['flex-center', 'flex justify-center items-center'],
    ['bg-my-20', 'bg-#e5e5e5 bg-opacity-20'],
    ['flex-col-center', 'flex items-center'],
    ['flex-row-center', 'flex justify-center'],
    ['trans-all-300-ease', 'transition-all duration-300 transition-ease'],
    ['absolute-x-center', 'absolute left-1/2 -translate-x-1/2'],
    ['absolute-y-center', 'absolute top-1/2 -translate-y-1/2'],
    ['absolute-center', 'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'],
    ['absolute-0', 'absolute left-0 top-0'],
    ['hw-full', 'h-full w-full'],
    ['trans-300', 'transition-all duration-300'],
    ['trans-act-scale', 'transition-transform active:scale-99'],
    ['p-com', 'px-5 py-4'],
    ['border-com', 'dark:border-#222  border border-#e5e5e5'],
    ['bg-com', 'dark:bg-#333 bg-white'],
    ['shadow-com', 'border-t-1 border-#333 shadow-md border-op-20 dark:border-op-60 dark:shadow-#333'],
  ],
  presets: [
    presetUno({
      dark: 'class',
    }),
    presetRemToPx(),
    presetAttributify(),
    presetTagify({
      prefix: 'un-',
      extraProperties: matched => matched.startsWith('i-')
        ? { display: 'inline-block' }
        : { },
    }),
    presetIcons({
      autoInstall: true,
      // scale: 1.2,
      // warn: true,
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'align-middle',
      },
      collections: {
        carbon: async () => import('@iconify-json/carbon/icons.json').then(i => i.default),
        mdi: async () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        logos: async () => import('@iconify-json/logos/icons.json').then(i => i.default),
      },
    }),
    presetTypography(),
    presetHeroPatterns(),
    presetExtra(),
    animatedUno(),
    presetTagify({
      prefix: 'un-',
    }),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: 'Noto Sans JP',
        serif: 'Noto Serif JP',
        mono: ['DM Mono', 'Fira Code', 'Fira Mono:400,700'],
        // custom ones
        lobster: 'Lobster',
        lato: [
          {
            name: 'Lato',
            weights: ['400', '700'],
            italic: true,
          },
        ],
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  //  outputToCssLayers: true,
  variants: [
    // hover:
    (matcher) => {
      if (!matcher.startsWith('hover:'))
        return matcher
      return {
        // slice `hover:` prefix and passed to the next variants and rules
        matcher: matcher.slice(6),
        selector: s => `${s}:hover`,
      }
    },
  ],
  rules: [
    [/^m-([.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
    [/^p-([.\d]+)$/, ([_, num]) => ({ padding: `${num}px` })],
  ],

  transformers: [transformerDirectives({
    applyVariable: ['--at-apply', '--uno-apply', '--uno'],
  }), transformerVariantGroup(), transformerCompileClass(), transformerAttributifyJsx()],
  extractors: [
    extractorMdc(),
  ],
  //   safelist: 'prose prose-sm m-auto text-left'.split(' '),
  // blocklist: ['container'],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        'src/**/*.{js,ts}',
      ],
      // exclude files
      // exclude: []
    },
    //     './src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
    // './node_modules/@formkit/themes/dist/unocss/genesis/index.cjs',
  },
})
