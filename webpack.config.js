const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: "./src/swap.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        modules: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules')
        ]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};