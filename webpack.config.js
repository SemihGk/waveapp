var path = require('path');

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            path.join(__dirname, 'client/core.js')
        ],
    },

  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js'
  },

  resolve: {
      modules: [
          'node_modules'
      ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [{
          loader: 'babel-loader'
        }],
    }]
  }
};
