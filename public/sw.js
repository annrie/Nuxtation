// Minimal placeholder service worker for local development.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  clients.claim()
})
