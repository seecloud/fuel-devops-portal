import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  entry: [
    'whatwg-fetch',
    './src/app.js'
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
    filename: 'static/js/bundle.js',
    chunkFilename: null
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
      },
      {
        test: /\/loading\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
      },
      {
        test: /\.(gif|png|jpg)$/,
        loader: 'file',
        query: {name: 'static/media/[name].[hash:8].[ext]'}
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
        query: {name: 'static/media/[name].[hash:8].[ext]'}
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(NODE_ENV)}),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/media/favicon.ico',
    }),
    new ExtractTextPlugin('static/styles/layout.css', {allChunks: true}),
    ...(
      NODE_ENV === 'production' ? [
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          mangle: false,
          compress: {warnings: false}
        })
      ] : []
    )
  ],
  postcss: () => [autoprefixer],
  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map'
};
