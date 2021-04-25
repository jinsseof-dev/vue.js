var path = require('path')       // path lib load
var webpack = require('webpack') // webpack lib load

module.exports = {
  entry: './src/main.js', // webpack으로 빌드할 file을 src/main.js로 지정. main.js 내용에 따라 App의 구성요소와 file이 webpack으로 bundling(build)됨
  output: { // webpack build 결과물 file의 dir과 filename을 지정
    path: path.resolve(__dirname, './dist'), // 결과물의 dir를 지정
    publicPath: '/dist/',
    filename: 'build.js'                     // 결과물의 filename을 지정
  },
  module: { // webpack으로 App file을 build할 때 HTML, CSS, PNG 등 file을 JavaScript로 변환해주는데, 확장자별 사용할 Loader를 지정
    rules: [
      {
        test: /\.css$/,         // .css 파일의 Loader 정의
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,         // .vue 파일의 Loader 정의
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,          // .js 파일의 Loader 정의
        loader: 'babel-loader', // babel-loader 적용. javascript file의 ES6 syntax를 모든 브라우저에서 호환 가능한 javascript로 변환(transpile)
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // img file의 Loader 정의
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {                        // webpack 빌드할 떄 Vue Library의 여러 유형 중 어떤 것을 선택할 지 지정
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // vue.esm.js는 최신 webpack version과 사용할 수 있는 Full version library를 의미
    },                              // 별도 설정이 없을 시 runtime version인 vue.runtime.esm.js를 사용
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {                // webpack dev server attribute를 지정
    historyApiFallback: true, // Vue Router(Client Side Routing)와 함께 사용하기 위해 true로 지정
    noInfo: true,             // webpack build info를 서버 시작시에만 보여줌. 이후 변경시에는 build info를 보여주지 않음
    overlay: true             // webpack build error occur시 browser 화면 전체에 error를 표시
  },
  performance: { // webpack build file size가 250kb 초과시 warning message 표시할 지 결정
    hints: false
  },
  devtool: '#eval-source-map' // webpack build file로 web app을 구동했을 때 개발자도구에서 사용할 debuging 방식을 지정. 여러 옵션이 있음
}

if (process.env.NODE_ENV === 'production') { // 배포시 성능 향상을 위한 설저어
  module.exports.devtool = '#source-map' // 개발자도구 분석 옵션을 source-map으로 지정
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    // javascript file size를 decrease하는 Uglify plugin과 env를 설정
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
