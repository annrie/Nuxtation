// @unocss-include
// https://coding-memo.work/development/2704/
import { mergeConfigs } from '@unocss/core'
import config from './.nuxt/uno.config.mjs'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'
import presetTagify from '@unocss/preset-tagify'
import transformerCompileClass from '@unocss/transformer-compile-class'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import { presetHeroPatterns } from '@julr/unocss-preset-heropatterns'
import { presetExtra } from 'unocss-preset-extra'
import extractorMdc from '@unocss/extractor-mdc'
import { animatedUno } from 'animated-unocss'
import transformerAlias from 'unocss-transformer-alias'

// const FormKitVariants = require('@formkit/themes/unocss')

function convert(color: string) {
  return `color-mix(in srgb, ${color} oklch(100% * %alpha), transparent)`
}
//
function makeColorPalette(color) {
  return {
    50: `color-mix(in srgb, ${color} 5%, white)`,
    100: `color-mix(in srgb, ${color} 10%, white)`,
    200: `color-mix(in srgb, ${color} 30%, white)`,
    300: `color-mix(in srgb, ${color} 50%, white)`,
    400: `color-mix(in srgb, ${color} 70%, white)`,
    500: color,
    600: `color-mix(in srgb, ${color} 70%, black)`,
    700: `color-mix(in srgb, ${color} 50%, black)`,
    800: `color-mix(in srgb, ${color} 30%, black)`,
    900: `color-mix(in srgb, ${color} 10%, black)`,
  }
}

//ブレイクポイント（min-width）の設定
const BREAKPOINT_MIN_WIDTH_SM = 375;
const BREAKPOINT_MIN_WIDTH_MD = 640;
const BREAKPOINT_MIN_WIDTH_TB = 768; //782pxはWordPress（ブロックエディタ）のブレイクポイント, 768pxから変更
const BREAKPOINT_MIN_WIDTH_LG = 1024;
const BREAKPOINT_MIN_WIDTH_XL = 1440;
const BREAKPOINT_MIN_WIDTH_2XL = 1600;

// 1remあたりのピクセル値（通常16pxを仮定）（clampやrem変換の計算で用いる）
const REM_BASE = 16;

// clamp計算に用いるビューポートの最小値と最大値の基準設定
const VIEWPORT_MIN_WIDTH = BREAKPOINT_MIN_WIDTH_TB;
const VIEWPORT_MAX_WIDTH = BREAKPOINT_MIN_WIDTH_XL;
/*
 * clamp関数の計算を行う関数
 * @param {string} minValue - 描画する最小値
 * @param {string} maxValue - 描画する最大値
 * @return {string} - 計算結果
 */
function calculateClamp(minValue: string, maxValue: string): string {
  const minVal = Number(minValue);
  const maxVal = Number(maxValue);
  const minValueRem = (minVal / REM_BASE).toFixed(3); // remに変換
  const maxValueRem = (maxVal / REM_BASE).toFixed(3); // remに変換

  const slope = (maxVal - minVal) / (VIEWPORT_MAX_WIDTH - VIEWPORT_MIN_WIDTH);
  const yIntercept = minVal - slope * VIEWPORT_MIN_WIDTH;
  const slopeVw = (slope * 100).toFixed(3); // vwに変換

  const yInterceptRem = (yIntercept / REM_BASE).toFixed(3); // remに変換

  return `clamp(${minValueRem}rem, ${yInterceptRem}rem + ${slopeVw}vw, ${maxValueRem}rem)`;
}

/*
 * 小数点切り捨て関数
 * @param {number} number - 計算する値
 * @param {number} digit - 小数点第何位まで残すか
 * @return {number} - 計算結果
 */
function truncate_decimal(number: number, digit: number = 3): number {
  return Math.floor(number * Math.pow(10, digit)) / Math.pow(10, digit);
}

/*
 * vw計算を行う関数
 * @param {string} number - 計算する値
 * @param {number} base - 基準となる値
 * @return {string} - 計算結果vw
 */
function calculateVw(number: string, base: number): string {
  const result = (Number(number) / base) * 100;
  return `${truncate_decimal(result)}vw`;
}

/*
 * プロパティ名と値を取得する関数
 * @param {array} propertyNames - プロパティ名の配列
 * @param {string} value - 設定する値
 * @param {object} initialValue - 固定で設定するプロパティルール
 * @return {object} - プロパティルールを内包したオブジェクト
 */
