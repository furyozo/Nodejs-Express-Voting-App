const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
  entry: './resources/sass/public.sass',
  output: {
    path: path.resolve(__dirname, 'public/stylesheets'),
    filename: 'public.css'
  },
  module: {
    rules: [{
      test: /\.sass$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin('public.css')
  ],
  watch: true
};
