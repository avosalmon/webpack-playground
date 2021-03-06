const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
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
            // Only apply CSS extraction for production so that
            // we get CSS hot reload during development.
            // https://vue-loader.vuejs.org/guide/extract-css.html
            isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
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
        new TerserPlugin(),
        new OptimizeCssAssetsPlugin()
      ]
    }
  };
};
