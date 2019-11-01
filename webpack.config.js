const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const config = require("sapper/config/webpack.js");
const pkg = require("./package.json");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

const mode = process.env.NODE_ENV;
const couch = process.env.COUCH;
const dev = mode === "development";

const alias = { svelte: path.resolve("node_modules", "svelte") };
const extensions = [".mjs", ".js", ".json", ".svelte", ".html"];
const mainFields = ["svelte", "module", "browser", "main"];

let cssRules = {
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    { loader: "css-loader", options: { importLoaders: 1 } },
    {
      loader: "postcss-loader",
      options: {
        plugins: [
          require("postcss-import"),
          require("tailwindcss")("./tailwind.config.js"),
          require("postcss-custom-properties"),
          require("autoprefixer")
        ].filter(Boolean)
      }
    }
  ]
};

let plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "[id].[hash].css"
  }),
  new PurgecssPlugin({
    paths: glob.sync("./src/**/*.svelte", { nodir: true })
  })
];

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { alias, extensions, mainFields },
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              dev,
              hydratable: true,
              hotReload: false
            }
          }
        },
        cssRules
      ]
    },
    mode,
    plugins: [
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "process.env.COUCH": JSON.stringify(couch)
      }),
      ...plugins
    ],
    devtool: dev && "inline-source-map"
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: "node",
    resolve: { extensions, mainFields },
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
              dev
            }
          }
        },
        cssRules
      ]
    },
    plugins,
    mode,
    performance: {
      hints: false // it doesn't matter if server.js is large
    }
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode
  }
};
