function iconShortcode(name, classNames = undefined) {
  let spanClasses = ['icon', 'icon-' + name];

  if (classNames) {
    if (typeof classNames === 'string') {
      spanClasses.push(classNames);
    } else {
      spanClasses.concat(classNames);
    }
  }

  return `<span class="${spanClasses.join(' ')}"></span>`;
}

function stringToHash(str) {}

function coloredTagShortcode(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; ++i) {
    hash += tag.charCodeAt(i);
  }
  hash %= 10;

  return `<span class="tag tag-${hash}">${tag}</span>`;
}

function setUpStylingShortcodes(eleventyConfig) {
  const colShortcode = (colContent, ...additionalClasses) =>
    `<div class="col col-nopad ${additionalClasses.join(' ')}">${colContent}</div>`;

  const imgShortcode = (alt, src, ...additionalClasses) => {
    const classStr = `class="img-resp ${additionalClasses.join(' ')}"`;
    return `<img alt="${alt}" src="${src}" ${classStr} />`;
  };

  eleventyConfig.addPairedShortcode('col', colShortcode);
  eleventyConfig.addPairedShortcode('colhalf', (...attrs) =>
    colShortcode(...attrs, 'col-half', 'col--o2')
  );
  eleventyConfig.addShortcode('colimg', (...attrs) =>
    colShortcode(imgShortcode(...attrs), 'col-half', 'center-content', 'col-img')
  );
}

function setUpCustomShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('colorTag', coloredTagShortcode);
  setUpStylingShortcodes(eleventyConfig);
}

module.exports = {
  setUpCustomShortcodes,
};
