// @unocss-include

import {
  defineConfig, presetAttributify, presetIcons,
  presetTypography, presetWebFonts,
  transformerDirectives, transformerVariantGroup
} from 'unocss'
import presetWind from '@unocss/preset-wind'
// import presetIcons from '@unocss/preset-icons'
// import transformerVariantGroup from '@unocss/transformer-variant-group'
// import transformerDirectives from '@unocss/transformer-directives'
import transformerCompileClass from '@unocss/transformer-compile-class'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import { presetHeroPatterns } from '@julr/unocss-preset-heropatterns'
import { presetExtra } from 'unocss-preset-extra';
import extractorMdc from '@unocss/extractor-mdc';

// const FormKitVariants = require('@formkit/themes/unocss')

export default defineConfig({
  theme: {
    breakpoints: {
      sm: '320px',
      md: '640px',
      tb: '768px',
      lg: '1024px',
      xl: '1280px',
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
      'jis-magenta': '#990'
    },
        fontSize: {
        'xxs': '0.5rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'highlight': '5rem',
        'h1': '4rem',
        'h2': '3rem',
        'h3': '2rem',
        'h4': '1.5rem',
        'h5': '1.25rem',
        'highlight_sm': '3.5rem',
        'h1_sm': '3rem',
        'h2_sm': '2.25rem',
        'h3_sm': '1.75rem',
        'h4_sm': '1.5rem',
        'h5_sm': '1.25rem'
      },
      lineHeight: {
        'xxs': '0.75rem',
        'xs': '1rem',
        'sm': '1.25rem',
        'base': '1.35rem',
        'lg': '1.45rem',
        'highlight': '5.5rem',
        'h1': '4.25rem',
        'h2': '3.25rem',
        'h3': '2.25rem',
        'h4': '1.75rem',
        'h5': '1.5rem',
        'highlight_sm': '3.75rem',
        'h1_sm': '3.25rem',
        'h2_sm': '2.5rem',
        'h3_sm': '2rem',
        'h4_sm': '1.75rem',
        'h5_sm': '1.5rem',
      },
      padding: {
        'section_x_sm': '1.5rem',
        'section_x': '5rem',
        'section_y_sm': '3rem',
        'section_y': '5rem'
      },
      spacing: {
        'nav': '120px',
        'nav_sm': '116px',
        'section_x': '5rem',
      }
     },
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
   [
      'btn-blue',
      'block mx-auto px-4 py-1 rounded bg-jis-blue/50 text-white cursor-pointer hover:bg-success disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
    ],
  ],
  presets: [
    presetWind({
      dark: 'class'
    }),
    presetAttributify(),
    presetIcons({
      // scale: 1.2,
      // warn: true,
      display: 'inline-block',
      'vertical-align': 'middle',
    }),
    presetTypography(),
    presetHeroPatterns(),
    presetExtra(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  variants: [
    // hover:
    (matcher) => {
      if (!matcher.startsWith('hover:')) return matcher
      return {
        // slice `hover:` prefix and passed to the next variants and rules
        matcher: matcher.slice(6),
        selector: (s) => `${s}:hover`,
      }
    },
  ],
  rules: [
    [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
    [/^p-([\.\d]+)$/, ([_, num]) => ({ padding: `${num}px` })],
  ],

  transformers: [transformerDirectives({
    applyVariable: ['--at-apply', '--uno-apply', '--uno'],
  }), transformerVariantGroup(),transformerCompileClass(),transformerAttributifyJsx()],
  extractors: [
    extractorMdc(),
    ],
//   safelist: 'prose prose-sm m-auto text-left'.split(' '),
	//blocklist: ['container'],
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
    }
//     './src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
    // './node_modules/@formkit/themes/dist/unocss/genesis/index.cjs',
  },
  // plugins: [FormKitVariants],
})
