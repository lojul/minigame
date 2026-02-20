const CACHE_NAME = 'mini-games-arcade-v3';

const LOCAL_ASSETS = [
  '/',
  '/index.html',
  '/games/memory-match.html',
  '/games/tetris.html',
  '/games/typing-defense.html',
  '/games/pokemon-battle.html',
  '/games/math-puzzle.html',
  '/js/supabase-config.js',
  '/js/ad-manager.js',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

const PASSTHROUGH_ORIGINS = [
  'risydxsgttsbidgsjlbg.supabase.co',
  'unpkg.com',
  'pagead2.googlesyndication.com',
  'googleads.g.doubleclick.net',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Pass through to network for external origins (Supabase, CDN, ads)
  if (PASSTHROUGH_ORIGINS.some(origin => url.hostname.includes(origin))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for local assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful GET responses for local origin
        if (
          response.ok &&
          event.request.method === 'GET' &&
          url.origin === self.location.origin
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
