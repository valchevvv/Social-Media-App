// src/service-worker.js

const CACHE_NAME = 'my-pwa-cache-v1';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', () => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', () => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then(cache => {
          return cache.match(OFFLINE_URL);
        });
      }),
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      }),
    );
  }
});
