const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader');

module.exports = {
  entry: {
    app: [
      './src/index.js',
      './src/style.scss'
    ]
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            // Loads ES2015+ code and transpiles to ES5 using Babel
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },

      // This will apply to both plain `.scss` files
      // AND `<style lang="scss">` blocks in `.vue` files
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new VueLoaderPlugin()
  ],
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      // Webpack minimize JS by default
      // but we have to specify minimizer if we overwrite minimizer settings.
      new UglifyJsPlugin,
      new OptimizeCssAssetsPlugin
    ]
  }
};
