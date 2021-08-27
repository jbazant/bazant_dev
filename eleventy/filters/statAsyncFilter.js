const fs = require('fs');

/**
 * USAGE:
 * {{ page.inputPath | stat("atime") }} -- The timestamp indicating the last time this file was accessed.
 * {{ page.inputPath | stat("birthtime") }} -- The timestamp indicating the creation time of this file.
 * {{ page.inputPath | stat("mtime") }} -- The timestamp indicating the last time this file was modified.
 * {{ page.inputPath | stat("ctime") }} --  The timestamp indicating the last time the file status was changed.
 * {{ page.inputPath | stat }} -- Alias for `stat("birthtime")`.
 */
function statAsyncFilter(file, prop, callback) {
  // If you called a naked `{{ page.inputPath | stat }}`, then the callback
  // function gets set to the `prop` attribute, so we need to juggle some
  // attribute values.
  if (typeof prop === 'function') {
    callback = prop;
    prop = 'birthtime';
  }
  fs.stat(file, (err, stats) => callback(err, stats && stats[prop]));
}

module.exports = {
  statAsyncFilter,
};
