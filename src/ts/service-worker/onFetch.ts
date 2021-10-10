export function shouldInterceptFetch(request: Request): boolean {
  const url = new URL(request.url);

  // Only handle GET requests.
  if (request.method !== 'GET') {
    return false;
  }

  // Don't handle BrowserSync requests.
  if (url.pathname.startsWith('/browser-sync/')) {
    return false;
  }

  // Don't handle non-http requires such as data: URIs.
  return url.protocol.startsWith('http');
}

export async function getResponsePromise(
  request: Request,
  cache: Cache
): Promise<undefined | Response> {
  const { pathname } = new URL(request.url);
  const response = await cache.match(request);

  if (response) {
    console.info('service-worker cache hit for ', pathname);
    return response;
  }

  if (request.cache === 'only-if-cached') {
    console.info('service-worker cache miss for ', pathname);
    return undefined;
  }

  const fetchResponse = await fetch(request);

  if (fetchResponse.ok) {
    console.info('service-worker got from network ', pathname);
    cache.put(request, fetchResponse.clone());
  } else {
    console.info('service-worker got NOK response from network ', pathname);
  }

  return fetchResponse;
}

export async function onFetch(
  event: FetchEvent,
  caches: CacheStorage,
  cacheName: string
): Promise<void> {
  const { request } = event;

  if (!shouldInterceptFetch(request)) {
    return;
  }

  const cache = await caches.open(cacheName);

  event.respondWith(getResponsePromise(request, cache));
}