function getPropertyNames(propertyNames: string[], value: string, initialValue: Record<string, string>): Record<string, string> {
  return propertyNames.reduce(
    (acc, propertyName) => {
      acc[propertyName] = value;
      return acc;
    },
    { ...initialValue }
  );
}

/*
 * プロパティルールを一括設定する関数
 * @param {string} prefix - class名の接頭辞
 * @param {string} propertyNames - 値を設定するプロパティ名の配列
 * @param {object} initialValue - 【任意】固定で設定するプロパティルール
 * @return {array} - プロパティルールを内包した配列
 */
function setProperty(prefix: string, propertyNames: string[], initialValue: Record<string, string> = {}): Array<[RegExp, (match: RegExpMatchArray) => Record<string, string>]> {
  return [
    //px設定 -[設定値]　例) mt-10
    [new RegExp(`^${prefix}-(\\d+)$`), ([, d]) => getPropertyNames(propertyNames, `${d}px`)],

    //rem変換（px to rem） -[設定値]ptr　例) mt-20ptr
    [new RegExp(`^${prefix}-(\\d+)ptr$`), ([, d]) => getPropertyNames(propertyNames, `${Number(d) / REM_BASE}rem`)],

    //em変換 -[設定値]em　例) mt-1.5em
    [new RegExp(`^${prefix}-(\\d+(\\.\\d+)?)em$`), ([, d]) => getPropertyNames(propertyNames, `${d}em`)],
    //em変換 -[設定値]/[基準値]em　例) mt-16/20em
    [
      new RegExp(`^${prefix}-(\\d+)/(\\d+)em$`),
      ([, d1, d2]) => {
        const result = Number(d1) / Number(d2);
        return getPropertyNames(propertyNames, `${truncate_decimal(result)}em`);
      }
    ],

    //%変換 -[設定値]per　例) mt-1.5per
    [new RegExp(`^${prefix}-(\\d+(\\.\\d+)?)per$`), ([, d]) => getPropertyNames(propertyNames, `${d}%`)],
    //%変換 -[分子]/[分母]per　例) mt-10/100per
    [
      new RegExp(`^${prefix}-(\\d+)/(\\d+)per$`),
      ([, d1, d2]) => {
        const result = (Number(d1) / Number(d2)) * 100;
        return getPropertyNames(propertyNames, `${truncate_decimal(result)}%`);
      }
    ],

    //vw変換（px to vw）（基準：BREAKPOINT_MIN_WIDTH_XS） -[設定値]ptvw　例) mt-20ptvw
    [
      new RegExp(`^${prefix}-(\\d+)ptvw$`),
      ([, d]) => {
        return getPropertyNames(propertyNames, calculateVw(d, BREAKPOINT_MIN_WIDTH_SM));
      }
    ],

    //vw変換（px to vw）（基準：BREAKPOINT_MIN_WIDTH_SM） -[設定値]ptvw-sm　例) mt-20ptvw-sm
    [
      new RegExp(`^${prefix}-(\\d+)ptvw-sm$`),
      ([, d]) => {
        return getPropertyNames(propertyNames, calculateVw(d, BREAKPOINT_MIN_WIDTH_MD));
      }
    ],

    //vw変換（px to vw）（基準：BREAKPOINT_MIN_WIDTH_MD） -[設定値]ptvw-md　例) mt-20ptvw-md
    [
      new RegExp(`^${prefix}-(\\d+)ptvw-md$`),
      ([, d]) => {
        return getPropertyNames(propertyNames, calculateVw(d, BREAKPOINT_MIN_WIDTH_TB));
      }
    ],

    //vw変換（px to vw）（基準：BREAKPOINT_MIN_WIDTH_LG） -[設定値]ptvw-lg　例) mt-20ptvw-lg
    [
      new RegExp(`^${prefix}-(\\d+)ptvw-lg$`),
      ([, d]) => {
        return getPropertyNames(propertyNames, calculateVw(d, BREAKPOINT_MIN_WIDTH_LG));
      }
    ],

    //vw変換（px to vw）（基準：BREAKPOINT_MIN_WIDTH_XL） -[設定値]ptvw-xl　例) mt-20ptvw-xl
    [
      new RegExp(`^${prefix}-(\\d+)ptvw-xl$`),
      ([, d]) => {
        return getPropertyNames(propertyNames, calculateVw(d, BREAKPOINT_MIN_WIDTH_XL));
      }
    ],

    //clamp変換 -clamp-[最小]-[最大]　例) mt-clamp-10-20
    [
      new RegExp(`^${prefix}-clamp-(\\d+)-(\\d+)$`),
      ([, d1, d2]) => {
        return getPropertyNames(propertyNames, `${calculateClamp(d1, d2)}`);
      }
    ]
  ];
}

