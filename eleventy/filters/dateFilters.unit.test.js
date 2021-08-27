const { readableDateFilter, htmlDateStringFilter } = require('./dateFilters');
describe('dateFilters', function () {
  const date = new Date('2021-08-27T20:37:56.203Z');

  it('readableDateFilter should return formatted string', function () {
    expect(readableDateFilter(date)).toBe('27 Aug 2021');
  });

  it('htmlDateStringFilter should return formatted string', function () {
    expect(htmlDateStringFilter(date)).toBe('2021-08-27');
  });
});
