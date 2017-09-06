module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    include: paths,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 100000
                            }
                        },
                        {
                            loader: 'image-webpack-loader'
                        }
                    ]
                }
            ]
        }
    };
}
