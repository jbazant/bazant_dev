const { iconShortcode } = require('./shortrcodes/iconShortcode');
const { coloredTagsShortcode } = require('./shortrcodes/coloredTagsShortcode');
const { logoShortcode } = require('./shortrcodes/logoShortcode');
const { colShortcode, imgShortcode } = require('./shortrcodes/stylingShortcodes');

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
  setUpCustomShortcodes,
};
