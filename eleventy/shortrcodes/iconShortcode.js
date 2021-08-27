function iconShortcode(name, classNames = undefined) {
  let spanClasses = ['icon', 'icon-' + name];

  if (classNames) {
    if (typeof classNames === 'string') {
      spanClasses.push(classNames);
    } else {
      spanClasses.push(...classNames);
    }
  }

  return `<span class="${spanClasses.join(' ')}"></span>`;
}

module.exports = {
  iconShortcode,
};
