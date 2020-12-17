const path = require('path')
const webpack = require('webpack')
module.exports = { 
  entry: './src/index.js',
  output: {
    path: __dirname+'/../../pythonproject/urlpage/static/reactjs/',
    filename: 'webview.bundle.js'
  },  
  module: {
    rules: [
      {test: /\.js$/, use: 'babel-loader'} ,
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      } 
    ]   
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
  ],
}