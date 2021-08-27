function getClassStr(...classes) {
  return `class="${classes.join(' ')}"`;
}

function colShortcode(colContent, ...additionalClasses) {
  const classStr = getClassStr('col', 'col-nopad', ...additionalClasses);
  return `<div ${classStr}>${colContent}</div>`;
}

function imgShortcode(alt, src, ...additionalClasses) {
  const classStr = getClassStr('img-resp', ...additionalClasses);
  return `<img alt="${alt}" src="${src}" ${classStr} />`;
}

module.exports = {
  colShortcode,
  imgShortcode,
};
