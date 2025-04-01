const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HmrWebpackPlugin = require('../src/HmrWebpackPlugin');

module.exports = {
  mode: 'development',
  entry: './example/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/src/index.html'
    }),
    new HmrWebpackPlugin({
      port: 3001
    })
  ]
};
