function noNbspFilter(str) {
  return str.split('&nbsp;').join(' ');
}

module.exports = {
  noNbspFilter,
};
