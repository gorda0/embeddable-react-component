const path = require("path");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { name, version } = require("./package.json");
const execScript = (on, scripts) =>
  new WebpackShellPluginNext({
    [on]: {
      scripts,
    },
  });

module.exports = (_, { mode }) => {
  const fileExtension =
    mode === "production" ? ".bundle.js" : ".development.js";

  const filename = `[name]-${version}` + fileExtension;

  const outputPath = path.resolve(__dirname, "dist");

  const optimization = {
    minimizer: [new TerserPlugin({ extractComments: false })],
  };

  const getTemplate = () =>
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/template.html"),
    });

  const entry = {
    [name]: "./index.js",
    [`${name}-autoload`]: "./autoload.js",
  };

  const module = {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  };

  const cjs = {
    entry,
    output: {
      path: outputPath + "/cjs",
      filename,
    },
    module,
    plugins: [
      execScript("onBuildEnd", [
        `cp ./dist/cjs/${name}-${version}${fileExtension} ./dist/cjs/${name}-latest${fileExtension}`,
        `cp ./dist/cjs/${name}-autoload-${version}${fileExtension} ./dist/cjs/${name}-autoload-latest${fileExtension}`,
      ]),
      getTemplate(),
    ],
    optimization,
  };

  const umd = {
    entry,
    output: {
      path: outputPath + "/umd",
      filename,
      libraryTarget: "umd",
      library: name,
    },
    module,
    plugins: [
      execScript("onBuildEnd", [
        `cp ./dist/umd/${name}-${version}${fileExtension} ./dist/umd/${name}-latest${fileExtension}`,
        `cp ./dist/umd/${name}-autoload-${version}${fileExtension} ./dist/umd/${name}-autoload-latest${fileExtension}`,
      ]),
    ],
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
    optimization,
  };

  return [cjs, umd];
};
