import {resolve} from "path";

export default(env, {mode}) => {

  return {
    entry: "./index.js",

    output: {
      path: resolve(__dirname, "dist"),
      filename: "index.js",
      libraryTarget: "umd",
      library: "travrs"
    },

    module: {
      rules: [
        {
          test: /\.js?$/,
          loader: "babel-loader",
          exclude: /node_modules/
        }
      ]
    }
  }
};
