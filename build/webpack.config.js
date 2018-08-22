const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

const utils = require("./utils");

const IP = utils.getIPAdress();
const POTR = 8081;

module.exports = {
  context: utils.resolve("./"),
  mode: "development",
  entry: {
    app: ["babel-polyfill", "./src/index.js"]
  },
  devtool: "cheap-module-eval-source-map",
  output: {
    path: utils.resolve("dist"),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@": utils.resolve("src"),
      "static": utils.resolve("static")
    }
  },
  module: {
    rules: [{
        test: /\.(html)$/,
        use: [{
          loader: "raw-loader"
        }]
      }, {
        test: /\.(js)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: [utils.resolve("src"), utils.resolve("node_modules/webpack-dev-server/client")]
      },
      {
        test: /\.(scss|css|sass)$/,
        use: [
          // creates style nodes from JS strings
          "style-loader",
          // translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              importLoaders: 2
            }
          },
          // compiles Sass to CSS, using Node Sass by default
          "sass-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  devServer: {
    clientLogLevel: "warning",
    hot: true,
    compress: true,
    port: POTR,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    quiet: true,
    host: IP,
    publicPath: "/"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify("development")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true
    }),
    new FriendlyErrorsPlugin({
      clearConsole: true,
      compilationSuccessInfo: {
        messages: [`(╯‵□′)╯︵ http://${IP}:${POTR} 你的项目在这里 请查收`]
      },
      onErrors: utils.createNotifierCallback()
    })
  ]
}