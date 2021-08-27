const { noNbspFilter } = require('./noNbspFilter');
describe('noNbspFilter', function () {
  it.each([
    ['', ''],
    ['&nbsp;', ' '],
    ['a&nbsp;', 'a '],
    ['a&nbsp;b c', 'a b c'],
  ])('noNbsp filter should return correct string - %#', (input, expectedOutput) => {
    expect(noNbspFilter(input)).toBe(expectedOutput);
  });
});
