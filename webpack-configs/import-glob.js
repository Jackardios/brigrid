module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    enforce: "pre",
                    loader: 'import-glob'
                },
                {
                    test: /\.js$/,
                    enforce: "pre",
                    loader: 'import-glob'
                }
            ]
        }
    };
}