const path = require('path');
const merge = require('webpack-merge');
const shared = require('./webpack.shared');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const production = {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/html/index.html'),
      minify: true,
    }),
    new Dotenv({
      path: path.join(__dirname, '.production.env'),
    }),
  ],
};

module.exports = merge(shared, production);
