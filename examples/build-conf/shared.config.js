/**
 * @author Dmitry Malakhov
 */

'use strict';

const { resolve } = require('path'),
  webpack = require('webpack')

const Package = require('../../package.json');

const PATH_SOURCES = resolve(__dirname, '../');
const PATH_DIST = resolve(__dirname, '..', 'public');

const vendorChunks = Object.keys(Package.dependencies);

const config = env => ({
  target: 'web',
  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
  },
  context: PATH_SOURCES,
  output: {
    path: PATH_DIST,
    publicPath: '/',
    sourceMapFilename: '[name].map',
  },
  entry: {
    main: ['./index'],
    vendor: vendorChunks,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 5120,
            name: 'images/[name]-[hash].[ext]',
          },
        }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name]-[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
  ],
});

module.exports = { config, PATH_DIST };
