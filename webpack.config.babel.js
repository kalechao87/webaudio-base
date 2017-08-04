import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from "extract-text-webpack-plugin";

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

      {
        test: /\.(css|scss|sass)$/,
        exclude: /node_modules/,
        use: env.dev
          ? [
              {
                loader: "style-loader", // creates style loader from JS strings
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "css-loader", // translates css into CommonJS
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "postcss-loader",
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "sass-loader", // compiles Sass to CSS
                options: {
                  sourceMap: true
                }
              }
            ]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    sourceMap: true
                  }
                },
                {
                  loader: "postcss-loader",
                  options: {
                    sourceMap: true
                  }
                },
                {
                  loader: "sass-loader",
                  options: {
                    sourceMap: true
                  }
                }
              ]
            })
      }
    ]
  },

  plugins: [
    ...(env.dev
      ? []
      : [
          new CleanWebpackPlugin(["dist"]),
          new ExtractTextPlugin("[name].css")
        ]),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: "192.168.31.21",
    port: 9000
  },

  devtool: env.dev ? "cheap-module-eval-source-map" : "cheap-module-source-map"
});
