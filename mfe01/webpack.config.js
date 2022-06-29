const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
let html = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "testorg",
    projectName: "mfe01",
    webpackConfigEnv,
    disableHtmlGeneration: true,
    argv,
  });

  delete defaultConfig.externals;

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    entry: {
      index: "./src/index.ts",
    },
    output: {
      filename: "[name].js",
      clean: true,
      publicPath: "http://localhost:8082/",
    },
    plugins: [
      new html({
        template: "./src/index.ejs",
      }),
      new ModuleFederationPlugin({
        name: "mfe001",
        filename: "remoteEntry.js",
        exposes: {
          "./Root": "./src/testorg-mfe01",
        },
        shared: [
          {
            ...deps,
            react: {
              requiredVersion: deps.react,
              singleton: true,
            },
            "react-dom": {
              requiredVersion: deps["react-dom"],
              singleton: true,
            },
            "react/jsx-runtime": {},
          },
        ],
      }),
    ],
  });
};
