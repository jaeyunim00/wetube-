const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          //css 분리하기 loader
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};

//1. Webpack, WebpackCLI 설치
//webpack cli는 콘솔에서 webpack을 불러낼 수 있음.
//webpack.config.js에서 webpack이 읽을 config파일을 내보낼 꺼임.

//webpack.config.js는 웹팩 default name이기 때문에 package.json에서
//webpack --config webpack.config.js 대신
//webpack 만으로 사용해도 웹팩이 알아서 찾아줌.

//config파일에는 entrydhk Output 두가지 특성이 있는데 이는 필수이다.
//entry 처리하고자 하는 파일들 using js -> old js
//output은 결과물
//filename은 결과물 이름
//path는 결과물이 저장될 폴더 지정
//run webpack

//경로지정시 절대경로를 요함
//__dirname은 파일까지의 전체 경로
//resolve메서드는 /없이 편하게 경로를 만들어주는 역할을 함.

//작동은될꺼임

//근데 이 생성된 코드를 못알아듣는 브라우저가 있을 수 잇음.
//따라서 호환성을 추가해야함.
//일단 바벨

//modules를 작성하고 그안에 rules작성을해야함
//로더를 이용해 해당하는 파일의 로더를 찾아야함.
//js -> 바벨로더 css -> css로더 이런느낌
//rules에 test, use작성
//test에 정규식으로 포함할 파일 포함
//use에 로더 적어주면 됨.

//바벨로더 설치하기
//Doc복붙하기

//이러면 웹팩은 nodemodules에서 babel-loader를 찾을 꺼고, 몇가지 옵션을 함께 전달할 것이다.

//위의 호환성 설정을 한마디로하면 특정 종류의 파일들에게 변형을 적용시키는 법임

//로더를 통해 파일을 처리하고, 처리하면서 몇 가지 옵션을 전달하는거임.

//entry, output, module: {rules}

//일단일단 웹팩한테 이게 개발중인지, 완성품이닞 알려줘야함.
//개발중일때는 코드 압축을 원하지 않기 떄문.
//mode: "development" or "production"

//참고로 생성된 assets폴더를 브라우저가 읽어갈 거임.

//기본적으로 노드js의 폴더들은 공개되어있지 않기 때문에
//공개를위해 노드js한테 이건 공개한다고 말해줘야한다.
//static으로 전달

//css-loader 작성시 역순으로 하는게 특징임

//웹팩 플러그인
//js와 css파일을 분리
//js에서 css를 import해서 사용하면
//js가 로딩되는 걸 기다린 후 css가 적용되기 때문에 효율성이 좋지않다.
//MiniCssExtraPlugin

//결론 -> 웹팩은 client폴더를 보고
//    -> 브라우저는 웹팩이 해석한 assets폴더를 본다.

//수정마다 자동으로 npm run assets
//watch: true =>
//clear: ture => 중복코드 안하게
