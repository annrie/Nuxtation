import type { ModuleOptions } from '@vite-pwa/nuxt'

const scope = '/'

export const pwaVite: ModuleOptions = {
    registerType: 'autoUpdate',
    manifest: {
      name: 'nuxtation.vercel.app',
      short_name: 'Nuxtation',
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
      id: "/?source=NuxtVitePWA",
      start_url: "/?source=NuxtVitePWA"
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}', '_nuxt/builds/**/*.json'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  }
