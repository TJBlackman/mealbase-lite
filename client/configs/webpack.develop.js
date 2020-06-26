const path = require('path');
const merge = require('webpack-merge');
const shared = require('./webpack.shared');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/html/index.html'),
    }),
  ],
};

module.exports = merge(shared, development);
