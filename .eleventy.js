const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSass = require('eleventy-plugin-sass');
const markdownIt = require('markdown-it');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const { setUpCustomShortcodes } = require('./eleventy/shortcodes');
const { setUpCustomFilters } = require('./eleventy/filters');

function setUpPassThroughCopies(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/assets/');
  eleventyConfig.addPassthroughCopy('./src/images/');
  eleventyConfig.addPassthroughCopy('./src/fonts/');
  eleventyConfig.addPassthroughCopy('./src/browserconfig.xml');
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');
  eleventyConfig.addPassthroughCopy('./src/.htaccess');
}

module.exports = function (eleventyConfig) {
  const mardownOptions = {
    html: true,
    breaks: false,
    linkify: true,
  };
  eleventyConfig.setLibrary('md', markdownIt(mardownOptions));
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSass, {
    watch: ['src/**/*.{scss,sass}', '!node_modules/**'],
    sourcemaps: true,
  });
  eleventyConfig.addPlugin(lazyImagesPlugin, {
    appendInitScript: false,
    preferNativeLazyLoad: true,
    imgSelector: 'img.img-resp',
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
