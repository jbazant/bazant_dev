import { cacheAssets, deleteStaleCaches } from './cache';

const cacheName = 'bazant-dev-v-0';
const filesToCache = ['/index.html', '/css/main.css', '/js/main.js', '/images/code.jpeg'];

const getResponsePromise = async (request: Request, url: URL) => {
  const cache = await caches.open(cacheName);

  // Try to find response in the cache.
  let response = await cache.match(request);

  if (!response) {
    if (request.cache === 'only-if-cached') return;

    // Try to fetch response from the network.
    // We will get a 404 error if not found.
    response = await fetch(request, { cache: 'no-store' });
    console.info('service-worker.js got', url.pathname, 'from network');

    // Cache the response.
    cache.put(request, response.clone());
  } else {
    console.info('service-worker.js got', url.pathname, 'from', cacheName);
  }

  return response;
};

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(cacheAssets(caches, cacheName, filesToCache));
});

self.addEventListener('activate', async () => {
  await deleteStaleCaches(caches, cacheName);
  // todo pwa
  // @ts-ignore
  await self.clients.claim();
});

self.addEventListener('fetch', async (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests.
  if (request.method !== 'GET') {
    return;
  }

  // Don't handle BrowserSync requests.
  if (url.pathname.startsWith('/browser-sync/')) {
    return;
  }

  // Don't handle non-http requires such as data: URIs.
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // @ts-ignore
  event.respondWith(getResponsePromise(request, url));
});
