import * as nock from 'nock';
import { getResponsePromise } from './onFetch';

describe('onFetch event actions integration', function () {
  describe('getResponsePromise', function () {
    it('should fetch page from server and save it to cache', async function () {
      const scope = nock('https://test.com').get('/').reply(200, 'RESPONSE');

      const request = new Request('https://test.com/', { method: 'GET' });
      const cache = new Cache();

      const response = await getResponsePromise(request, cache);
      const responseBody = await response.text();

      expect(responseBody).toBe('RESPONSE');
      await expect(cache.match(request)).resolves.toBeTruthy();

      scope.done();
    });

    it('should not save to cache response other then 200', async function () {
      const scope = nock('https://test.com').get('/').reply(400, 'RESPONSE');

      const request = new Request('https://test.com/', { method: 'GET' });
      const cache = new Cache();

      const response = await getResponsePromise(request, cache);
      const responseBody = await response.text();

      expect(responseBody).toBe('RESPONSE');
      await expect(cache.match(request)).resolves.toBeFalsy();

      scope.done();
    });
  });
});
