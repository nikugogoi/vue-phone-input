'use strict';

const Webpack = require('webpack');
const Path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const appPath = Path.resolve(__dirname, 'src');
const buildPath = Path.resolve(__dirname, 'lib');
const nodeModulesPath = Path.resolve(__dirname, 'node_modules');
const NODE_ENV = process.env.NODE_ENV || 'development';
const ASSET_PATH = process.env.ASSET_PATH || './';

const webpackConfig = {
  context: appPath,
  entry: '/',
  module: {
    rules: [
      {
        test: /\.(vue|js)$/,
        enforce: 'pre',
        loader: 'eslint',
        include: appPath,
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: appPath,
      },
      {
        test: /\.vue$/,
        loader: 'vue',
        include: appPath,
      },
      {
        test: /\.less$/,
        include: appPath,
        use: ExtractTextWebpackPlugin.extract({
          use: [
            'css',
            'less',
          ],
        }),
      },
      {
        test: /\.(png|gif|svg|jpe?g)$/,
        loader: 'file',
        options: {
          name: '[path][name].[ext]'
        }
      },
    ],
  },
  resolveLoader: {
    moduleExtensions: [
      '-loader',
    ],
  },
  resolve: {
    extensions:[
      '.js',
      '.vue'
    ],
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 100,
  },
  devtool: 'eval',
  plugins: [
    new ExtractTextWebpackPlugin({
      filename: 'styles.css',
      disable: false,
      allChunks: true,
    }),
    new Webpack.NoEmitOnErrorsPlugin(),
    new Webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
    }),
  ],
  externals: {},
  output: {
    path: buildPath,
    publicPath: ASSET_PATH,
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'VuePhoneInput',
  },
};

if (NODE_ENV === 'production') {
  webpackConfig.devtool = false;
  webpackConfig.watch = false;

  [
    'vue',
  ].forEach((item) => {
    webpackConfig.externals[item] = item;
  });

  webpackConfig.plugins.push(new Webpack.optimize.AggressiveMergingPlugin());
  webpackConfig.plugins.push(new Webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: true,
    },
    compress: {
      warnings: false,
      drop_console: true,
      unsafe: true,
      screw_ie8: true,
    },
    comments: false,
  }));
}

module.exports = webpackConfig;
