/* Kontruang — Service Worker (PWA v0.2)
   Offline-first: shell aplikasi + aset statis di-cache saat install,
   aset hasil build (JS/CSS hashed) di-cache saat pertama dipakai.
   Semua path RELATIF terhadap lokasi SW ini, supaya tetap benar di root
   domain maupun di subpath (mis. GitHub Pages /Autograph_101/).
   Naikkan versi CACHE setiap rilis supaya cache lama dibersihkan. */
const CACHE = 'kontruang-v0.2.0'

const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './logo-utama.jpg',
  './logo-emblem.jpg',
  './logo-stayfocus.jpg'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navigasi halaman: utamakan jaringan (dapat versi terbaru), fallback cache saat offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy))
          return res
        })
        .catch(() => caches.match('./index.html'))
    )
    return
  }

  // Aset statis: cache-first, lalu jaringan (dan simpan ke cache)
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return res
        })
    )
  )
})
