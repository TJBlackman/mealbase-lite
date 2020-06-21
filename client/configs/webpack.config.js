const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../build'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    // create html file from template
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/html/index.html'),
    }),
    // rm -rf for output folder
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(tsx|ts)?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.join(__dirname, './tsconfig.json'),
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
};
