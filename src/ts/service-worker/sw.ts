import { cacheAssets, deleteStaleCaches } from './cache';
import { onFetch } from './onFetch';

const cacheName = 'bazant-dev-v0';

// todo generate files on build time, with timestamp (do not forget version string for js and css)
// see https://mvolkmann.github.io/blog/topics/#/blog/eleventy/pwa/?v=1.0.18
const filesToCache = ['/index.html', '/css/main.css', '/js/main.js', '/images/code.jpeg'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(cacheAssets(caches, cacheName, filesToCache));
});

self.addEventListener('activate', async () => {
  await deleteStaleCaches(caches, cacheName);
  // @ts-ignore
  await self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => onFetch(event, caches, cacheName));
