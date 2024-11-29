import { cacheAssets, deleteStaleCaches } from './cache';
import { onFetch } from './onFetch';

// @ts-expect-error - trying to import generated file
import { date, files } from '../../../_site/pwa-files.json';

const cacheName = 'bazant-dev-' + date;

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(cacheAssets(caches, cacheName, files));
});

self.addEventListener('activate', async () => {
  await deleteStaleCaches(caches, cacheName);
  // @ts-expect-error - unknown property `clients`
  await self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => onFetch(event, caches, cacheName));
