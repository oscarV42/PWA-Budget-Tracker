const FILES_TO_CACHE = [
    '/',
    '/js/IndexedDB.js',
    '/js/index.js',
    '/manifest.json',
    '/css/styles.css',
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]

const CACHE_NAME = 'cite-cache-v2';
const DATA_NAME = 'data-cache-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
      return cache.addAll(FILES_TO_CACHE)
    }).catch(err => console.log(err))  
  );
});

self.addEventListener('fetch', (event) => {
  // if(event.request.url.includes('/api')) {
  //   event.respondWith(
  //     caches.match(event.request).then((cachedResponse) => {
  //       if(cachedResponse) {
  //           return cachedResponse;
  //       }
        
  //       return caches.open(DATA_NAME).then((cache) => {
  //         return fetch(event.request).then((response) => {
  //           return cache.put(event.request, response.clone()).then(() => {
  //               return response;
  //           });
  //         });
  //       });
  //     })
  //   );
  // };
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cached home page for all requests for html pages
          return caches.match("/");
        }
      });
    })
  );

});