// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin');

const common = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'ts-shader-loader',
      },
    ],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: {
            drop_console: true,
          },
          output: { comments: false, beautify: false },
        },
      }),
    ],
  },
};

module.exports = [
  {
    entry: {
      main: './src/ts/main.ts',
      scene: './src/ts/scene.ts',
      error: './src/ts/error.ts',
      sitemap: './src/ts/sitemap.ts',
    },
    output: {
      //filename: '[name].[contentHash].js',
      filename: '[name].js',
      path: path.resolve(__dirname, '_site/js'),
    },
    ...common,
  },
  {
    entry: {
      sw: './src/ts/service-worker/sw.ts',
    },
    output: {
      filename: 'sw.js',
      path: path.resolve(__dirname, '_site/'),
    },
    ...common,
  },
];
