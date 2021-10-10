const { iconShortcode } = require('./shortrcodes/iconShortcode');
const { coloredTagsShortcode } = require('./shortrcodes/coloredTagsShortcode');
const { logoShortcode } = require('./shortrcodes/logoShortcode');
const { colShortcode, imgShortcode } = require('./shortrcodes/stylingShortcodes');
const { statAsyncFilter } = require('./filters/statAsyncFilter');
const { readableDateFilter, htmlDateStringFilter } = require('./filters/dateFilters');
const { noNbspFilter } = require('./filters/noNbspFilter');

function setUpPassThroughCopies(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/assets/');
  eleventyConfig.addPassthroughCopy('./src/images/');
  eleventyConfig.addPassthroughCopy('./src/fonts/');
  eleventyConfig.addPassthroughCopy('./src/tools/');
  eleventyConfig.addPassthroughCopy('./src/browserconfig.xml');
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');
  eleventyConfig.addPassthroughCopy('./src/.htaccess');
}

function setUpCustomFilters(eleventyConfig) {
  eleventyConfig.addFilter('noNbsp', noNbspFilter);

  eleventyConfig.addFilter('readableDate', readableDateFilter);
  eleventyConfig.addFilter('htmlDateString', htmlDateStringFilter);

  eleventyConfig.addNunjucksAsyncFilter('stat', statAsyncFilter);
}

function setUpCustomShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('colorTags', coloredTagsShortcode);
  eleventyConfig.addShortcode('logo', logoShortcode);

  eleventyConfig.addShortcode('colimg', (...attrs) =>
    colShortcode(imgShortcode(...attrs), 'col-half', 'center-content', 'col-img')
  );

  eleventyConfig.addPairedShortcode('col', colShortcode);
  eleventyConfig.addPairedShortcode('colhalf', (...attrs) =>
    colShortcode(...attrs, 'col-half', 'col--o2')
  );
}

module.exports = {
  setUpPassThroughCopies,
  setUpCustomFilters,
  setUpCustomShortcodes,
};
