const path = require('path')
const webpack = require('webpack')
module.exports = { 
  entry: './src/index.js',
  output: {
    path: __dirname+'/../../../Desktop/pythonproject/urlpage/static/reactjs/',
    filename: 'wordview1.bundle.js'
  },  
  module: {
    rules: [
      {test: /\.js$/, use: 'babel-loader',exclude: /node_modules/,},
      {
        test: /\.(sass|less|css)$/,
        use:'css-loader'
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