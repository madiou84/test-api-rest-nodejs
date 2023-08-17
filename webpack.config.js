const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");

const { NODE_ENV = "production" } = process.env;

module.exports = {
    mode: (NODE_ENV === "testing" && "development") || 'none',
    watch: NODE_ENV === "testing",
    entry: "./src/server.ts",
    target: "node",
    output: {
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new NodemonPlugin({
            script: "dist/main.bundle.js",
            watch: path.resolve("dist"),
            ignore: ["*.js.map"],
        }),
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
