module.exports = function(paths = [], optimize = true) {
    var config = {
        module: {
            rules: []
        }
    };

    paths.forEach(function(pathObj) {
        let rule = {
            test: /\.(jpe?g|png|gif|svg)$/i,
            include: pathObj.input,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: pathObj.output,
                        name: '[name].[ext]'
                    }
                }
            ]
        };

        if (optimize) {
            rule.use.push({
                loader: 'image-webpack-loader'
            });
        }

        config.module.rules.push(rule);
    })

    return config;
}