export default mergeConfigs([config, {
  theme: {
//    extend: {
//      textShadow: {
//        chrono_1: '1px 1px 0 #fff, 2px 2px 0 #999',
//      },
//    },
    breakpoint: {
      sm: BREAKPOINT_MIN_WIDTH_SM + 'px',
      md: BREAKPOINT_MIN_WIDTH_MD + 'px',
      tb: BREAKPOINT_MIN_WIDTH_TB + 'px',
      lg: BREAKPOINT_MIN_WIDTH_LG + 'px',
      xl: BREAKPOINT_MIN_WIDTH_XL + 'px',
      '2xl': BREAKPOINT_MIN_WIDTH_2XL + 'px',
    },
    colors: {
      black: {
        DEFAULT: '#0a0a0a'
      },
      white: {
        DEFAULT: '#fefefe'
      },

      'whiteex':
      makeColorPalette('#fefefe'),
      'blackex':
      makeColorPalette('#0a0a0a'),
      'primaryex':
      makeColorPalette('#1779ba'),
      'secondaryex':
      makeColorPalette('#767676'),
      'successex':
      makeColorPalette('#3adb76'),
      'warningex':
      makeColorPalette('#ffae00'),
      'alertex':
      makeColorPalette('#cc4b37'),
      'jisredex':
      makeColorPalette('#ff4b00'),
      'jisorangeex':
      makeColorPalette('#f6aa00'),
      'jisyellowex':
      makeColorPalette('#f2e700'),
      'jisgreenex':
      makeColorPalette('#00b06b'),
      'jisblueex':
      makeColorPalette('#1971ff'),
      'jismagentaex':
      makeColorPalette('#990'),
      'sf': makeColorPalette('#2563eb'),
      'adv': makeColorPalette('#690'),
      'mys': makeColorPalette('#ed181e'),
      'horror': makeColorPalette('#0a0a0a'),
      'jedi': makeColorPalette('#4b5563'),
      'short': makeColorPalette('#84cc16'),
      'primary-head': convert('#1779ba'),
      'secondary': convert('#767676'),
      'success': convert('#3adb76'),
      'warning': convert('#ffae00'),
      'alert': convert('#cc4b37'),
      'jis-red': convert('#ff4b00'),
      'jis-orange': convert('#f6aa00'),
      'jis-yellow': convert('#f2e700'),
      'jis-green': convert('#00b06b'),
      'jis-blue': convert('#1971ff'),
      'jis-magenta': convert('#990'),
      'primary': convert('var(--p-primary-color)'),
      'primary-emphasis': convert('var(--p-primary-hover-color)'),
      'primary-emphasis-alt': convert('var(--p-primary-active-color)'),
      'primary-contrast': convert('var(--p-primary-contrast-color)'),
      'primary-50': convert('var(--p-primary-50)'),
      'primary-100': convert('var(--p-primary-100)'),
      'primary-200': convert('var(--p-primary-200)'),
      'primary-300': convert('var(--p-primary-300)'),
      'primary-400': convert('var(--p-primary-400)'),
      'primary-500': convert('var(--p-primary-500)'),
      'primary-600': convert('var(--p-primary-600)'),
      'primary-700': convert('var(--p-primary-700)'),
      'primary-800': convert('var(--p-primary-800)'),
      'primary-900': convert('var(--p-primary-900)'),
      'primary-950': convert('var(--p-primary-950)'),
      'surface-0': convert('var(--p-surface-0)'),
      'surface-50': convert('var(--p-surface-50)'),
      'surface-100': convert('var(--p-surface-100)'),
      'surface-200': convert('var(--p-surface-200)'),
      'surface-300': convert('var(--p-surface-300)'),
      'surface-400': convert('var(--p-surface-400)'),
      'surface-500': convert('var(--p-surface-500)'),
      'surface-600': convert('var(--p-surface-600)'),
      'surface-700': convert('var(--p-surface-700)'),
      'surface-800': convert('var(--p-surface-800)'),
      'surface-900': convert('var(--p-surface-900)'),
      'surface-950': convert('var(--p-surface-950)'),
    },
    font: {
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
    leading: {
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
    font: {
      'sans': '"Noto Serif JP", "Hiragino Sans", メイリオ, Meiryo, sans',
      'serif': '"Roboto", "Noto Sans Japanese", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Open Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
      'mono': '"Fira Code", "Fira Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      'en': '"Source Sans Pro", Lato, Lobster, sans',
    },
    //transitionのイージング設定（Tailwind CSSでは transitionTimingFunction）
    ease: {
      DEFAULT: 'cubic-bezier(.16,1,.3,1)'
    },
    //transitionのアニメーション時間設定（Tailwind CSSでは transitionDuration）
    duration: {
      DEFAULT: '0.8s'
    },
    animation: {
      keyframes: {
        'custom-anime': `{
          /* タイムラインをここに記述 */
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }`
      },
      //animation-duration
      durations: {
        'custom-anime': '0.8s'
      },
      //animation-timing-function
      timingFns: {
        'custom-anime': 'cubic-bezier(.16,1,.3,1)'
      },
      //animation-delay
      counts: {
        'custom-anime': 0
      },
      //animation設定を自分で定義する
      properties: {
        'custom-anime02': {
          //ここに書いたanimation設定がそのまま出力される
          animation: '3s ease-in 1s 2 reverse both paused custom-anime02'
        }
      },
    },
  },
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'button-blue',
      'inline-block mx-auto px-4 py-1 rounded bg-blue-500 text-white dark:(text-white hover:text-dark) cursor-pointer hover:(bg-success text-dark-600)  disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 no-underline width[fit-content]',
    ],
    [/^btn-(.*)$/, ([, c], { theme }) => {
    if (Object.keys(theme.colors).includes(c))
      return `py-2 px-4 border-1 border-${c}-600 bg-${c}-300 hover:bg-${c}-400 rounded-lg shadow-md`
  }],
  ],
  layers: {
    "components": -1,
    "default": 1,
    "utilities": 2,
    "my-layer": 3,
  },
  presets: [
    presetWind4({
      preflights:  {
        reset: true,
      },
      theme: {
        mode: 'on-demand', // Default by 'on-demand'
        process: createRemToPxProcessor(),
      },
//      dark: 'class',
    }),
    //presetRemToPx(),
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
        'vertical-align': 'middle',
      },
      collections: {
        carbon: async () => import('@iconify-json/carbon/icons.json').then(i => i.default),
        mdi: async () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        logos: async () => import('@iconify-json/logos/icons.json').then(i => i.default),
      },
       customizations: {
           customize: (defaultCustomizations, data, name) => {
               // Make icon square
               const width = data.width ?? 16;
               const height = data.height ?? 16;
               if (height > width) {
                 // Set width to match height
                 data.width = height;
                 // Center icon horizontally by changing viewBox left position
                 data.left = (data.left ?? 0) - (height - width) / 2;
               }

               return defaultCustomizations

               if (name === 'twemoji:blue-square') {
                   // Turn blue square into red square
                   data.body = data.body.replaceAll('#55ACEE', '#e83933')
               }

               return defaultCustomizations
           },
       }
    }),
    presetTypography(),
    presetHeroPatterns(),
    presetExtra(),
    animatedUno(),
    presetWebFonts({
      themeKey: 'font',
      provider: 'none',
      fonts: {
        sans: 'Noto Sans JP',
        serif: 'Noto Serif JP',
        dm: [
          {
            name: 'DM Mono',
            weights: ['400', '700'],
            italic: true
          },
          {
            name: 'mono',
            provider: 'none',
          },
        ],
        mono: ['Fira Code', 'Fira Mono:400,700'],
        lobster:[
          {
            name: 'lobster',
            weights: ['400', '700'],
            italic: true,
          },
        ],
        lato: [
          {
            name: 'Lato',
            weights: ['400', '700'],
            italic: true,
          },
          {
            name: 'sans-serif',
            provider: 'none',
          },
        ],
        crimson:[
          {
            name: 'crimson pro',
            weights: ['400', '700'],
            italic: true,
          },
        ],
        inter: [
          {
            name: 'inter',
            weights: ['400', '700'],
            italic: true,
          },
        ],
        merriweather:[
          {
            name: 'Merriweather-Black',
            weights: ['400', '700'],
            italic: true,
          },
        ],
        raleway: [
          {
            name: 'Raleway',
            weights: ['400', '700'],
            italic: true,
          },
        ],
        roboto: [
          {
            name: 'Roboto',
            weights: ['400', '700'],
            italic: true
          },
          {
            name: 'sans-serif',
            provider: 'none',
          },
        ],
      },
      processors: createLocalFontProcessor({
        // Directory to cache the fonts
        cacheDir: 'node_modules/.cache/unocss/fonts',

        // Directory to save the fonts assets
        fontAssetsDir: 'public/fonts',

        // Base URL to serve the fonts from the client
        fontServeBaseUrl: '/fonts'
      }),
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
    //各数値変換設定を一括指定
    //margin
    ...setProperty('m', ['margin']),
    ...setProperty('mt', ['margin-top']),
    ...setProperty('mr', ['margin-right']),
    ...setProperty('mb', ['margin-bottom']),
    ...setProperty('ml', ['margin-left']),
    ...setProperty('mx', ['margin-inline']),
    ...setProperty('my', ['margin-block']),

    //padding
    ...setProperty('p', ['padding']),
    ...setProperty('pt', ['padding-top']),
    ...setProperty('pr', ['padding-right']),
    ...setProperty('pb', ['padding-bottom']),
    ...setProperty('pl', ['padding-left']),
    ...setProperty('px', ['padding-inline']),
    ...setProperty('py', ['padding-block']),

    //font-size
    ...setProperty('text', ['font-size']),

    //gap
    ...setProperty('gap', ['gap']),
    ...setProperty('gap-x', ['column-gap']),
    ...setProperty('gap-y', ['row-gap']),

    //height
    ...setProperty('h', ['height']),
    ...setProperty('min-h', ['min-height']),
    ...setProperty('max-h', ['max-height']),

    //width
    ...setProperty('w', ['width']),
    ...setProperty('min-w', ['min-width']),
    ...setProperty('max-w', ['max-width']),

    //border-width
    ...setProperty('border', ['border-width']),
    ...setProperty('border-t', ['border-top-width']),
    ...setProperty('border-r', ['border-right-width']),
    ...setProperty('border-b', ['border-bottom-width']),
    ...setProperty('border-l', ['border-left-width']),

    //border-radius
    ...setProperty('rounded', ['border-radius']),
    ...setProperty('rounded-t', ['border-top-left-radius', 'border-top-right-radius']),
    ...setProperty('rounded-r', ['border-top-right-radius', 'border-bottom-right-radius']),
    ...setProperty('rounded-b', ['border-bottom-right-radius', 'border-bottom-left-radius']),
    ...setProperty('rounded-l', ['border-top-left-radius', 'border-bottom-left-radius']),
    ...setProperty('rounded-tl', ['border-top-left-radius']),
    ...setProperty('rounded-tr', ['border-top-right-radius']),
    ...setProperty('rounded-br', ['border-bottom-right-radius']),
    ...setProperty('rounded-bl', ['border-bottom-left-radius']),

    //top
    ...setProperty('top', ['top']),
    //right
    ...setProperty('right', ['right']),
    //bottom
    ...setProperty('bottom', ['bottom']),
    //left
    ...setProperty('left', ['left']),
    //inset
    ...setProperty('inset', ['inset']),

    //translate Y ※固定で入れたい値がある場合は第3引数にオブジェクトを追加する
    ...setProperty('translate-y', ['--un-translate-y'], {
      transform: 'translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))'
    }),
    //translate X ※固定で入れたい値がある場合は第3引数にオブジェクトを追加する
    ...setProperty('translate-x', ['--un-translate-x'], {
      transform: 'translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))'
    }),

    [/^lh-(\d+(\.\d+)?)$/, ([, d]) => ({ 'line-height': d })],
    //letter-spacing 例) tracking-100 => letter-spacing: 0.1em
    [/^tracking-(\d+)$/, ([, d]) => ({ 'letter-spacing': `${Number(d) / 1000}em` })],
    [
      /^hover-opacity$/,
      function* ([], { symbols }) {
        //1件目の設定がhover-opacityに直接設定される
        yield {
          transition: 'opacity ${config.theme.duration.DEFAULT} ${config.theme.easing.DEFAULT}',
          //設定したいプロパティが複数ある場合は続けて書く
          display: 'block',
        };
        //2件目以降は増やしたい設定の数だけ yield を追加していく
        yield {
          //${selector}に.hover-opacity が入るので任意のセレクタを追記する
          [symbols.selector]: (selector) => `${selector}:hover`,
          //設定したいプロパティ
          opacity: 0.7,
        };
        yield {
          [symbols.selector]: (selector) => `${selector}::before`,
          content: '""',
          //設定したいプロパティが複数ある場合は続けて書く
          display: 'block',
        };
      }
    ],
  ],

  transformers: [transformerDirectives({
    applyVariable: ['--at-apply', '--uno-apply', '--uno'],
  }), transformerVariantGroup(), transformerCompileClass(), transformerAttributifyJsx()],
  extractors: [
    extractorMdc(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
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
}])
