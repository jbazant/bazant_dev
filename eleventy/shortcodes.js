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
// ------- Logo -------
// --------------------

function logo(size, colourInner, colourOuter) {
  return `<svg 
    version="1.1"
    baseProfile="full"
    width="${size}" height="${size}"
    xmlns="http://www.w3.org/2000/svg">
      <g transform="scale(${size / 200})">
        <path
          d="m 24.5 143 l 150 0 l -75 -129.9038 z m 19.0021 -32.4135 l 37.1398 0 l -18.5699 32.164 z m 55.9979 -32.6632 l -18.5699 -32.164 l 37.1398 0 z m 0 64.8272 l -37.2839 -64.5775 l 74.5678 -0.0001 z m 37.428 0 l -18.5699 -32.164 l 37.1398 0 z"
          fill="${colourInner}"
          stroke="none"
        />
        <circle 
          r="90"
          stroke="${colourOuter}"
          fill="none"
          stroke-width="20"
          stroke-dasharray="392 20 26 20 26 20 26 20"
          transform="translate(100, 100) rotate(30)"
        />
      </g>
    </svg>`;
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
  eleventyConfig.addShortcode('logo', logo);
  setUpStylingShortcodes(eleventyConfig);
}

module.exports = {
  setUpCustomShortcodes,
};
