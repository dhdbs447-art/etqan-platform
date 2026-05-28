// Etqan auto update service worker
const CACHE_NAME="etqan-1781004999";
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css?v=1781004999',
  './app.js?v=1781004999',
  './firebase-config.js?v=1781004999',
  './manifest.json?v=1781004999',
  './version.json?v=1781004999'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.postMessage({ type: 'ETQAN_UPDATED', version: '1781004999' }));
  })());
});

// للملفات الأساسية استخدم الشبكة أولًا حتى لا تبقى النسخة القديمة في المتصفح
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isCore = ['document','script','style','manifest'].includes(req.destination)
    || url.pathname.endsWith('/version.json')
    || url.pathname.endsWith('/app.js')
    || url.pathname.endsWith('/styles.css')
    || url.pathname.endsWith('/index.html');

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
