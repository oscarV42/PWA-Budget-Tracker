const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/js/IndexedDB.js',
    '/js/index.js',
    '/manifest.json',
    '/css/style.css',
    'https://fonts.googleapis.com/css?family=Istok+Web|Montserrat:800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

self.addEventListener('install', (event) => {
  event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipwaiting())
  );
});

self.addEventListener('fetch', (event) => {
  if(event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if(cachedResponse) {
            return cachedResponse;
        }
        
        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.request).then((response) => {
            return cache.put(event.request, response.clone()).then(() => {
                return response;
            });
          });
        });
      })
    );
  };
});