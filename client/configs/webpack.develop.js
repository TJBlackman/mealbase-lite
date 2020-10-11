const path = require('path');
const merge = require('webpack-merge');
const shared = require('./webpack.shared');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const development = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3050',
    },
    clientLogLevel: 'warn',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/html/index.html'),
    }),
    new Dotenv({
      path: path.join(__dirname, '.develop.env'),
    }),
  ],
};

module.exports = merge(shared, development);
