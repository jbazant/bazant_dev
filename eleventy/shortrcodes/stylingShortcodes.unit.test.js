const { colShortcode, imgShortcode } = require('./stylingShortcodes');

describe('stylingShortcodes', function () {
  describe('colShortcode', function () {
    it('should generate correct output', function () {
      expect(colShortcode('CONTENT', 'class1', 'class2')).toBe(
        '<div class="col col-nopad class1 class2">CONTENT</div>'
      );
    });

    it('should generate correct output without additional classes', function () {
      expect(colShortcode('CONTENT')).toBe('<div class="col col-nopad">CONTENT</div>');
    });
  });

  describe('imgShortcode', function () {
    it(' should generate correct output', function () {
      expect(imgShortcode('ALT_TEXT', 'IMG_SRC', 'class1', 'class2')).toBe(
        '<img alt="ALT_TEXT" src="IMG_SRC" class="img-resp class1 class2" />'
      );
    });

    it('should generate correct output without additionl classes', function () {
      expect(imgShortcode('ALT_TEXT', 'IMG_SRC')).toBe(
        '<img alt="ALT_TEXT" src="IMG_SRC" class="img-resp" />'
      );
    });
  });
});
