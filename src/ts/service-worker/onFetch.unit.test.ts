import { getResponsePromise, shouldInterceptFetch } from './onFetch';

describe('onFetch event actions', function () {
  const createRequest = (url: string, method: string) => new Request(url, { method });

  describe('shouldInterceptFetch', function () {
    it('should return false for non GET request', function () {
      const request = createRequest('https://test.com', 'POST');
      expect(shouldInterceptFetch(request)).toBe(false);
    });

    it('should ignore browser-sync request', function () {
      const request = createRequest('https://test.com/browser-sync/anything', 'GET');
      expect(shouldInterceptFetch(request)).toBe(false);
    });

    it('should ignote non-http(s) requests', function () {
      const request = createRequest('data:anything', 'GET');
      expect(shouldInterceptFetch(request)).toBe(false);
    });

    it('should be true otherwise', function () {
      const request = createRequest('https://test.com', 'GET');
      expect(shouldInterceptFetch(request)).toBe(true);
    });
  });

  describe('getResponsePromise', function () {
    it('should return cached value if possible', async function () {
      const request = createRequest('https://test.com', 'GET');
      const cache = new Cache();
      await cache.put(request, new Response('RESPONSE'));

      const response = await getResponsePromise(request, cache);

      expect(response).not.toBeUndefined();
      const responseBody = await response.text();
      expect(responseBody).toBe('RESPONSE');
    });

    // 'only-if-cached' is not propagated
    it('should return null if "only-if-cached" specified and cache missed', async function () {
      const request = createRequest('https://test.com', 'GET');
      // @ts-ignore
      // noinspection JSConstantReassignment
      request.cache = 'only-if-cached';
      const cache = new Cache();

      const response = await getResponsePromise(request, cache);

      expect(response).toBeUndefined();
    });
  });
});
