const { DateTime } = require('luxon');
const { jsTimestamp, cssTimestamp } = require('./cache.json');

module.exports = {
  buildTimeISO: DateTime.now().set({ second: 0, millisecond: 0 }).toISO({
    format: 'basic',
    includeOffset: false,
    suppressMilliseconds: true,
    suppressSeconds: true,
  }),
  assetsToPrecache: [
    '/images/code.jpeg',
    '/images/ico/favicon.ico',
    '/images/ico/maskable_icon.png',
    '/js/main.js?v=' + jsTimestamp,
    '/js/error.js?v=' + jsTimestamp,
    '/css/main.css?v=' + cssTimestamp,
    '/fonts/entypo.woff',
    '/fonts/entypo.ttf',
  ],
};
