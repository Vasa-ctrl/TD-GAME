/**
 * Service Worker for Tower Defense application.
 * Handles offline capabilities and asset caching.
 */
const CACHE_NAME = 'tower-defense-v1';

/**
 * Core assets to be cached during the installation phase.
 */
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js'
];

/**
 * Installation event: Caches the core application shell.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cachování základních souborů...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

/**
 * Activation event: Cleans up outdated caches from previous versions.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Mažu starou cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

/**
 * Fetch event: Implements a Cache-First strategy with dynamic caching for new requests.
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
  );
});
