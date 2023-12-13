import process from 'node:process'
import type { ModuleOptions } from '@vite-pwa/nuxt'
import { SiteDescription, SiteName } from '../logic/index'

const scope = '/'

export const pwaVite: ModuleOptions = {
  registerType: 'autoUpdate',
  scope,
  base: scope,
  manifest: {
    // id: scope,
     id: "/?source=NuxtVitePWA",
    // scope,
    start_url: "/",
    name: SiteName,
    short_name: SiteName,
    description: SiteDescription,
    theme_color: '#ffffff',
    form_factor: "wide",
    screenshots: [
          {
            "src": "screenshot.png",
            "sizes": "320x552",
            "type": "image/png"
          }
        ],
    icons: [
      {
        src: 'apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: 'favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: 'favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: 'safari-pinned-tab.svg',
        color: '#5bbad5',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,txt,png,ico,svg}', '_nuxt/builds/**/*.json'],
    navigateFallbackDenylist: [/^\/api\//],
    navigateFallback: '/',
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts.googleapis.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
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
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
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
