const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../build'),
  },
  plugins: [
    // rm -rf for output folder
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      APP_SESSION_STORAGE_KEY: 'MBL_APP_STATE',
    }),
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
