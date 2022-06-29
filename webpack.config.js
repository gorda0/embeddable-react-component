const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { name } = require("./package.json");

module.exports = (_, { mode }) => {
  const fileExtension =
    mode === "production" ? ".bundle.js" : ".development.js";

  const filename = `[name]` + fileExtension;
  const noReactFilename = `[name]` + fileExtension;
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

  const noReactEntry = {
    [`${name}-noreact`]: "./index.js",
    [`${name}-noreact-autoload`]: "./autoload.js",
  };

  const externals =  {
    react: "React",
    "react-dom": "ReactDOM",
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
      libraryTarget: "commonjs-module",
    },
    module,
    plugins: [
      ...(mode !== "production"  ? [getTemplate()] : []),
    ],
    optimization,
  };

  const noReactCjs = {
    ...cjs,
    entry: noReactEntry,
    output: {
      path: outputPath + "/cjs",
      filename: noReactFilename,
      libraryTarget: "commonjs-module",
    },
    externals
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
    ],
    externals,
    optimization,
  };

  return [cjs, noReactCjs, umd];
};
