import minimist from 'minimist';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';
import WebpackDevServer from 'webpack-dev-server';

let argv = minimist(process.argv.slice(2));

let devServerHost = argv['dev-server-host'] || '127.0.0.1';
let devServerPort = argv['dev-server-port'] || 8080;
let devServerUrl = `http://${devServerHost}:${devServerPort}/`;
let ceagleHost = argv['ceagle-host'] || '127.0.0.1';
let ceaglePort = argv['ceagle-port'] || 8000;
let ceagleUrl = `http://${ceagleHost}:${ceaglePort}/`;
let hotReload = !argv['no-hot'];

webpackConfig.entry.push('webpack-dev-server/client?' + devServerUrl);
if (hotReload) {
  webpackConfig.entry.push('webpack/hot/dev-server');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
}

let devServerConfig = {
  hot: hotReload,
  stats: {
    colors: true,
    hash: false,
    version: false,
    assets: false,
    chunks: false
  },
  proxy: [
    {path: '/', target: ceagleUrl, bypass(request) {
      // workaround for historyApiFallback which for some reason doesn't work for paths with "."
      return request.url.match(/^\/api\//) ? false : '/';
    }}
  ],
  historyApiFallback: true
};

new WebpackDevServer(webpack(webpackConfig), devServerConfig).listen(
  devServerPort, devServerHost,
  (err) => {
    if (err) throw err;
    process.stdout.write(`Server started at ${devServerUrl}\n`);
  }
);
