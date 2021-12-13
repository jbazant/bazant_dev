const makeServiceWorkerEnv = require('service-worker-mock');

// TODO try to use fetch directly
// For some reason fetch(new Request('https://test.com')) doesn't work.
const fetch = require('node-fetch');
global.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  return fetch(url, init);
};

Object.assign(global, makeServiceWorkerEnv());
