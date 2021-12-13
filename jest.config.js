const webConfig = {
  displayName: 'web',
  transform: {
    '\\.ts?$': 'ts-jest',
  },
  testRegex: ['src/.*\\.(test|spec)\\.ts'],
  testPathIgnorePatterns: ['service-worker/'],
  moduleFileExtensions: ['ts', 'js'],
};

const eleventyConfig = {
  displayName: 'eleventy',
  testRegex: '\\.(test|spec)\\.js$',
  moduleFileExtensions: ['js'],
  transform: {
    '\\.js?$': 'babel-jest',
  },
};

const serviceWorkerConfig = {
  displayName: 'service-worker',
  transform: {
    '\\.ts?$': 'ts-jest',
  },
  testRegex: ['service-worker/.*\\.(test|spec)\\.ts'],
  moduleFileExtensions: ['ts', 'js'],
  setupFiles: ['./jest/setup-sw.js'],
  globals: {
    'ts-jest': {
      tsconfig: './src/ts/service-worker/tsconfig.json',
    },
  },
};

module.exports = {
  projects: [webConfig, eleventyConfig, serviceWorkerConfig],
};
