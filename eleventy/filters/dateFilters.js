const { DateTime } = require('luxon');

function readableDateFilter(dateObj) {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
}

function htmlDateStringFilter(dateObj) {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
}

module.exports = {
  readableDateFilter,
  htmlDateStringFilter,
};
