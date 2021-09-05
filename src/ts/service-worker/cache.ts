export async function cacheAssets(
  caches: CacheStorage,
  cacheName: string,
  filesToCache: string[]
): Promise<void> {
  const cache = await caches.open(cacheName);
  await cache.addAll(filesToCache);
}

export async function deleteStaleCaches(
  caches: CacheStorage,
  currentCacheName: string
): Promise<void> {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(async (key) => {
      if (key !== currentCacheName) {
        await caches.delete(key);
      }
    })
  );
}
