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

module.exports = {
  coloredTagsShortcode,
};
