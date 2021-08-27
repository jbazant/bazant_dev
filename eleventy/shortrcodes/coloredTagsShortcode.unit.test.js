const { coloredTagsShortcode } = require('./coloredTagsShortcode');

describe('coloredTagsShortcode', function () {
  it('should generate color based on given tags', function () {
    expect(coloredTagsShortcode(['tag-name-1', 'tag-name-2'])).toBe(
      '<span class="tag tag-2">tag-name-1</span> <span class="tag tag-3">tag-name-2</span>'
    );
  });

  it('should not generate span for ignored tags', function () {
    expect(coloredTagsShortcode(['tag-name-1', 'tag-name-2'], ['tag-name-1'])).toBe(
      '<span class="tag tag-3">tag-name-2</span>'
    );
  });
});
