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
          'babel-loader',
          'eslint-loader'
        ]
      },
      { test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'eslint-loader'
        ]
      },
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test: /\.png$/,
				use: 'url-loader'
			}
    ]
  },
  watchOptions: {
    aggregateTimeout: 1000, // in ms
    // aggregates multiple changes to a single rebuild
    ignored: /node_modules/
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true, // Tell the dev-server we're using HMR
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/'
  }
};
