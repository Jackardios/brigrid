// Import libs
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

// Import plugins
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Import configuration parts
const cssExtract = require("./webpack-configs/css-extract");
const importGlob = require("./webpack-configs/import-glob");
const devServer = require("./webpack-configs/dev-server");
const pug = require("./webpack-configs/pug");

/**
 * Paths
 * @type {Object}
 */
const PATHS = {
    demo: path.join( __dirname, "demo" ),
    demoBuild: path.join( __dirname, "demo_build" ),
};

/**
 * Common configuration
 * @type {Object}
 */
const common = merge([
    {
        context: PATHS.demo,
        entry: {
            index: path.resolve(PATHS.demo, "index.js"),
        },
        output: {
            path: PATHS.demoBuild,
            filename: "js/[name].js",
        },
        plugins: [
            new HTMLWebpackPlugin({
                filename: 'index.html',
                chunks: ['index'],
                template: path.resolve(PATHS.demo, "index.pug")
            }),
        ]
    },
    pug(),
    importGlob(),
    devServer(),
]);

module.exports = function(env) {
    if (env === "production") {
        return merge([
            common,
            cssExtract( true ),
        ]);
    } else {
        return merge([
            common,
            cssExtract( false ),
        ]);
    }
}
