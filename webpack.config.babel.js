import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const NODE_ENV = process.env.NODE_ENV || 'development';

const filenameTemplate = '[name].[hash:8].[ext]';

export default {
  entry: [
    'whatwg-fetch',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
    filename: 'static/js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {cacheDirectory: true}
        },
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\/loading\.less$/,
        use: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader', 'less-loader']
        })
      },
      {
        test: /\.(gif|png|jpg)$/,
        use: `file-loader?name=static/media/${filenameTemplate}`
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: `file-loader?name=static/media/${filenameTemplate}`
      },
      {
        test: /\.svg\?fill=/,
        use: [
          `file-loader?name=static/media/${filenameTemplate}`,
          'svg-fill-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(NODE_ENV)}),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/media/favicon.ico',
    }),
    new ExtractTextPlugin({
      filename: 'static/styles/layout.css',
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer]
      }
    }),
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
  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map'
};
