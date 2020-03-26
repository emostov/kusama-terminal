const path = require('path');

module.exports = {
  context: __dirname,
  entry: './lib/rindex.js',
  output: {
    path: path.resolve(__dirname),
    filename: './lib/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env'],
          },
        },
      },
    ],
  },
  devtool: 'source-map',
};
