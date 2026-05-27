// Etqan auto update service worker
const CACHE_NAME="etqan-1779689001";
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css?v=1779689001',
  './app.js?v=1779689001',
  './firebase-config.js?v=1779689001',
  './manifest.json?v=1779689001',
  './version.json?v=1779689001',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
  './assets/og-cover.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS).catch(()=>{})));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.postMessage({ type: 'ETQAN_UPDATED', version: '1779689001' }));
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isCore = ['document','script','style','manifest','image'].includes(req.destination)
    || url.pathname.endsWith('/version.json')
    || url.pathname.endsWith('/app.js')
    || url.pathname.endsWith('/styles.css')
    || url.pathname.endsWith('/index.html')
    || url.pathname.includes('/assets/icon-')
    || url.pathname.endsWith('/og-cover.svg');

  if (isCore) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
      return res;
    }))
  );
});
