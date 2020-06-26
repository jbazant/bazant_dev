// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    main: './src/ts/main.ts',
    scene: './src/ts/scene.ts',
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    //filename: '[name].[contentHash].js',
    filename: '[name].js',
    path: path.resolve(__dirname, '_site/js'),
    libraryTarget: 'var',
    library: 'bazant',
  },

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
            // eslint-disable-next-line @typescript-eslint/camelcase
            //drop_console: true,
          },
          output: { comments: false, beautify: false },
        },
        sourceMap: false,
      }),
    ],
  },
};
