import { cacheAssets, deleteStaleCaches } from './cache';
import * as makeServiceWorkerEnv from 'service-worker-mock';

describe('SW cache', function () {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  describe('cacheAssets', function () {
    // this is test has to be joke, right?
    it('should cache all assets given to cacheName', async function () {
      await cacheAssets(self.caches, 'TEST_CACHE', []);
      await expect(self.caches.has('TEST_CACHE')).resolves.toBe(true);
    });
  });

  describe('deleteStaleCaches', function () {
    it('should delete all stale caches', async function () {
      await Promise.all(
        ['stale_1', 'stale_2', 'current'].map((cacheName) => self.caches.open(cacheName))
      );

      await deleteStaleCaches(self.caches, 'current');

      await expect(self.caches.has('stale_1')).resolves.toBe(false);
      await expect(self.caches.has('stale_1')).resolves.toBe(false);
      await expect(self.caches.has('current')).resolves.toBe(true);
    });
  });
});
