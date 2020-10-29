const MiniCssExtractor = require('mini-css-extract-plugin');
const CssMinimizer = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/js/main.js'],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: __dirname + '/public/',
    port:9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\//,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules\//,
        use: [{ loader: MiniCssExtractor.loader }, 'css-loader'],
      },
      
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizer({
        test: /\.css$/,
      }),
      new TerserPlugin({
        test: /\.js$/,
        terserOptions: {
          parse: {},
          compress: {},
          mangle: {
            toplevel: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractor({
      filename: 'bundle.css',
    }),
  ],
};
