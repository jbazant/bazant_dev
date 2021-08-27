const { iconShortcode } = require('./iconShortcode');

describe('iconShortcode', function () {
  it.each([
    ['without class name', undefined, '<span class="icon icon-NAME"></span>'],
    ['with class name', 'another-class', '<span class="icon icon-NAME another-class"></span>'],
    [
      'with class names array',
      ['class1', 'class2'],
      '<span class="icon icon-NAME class1 class2"></span>',
    ],
  ])('should generate correct output %s', function (_, classNames, expectedOutput) {
    expect(iconShortcode('NAME', classNames)).toBe(expectedOutput);
  });
});
