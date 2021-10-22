const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const markdownIt = require('markdown-it');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const {
  setUpPassThroughCopies,
  setUpCustomFilters,
  setUpCustomShortcodes,
} = require('./eleventy/setUp');

module.exports = function (eleventyConfig) {
  const mardownOptions = {
    html: true,
    breaks: false,
    linkify: true,
  };
  eleventyConfig.setLibrary('md', markdownIt(mardownOptions));
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(lazyImagesPlugin, {
    appendInitScript: false,
    preferNativeLazyLoad: true,
    imgSelector: 'img.img-resp',
  });
  eleventyConfig.setBrowserSyncConfig({
    files: ['./_site/css/**/*.css', './_site/js/**/*.js'],
  });

  eleventyConfig.setDataDeepMerge(true);

  setUpPassThroughCopies(eleventyConfig);
  setUpCustomFilters(eleventyConfig);
  setUpCustomShortcodes(eleventyConfig);

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
