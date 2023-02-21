import {transform} from 'windicss/helpers'
// import formsPlugin from 'windicss/plugin/forms'
import {defineConfig} from 'vite-plugin-windicss'

import colors from 'windicss/colors'
import typography from 'windicss/plugin/typography'
import plugin from 'windicss/plugin'
import scrollSnapPlugin from 'windicss/plugin/scroll-snap'

// function range(size, startAt = 1) { // for safelist
//   return Array.from(Array(size).keys()).map((i) => i + startAt)
// }

// const formKitWindi = require('@formkit/themes/windicss')
// const formsPlugin = require('windicss/plugin/forms')

export default defineConfig({
  extract: {
    include: ['**/*.{vue,html,jsx,tsx,ts}'],
    exclude: [
      'node_modules',
      '.git',
      'excluded',
      'dist',
      'windi.config.{ts,js}',
      'tailwind.config.{ts,js}',
    ],
  },
  attributify: true,
  darkMode: 'class',
  transformCSS: 'pre',
  safelist: 'select-none', // [
  // range(3).map((i) => `p-${i}`), // p-1 to p-3
  // range(10).map((i) => `mt-${i}`), // mt-1 to mt-10
  // ],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '2rem',
        tb: '3rem',
        lg: '4rem',
        xl: '5rem',
        xxl: '6rem',
        '2xl': '6rem',
      },
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
      red: '#ff4b00', // rgb (255,75,0)
      orange: '#f6aa00', // rgb (246,170,0)
      yellow: '#f2e700', // rgb (242,231,0)
      green: '#00b06b', // rgb (0,176,107)
      blue: '#1971ff', //  rgb (25,113,255)
      magenta: '#990', // rgb (153,0,153)
      main: '#42b883',
      primary: '#1779ba',
      secondary: '#767676',
      success: '#3adb76',
      warning: '#ffae00',
      alert: '#cc4b37',
    }),
    objectPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top',
      'center-bottom': 'center bottom',
      'center-top': 'center top',
    },
    dropShadow: {
      base: 'drop-shadow(3px 3px 6px rgba(#d9e6bd, 0.63))',
      hover: 'drop-shadow(3px 3px 24px rgba(#d9e6bd, 0.9))',
    },
    boxShadow: {
      'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // If a DEFAULT shadow is provided, it will be used for the non-suffixed shadow utility.
      'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'tb': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      'xxl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      'outer': '0 4px 16px 0 rgba(0,0,0,0.2)',
      'none': 'none',
    },
    extend: {
      screens: {
        sm: '320px',
        md: '640px',
        tb: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1536px',
        '2xl': '1536px',
      },
      fontFamily: {
        header: ['Inter'],
        sans: ['\'Noto Sans JP\'', '\'Hiragino Sans\'','DM Sans','system-ui', 'sans'],
        // sans: ['ui-sans-serif', 'system-ui', 'sans'],
        // sans: ['ui-sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans].join(','),
        serif: ['\'Noto Serif JP\'', 'DM Serif Display', 'メイリオ', 'Meiryo', 'sans-serif'],
        // ...(defaultTheme.fontFamily.sans - serif),
        mono: ['ui-monospace', 'DM Mono', 'SFMono-Regular', 'monospace'],
        display: ['Open Sans','Oswald'],
        // body: ['\'Open Sans\'', 'sans-serif'],
        body: ['\'Noto Sans JP\'',  'sans-serif'],
      },
      colors: {
        main: '#42b883',
        blue: colors.sky,
        red: colors.rose,
        pink: colors.fuchsia,
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      outline: {
        main: ['2px solid #42b88', '6px'],
      },
      lineHeight: {
        narrow: '1.4',
        just: '1.6',
      },
    },
  },
  shortcuts: {
    'hstack': 'flex items-center',
    'vstack': 'flex flex-col',
    'gstack': 'grid place-items-center',
    'icon': 'w-6 h-6 fill-current text-pink-600 bg-current dark:bg-sky-100 text-light-500',
    'app-border': 'border-gray-200 dark:border-dark-300',
    'app-modal': 'fixed top-0 w-full h-full z-50 bg-white bg-opacity-70 blur-5 shadow-lg',
  },

  // plugins: [formsPlugin, formKitWindi],
  plugins: [
    scrollSnapPlugin,
    // formsPlugin,
    // formKitWindi,
    require('@windicss/plugin-animations')({
      settings: {
        animatedSpeed: 1000,
        heartBeatSpeed: 1000,
        hingeSpeed: 2000,
        bounceInSpeed: 750,
        bounceOutSpeed: 750,
        animationDelaySpeed: 1000,
      },
    }),
    require('windicss/plugin/filters'),
    require('windicss/plugin/forms'),
    require('windicss/plugin/aspect-ratio'),
    require('windicss/plugin/line-clamp'),
    require('windicss/plugin/typography')({
      dark: true,
      modifiers: ['sm', 'md', 'tb', 'lg', 'xl', 'xxl'],
    }),
    require('@windicss/plugin-heropatterns')({
      // the list of patterns you want to generate a class for
      // the names must be in kebab-case
      // an empty array will generate all 87 patterns
      patterns: [],

      // The foreground colors of the pattern
      colors: {
        default: '#dfdbe5',
        'blue-dark': '#000044', //also works with rgb(0,0,205)
      },

      // The foreground opacity
      opacity: {
        default: '0.4',
        '100': '1.0',
      },
    }),
    plugin(({addUtilities}) => {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)',
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
        '.skew-31deg': {
          transform: 'skewX(-31deg)',
        },
      }
      addUtilities(newUtilities)
    }),
    plugin(({addComponents}) => {
      const buttons = {
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
        },
        '.btn-blue': {
          backgroundColor: '#3490dc',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2779bd',
          },
        },
        '.btn-red': {
          backgroundColor: '#e3342f',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a',
          },
        },
        // '.banner': {
        //   display: 'block',
        //   color: '#0a0a0a',
        //   backgroundColor: '#fefefe',
        //   padding: '.5rem 1rem',
        //   borderRadius: '.25rem',
        //   fontWeight: '700',
        //   height: '150px',
        //   width: '487px',
      }
      // },
      addComponents(buttons)
      // },
    }),
    plugin(({addDynamic, variants}) => {
      addDynamic(
        'skew',
        ({Utility, Style}) => {
          return Utility.handler
            .handleStatic(Style('skew'))
            .handleNumber(0, 360, 'int', (number) => `skewY(-${number}deg)`)
            .createProperty('transform')
        },
        variants('skew')
      )
    }),
  ],
})
