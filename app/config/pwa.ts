import type { ModuleOptions } from '@vite-pwa/nuxt'
import process from 'node:process'
import { SiteDescription, SiteName } from '../logic/constants'

const scope = '/'

export const pwa: ModuleOptions = {
  registerType: 'autoUpdate',
  scope,
  base: scope,
  manifest: {
    id: '/?source=NuxtVitePWA',
    scope,
    name: SiteName,
    short_name: SiteName,
    description: SiteDescription,
    theme_color: '#ffffff',
    form_factor: 'wide',
    // manifest からの相対解決にする。絶対URLにすると、カスタムドメイン以外
    // (vercel.app の既定URL、PR のプレビューURL) で開いたときに start_url の
    // origin がドキュメントと食い違い、ブラウザが manifest を拒否する。
    // 同ファイルの id も相対なので記法も揃う。
    start_url: '/?source=NuxtVitePWA',
    icons: [
      {
        src: 'apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'safari-pinned-tab.svg',
        sizes: 'any',
        color: '#5bbad5',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    // パフォーマンス改善: 静的アセットのみプリキャッシュ（HTMLはネットワーク優先）
    globPatterns: [
      '_nuxt/*.js',
      '_nuxt/*.css',
      'favicon.ico',
      'manifest.webmanifest',
    ],
    globIgnores: [
      'node_modules/**/*',
      'sw.js',
      'workbox-*.js',
      '**/*.map', // ソースマップ除外
      'api/**', // API除外
      '**/*.html', // HTMLはruntimeCachingで処理
    ],
    navigateFallbackDenylist: [/^\/api\//],
    navigateFallback: '/',
    cleanupOutdatedCaches: true,
    maximumFileSizeToCacheInBytes: 60000000,
    runtimeCaching: [
      // HTMLページ: ネットワーク優先（オフライン時はキャッシュ使用）
      {
        urlPattern: /\.html$|\/[^.]*$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7日間
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // 画像: キャッシュ優先
      {
        urlPattern: /\.(?:png|webp|jpg|jpeg|svg|gif|ico)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30日間
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts.googleapis.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 365日間
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts.gstatic.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 365日間
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  registerWebManifestInRouteRules: true,
  writePlugin: true,
  devOptions: {
    enabled: process.env.VITE_PLUGIN_PWA === 'true',
    navigateFallback: scope,
  },
}
