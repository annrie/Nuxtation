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
//     colors: {
//       'white': '#fefefe',
//       'black': '#0a0a0a',
//       'primary': '#1779ba',
//       'secondary': '#767676',
//       'success': '#3adb76',
//       'warning': '#ffae00',
//       'alert': '#cc4b37',
//       'jis-red': '#ff4b00',
//       'jis-orange': '"#f6aa00',
//       'jis-yellow': '#f2e700',
//       'jis-green': '#00b06b',
//       'jis-blue': '#1971ff',
//       'jis-magenta': '#990'
//     },
    // backgroundColor: (theme) => ({
    //   ...theme('colors'),
    //   'white': '#fefefe',
    //   'black': '#0a0a0a',
    //   'red': '#ff4b00', // rgb (255,75,0)
    //   'orange': '#f6aa00', // rgb (246,170,0)
    //   'yellow': '#f2e700', // rgb (242,231,0)
    //   'green': '#00b06b', // rgb (0,176,107)
    //   'blue': '#1971ff', //  rgb (25,113,255)
    //   'magenta': '#990', // rgb (153,0,153)
    //   'main': '#42b883',
    //   'primary': '#1779ba',
    //   'secondary': '#767676',
    //   'success': '#3adb76',
    //   'warning': '#ffae00',
    //   'alert': '#cc4b37',
    // }),
  },
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
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
  rules: [[/^m-(\d)$/, ([, d]) => ({margin: `${d / 4}rem`})]],
  transformers: [transformerDirectives({
    applyVariable: ['--at-apply', '--uno-apply', '--uno'],
  }), transformerVariantGroup(),transformerCompileClass(),transformerAttributifyJsx()],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
	blocklist: ['container'],
  content: [
    './src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
    // './node_modules/@formkit/themes/dist/unocss/genesis/index.cjs',
  ],
  // plugins: [FormKitVariants],
})
