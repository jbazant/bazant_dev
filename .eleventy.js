const { DateTime } = require('luxon');
const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSass = require('eleventy-plugin-sass');
const fs = require('fs');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSass, {
    watch: ['src/**/*.{scss,sass}', '!node_modules/**'],
    sourcemaps: true,
  });

  eleventyConfig.setDataDeepMerge(true);

  // copy files
  eleventyConfig.addPassthroughCopy('./src/assets/');
  eleventyConfig.addPassthroughCopy('./src/images/');
  eleventyConfig.addPassthroughCopy('./src/fonts/');
  eleventyConfig.addPassthroughCopy('./src/browserconfig.xml');
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');
  eleventyConfig.addPassthroughCopy('./src/.htaccess');

  eleventyConfig.addFilter('readableDate', (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy')
  );
  eleventyConfig.addFilter('htmlDateString', (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd')
  );

  /**
   * USAGE:
   * {{ page.inputPath | stat("atime") }} -- The timestamp indicating the last time this file was accessed.
   * {{ page.inputPath | stat("birthtime") }} -- The timestamp indicating the creation time of this file.
   * {{ page.inputPath | stat("mtime") }} -- The timestamp indicating the last time this file was modified.
   * {{ page.inputPath | stat("ctime") }} --  The timestamp indicating the last time the file status was changed.
   * {{ page.inputPath | stat }} -- Alias for `stat("birthtime")`.
   */
  eleventyConfig.addNunjucksAsyncFilter('stat', (file, prop, callback) => {
    // If you called a naked `{{ page.inputPath | stat }}`, then the callback
    // function gets set to the `prop` attribute, so we need to juggle some
    // attribute values.
    if (typeof prop === 'function') {
      callback = prop;
      prop = 'birthtime';
    }
    fs.stat(file, (err, stats) => callback(err, stats && stats[prop]));
  });

  eleventyConfig.addShortcode('icon', (name, classNames = undefined) => {
    let spanClasses = ['icon', 'icon-' + name];

    if (classNames) {
      if (typeof classNames === 'string') {
        spanClasses.push(classNames);
      } else {
        spanClasses.concat(classNames);
      }
    }

    return `<span class="${spanClasses.join(' ')}"></span>`;
  });

  // override default config
  return {
    templateFormats: ['md', 'njk'],

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
