const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
  entry: { bundle: './js/App.jsx'},
    // the entry point of our app
    output: {
    filename: '[name].js',
    // the filename template for entry chunks

    path: path.resolve(__dirname, 'public'),
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    publicPath: "/", // string
    // the url to the output directory resolved relative to the HTML page
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      },
      { test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'eslint-loader' }
        ]
      },
      { test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'eslint-loader' }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ]
};
