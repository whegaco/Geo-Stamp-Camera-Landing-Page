const CACHE_NAME = 'geo-stamp-cache-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/favicon.svg',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline page and shell core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Cleaning up old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Only handle local/cross-origin GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // If we are looking for a page/document navigation, use Network First with Offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('[Service Worker] Fetch failed, returning offline fallback page');
          return caches.open(CACHE_NAME).then((cache) => cache.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Caching strategy for regular assets (CSS, JS, Fonts, Images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in the background (Stale-While-Revalidate) to update cache
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {/* Silent catch offline background checks */});
        
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Don't cache dynamic API requests or firestore collections
        if (
          !networkResponse || 
          networkResponse.status !== 200 || 
          networkResponse.type !== 'basic' ||
          url.pathname.startsWith('/api/') || 
          url.hostname.includes('firestore.googleapis.com')
        ) {
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
