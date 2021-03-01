const webpack = require("webpack");
const path = require("path");
const config = require("sapper/config/webpack.js");
const pkg = require("./package.json");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const srcAliases = {
  Components: path.resolve("__dirname", "src/components"),
  Models: path.resolve("__dirname", "src/models"),
  Resources: path.resolve("__dirname", "src/resources"),
};
const clientAlias = {
  ...srcAliases,
  svelte: path.resolve("node_modules", "svelte"),
};
const extensions = [".mjs", ".js", ".json", ".svelte", ".html"];
const mainFields = ["svelte", "module", "browser", "main"];

const cssRules = {
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    { loader: "css-loader", options: { importLoaders: 1 } },
  ],
};

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "[id].[hash].css",
  }),
];

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { alias: clientAlias, extensions, mainFields },
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              dev,
              hydratable: true,
              hotReload: false,
            },
          },
        },
        cssRules,
      ],
    },
    mode,
    plugins: [
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.dev": dev,
      }),
      ...plugins,
    ],
    devtool: dev && "inline-source-map",
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: "node",
    resolve: { alias: srcAliases, extensions, mainFields },
    externals: Object.keys(pkg.dependencies).concat("encoding"),
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              css: false,
              generate: "ssr",
              dev,
            },
          },
        },
        cssRules,
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.browser": false,
        "process.dev": dev,
      }),
      ...plugins,
    ],
    mode,
    performance: {
      hints: false, // it doesn't matter if server.js is large
    },
  },
};
