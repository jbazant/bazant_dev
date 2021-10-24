import { cacheAssets, deleteStaleCaches } from './cache';
import { onFetch } from './onFetch';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { date, files } = require('../../../_site/pwa-files.json');

const cacheName = 'bazant-dev-' + date;

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(cacheAssets(caches, cacheName, files));
});

self.addEventListener('activate', async () => {
  await deleteStaleCaches(caches, cacheName);
  // @ts-ignore
  await self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => onFetch(event, caches, cacheName));
