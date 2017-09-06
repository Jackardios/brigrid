module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/i,
                    include: paths,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'fonts/',
                                name: '[name].[ext]'
                            }
                        }
                    ]

                }
            ]
        }
    };
}
