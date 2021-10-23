const { DateTime } = require('luxon');

module.exports = {
  name: 'Jirka Bažant',
  buildTimeISO: DateTime.now().set({ second: 0, millisecond: 0 }).toISO({
    format: 'basic',
    includeOffset: false,
    suppressMilliseconds: true,
    suppressSeconds: true,
  }),
  assetsToCache: ['/images/code.jpeg', '/images/ico/favicon.ico', '/images/ico/maskable_icon.ico'],
};
