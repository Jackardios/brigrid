// Import libs
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

// Import plugins
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Import partial configurations
const cssExtract = require("./webpack-configs/css-extract");
const importGlob = require("./webpack-configs/import-glob");
const devServer = require("./webpack-configs/dev-server");
const uglifyJS = require("./webpack-configs/uglifyJS");
const images = require("./webpack-configs/images");
const fonts = require("./webpack-configs/fonts");
const babel = require("./webpack-configs/babel");
const sass = require("./webpack-configs/sass");
const css = require("./webpack-configs/css");
const pug = require("./webpack-configs/pug");

// includePaths
const normalizePaths = "./node_modules/normalize-scss/sass";

/**
 * Paths
 * @type {Object}
 */
const PATHS = {
    contrib: path.join(__dirname, "contrib"),
    build: path.join(__dirname, "contrib_build"),
    assets: path.join(__dirname, "contrib/assets"),
};

/**
 * Common configuration
 * @type {Object}
 */
const common = merge([
    {
        entry: {
            index: path.resolve(PATHS.contrib, "index.js"),
        },
        output: {
            path: PATHS.build,
            filename: "[name].[hash].js"
        },
        plugins: [
            new HTMLWebpackPlugin({
                filename: 'index.html',
                chunks: ['index', 'common'],
                template: path.resolve(PATHS.contrib, "index.pug")
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
            })
        ]
    },
    importGlob(),
    fonts([
        path.resolve(PATHS.assets, 'fonts')
    ]),
    babel(),
    pug(),
]);

module.exports = function(env) {
    if (env === "production") {
        return merge([
            common,
            uglifyJS(),
            cssExtract([].concat(normalizePaths)),
            images([
                    {
                        input: path.resolve(PATHS.assets, 'images'),
                        output: 'images/'
                    }
                ],
                true
            ),
        ]);
    } else {
        return merge([
            common,
            devServer(),
            sass([].concat(normalizePaths)),
            css(),
            images([
                    {
                        input: path.resolve(PATHS.assets, 'images'),
                        output: 'images/'
                    }
                ],
                false
            ),
        ]);
    }
}
