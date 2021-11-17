export function shouldInterceptFetch(request: Request): boolean {
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return false;
  }

  if (url.pathname.startsWith('/browser-sync/')) {
    return false;
  }

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

  try {
    const fetchResponse = await fetch(request);

    if (fetchResponse.ok) {
      console.info('service-worker got from network ', pathname);
      cache.put(request, fetchResponse.clone());
    } else {
      console.info('service-worker got NOK response from network ', pathname);
    }

    return fetchResponse;
  } catch (e) {
    console.info('service-worker NO response with error ', e.message);
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    throw e;
  }
}

export function onFetch(event: FetchEvent, caches: CacheStorage, cacheName: string): Promise<void> {
  const { request } = event;

  if (!shouldInterceptFetch(request)) {
    return;
  }

  const getPromise = async () => {
    const cache = await caches.open(cacheName);
    return getResponsePromise(request, cache);
  };

  event.respondWith(getPromise());
}
