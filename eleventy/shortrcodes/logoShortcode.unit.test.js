const { logoShortcode } = require('./logoShortcode');
describe('logoShortcode', function () {
  it('should match snapshot', function () {
    expect(logoShortcode(100, 'white', 'black')).toMatchSnapshot();
  });

  it('should have correct size and scale', function () {
    const logo = logoShortcode(100, 'white', 'black');

    expect(logo).toMatch('width="100"');
    expect(logo).toMatch('height="100"');
    expect(logo).toMatch('transform="scale(0.5)"');
  });

  it('should have correct color', function () {
    const logo = logoShortcode(100, 'blue', 'purple');

    expect(logo).toMatch('fill="blue"');
    expect(logo).toMatch('stroke="purple"');
  });
});
