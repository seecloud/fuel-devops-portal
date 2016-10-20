import path from 'path';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: [
    'whatwg-fetch',
    './src/app.js'
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
    filename: 'static/js/bundle.js',
    chunkFilename: null,
    sourceMapFilename: 'static/js/bundle.js.map'
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
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
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
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  postcss: () => [autoprefixer],
  devtool: 'cheap-module-source-map'
};
