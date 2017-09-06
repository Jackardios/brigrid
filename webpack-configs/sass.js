module.exports = function(sassPaths) {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: { includePaths: sassPaths }
                        }
                    ]
                }
            ]
        }
    };
}