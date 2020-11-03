// --------------------
// -- icon from font --
// --------------------
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

// --------------------
// --- Tag coloring ---
// --------------------

function coloredTag(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; ++i) {
    hash += tag.charCodeAt(i);
  }
  hash %= 10;

  return `<span class="tag tag-${hash}">${tag}</span>`;
}

function coloredTagsShortcode(tags, ignored = []) {
  const ignoreFilter = (it) => !ignored.includes(it);
  return tags.filter(ignoreFilter).map(coloredTag).join(' ');
}

// --------------------
// -- col shortcodes --
// --------------------

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

// ----------------------
// -- setup everything --
// ----------------------

function setUpCustomShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('colorTags', coloredTagsShortcode);
  setUpStylingShortcodes(eleventyConfig);
}

module.exports = {
  setUpCustomShortcodes,
};
