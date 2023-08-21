const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");

const { NODE_ENV = "production" } = process.env;

module.exports = {
    target: "node",
    entry: "./src/index.ts",
    mode: NODE_ENV || "none",
    stats: { warnings: false },
    watch: NODE_ENV === "development",
    output: {
        libraryTarget: "commonjs2",
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            { test: /\.(ts|js)x?$/, exclude: /node_modules/, use: 'ts-loader' },
        ],
    },
    node: {
        __dirname: false
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new NodemonPlugin({
            script: "dist/main.bundle.js",
            watch: path.resolve("dist"),
            ignore: ["*.js.map"],
        }),,
        new CopyWebpackPlugin({
            patterns: [
                './node_modules/swagger-ui-dist/swagger-ui.css',
                './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
                './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
                './node_modules/swagger-ui-dist/favicon-16x16.png',
                './node_modules/swagger-ui-dist/favicon-32x32.png'
            ]
        })
    ],
    resolve: {
        extensions: [".ts", ".js", ".json"],
        modules: ["src", "node_modules"],
    },
    devServer: {
        port: "3001",
        host: "0.0.0.0",
        disableHostCheck: true,
        watchOptions: {
            poll: true, // Or you can set a value in milliseconds.
        },
    },
    devtool: NODE_ENV === "production" ? "source-map" : "inline-source-map",
};
