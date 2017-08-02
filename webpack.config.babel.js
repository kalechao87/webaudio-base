import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanWebpackPlugin from 'clean-webpack-plugin';

const defaultEnv = {
  dev: true,
  production: false,
};

export default (env = defaultEnv) => ({
  entry: {
    app: path.join(__dirname, "src/index.js")
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    publicPath: "" // relative to HTML page(same directory)
  },

  resolve: {
    extensions: [".js", ".json", ".jsx", ".css"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: [["env", { modules: false }]]
            }
          }
        ]
      },
    ]
  },

  plugins: [
    ...(env.dev
      ? []
      : [
          new CleanWebpackPlugin(["dist"]),
          // new ExtractTextPlugin("[name].css")
        ]),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: '192.168.31.21',
    port: 9000
  },

  devtool: env.dev ? "cheap-module-eval-source-map" : "cheap-module-source-map"
});
