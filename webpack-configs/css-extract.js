const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const cssMqpacker = require('css-mqpacker');

module.exports = function( optimize = true ) {
    let baseUse = [
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                plugins: []
            }
        }
    ];

    if ( optimize ) {
        baseUse[1].options.plugins.concat([
            autoprefixer(),
            cssMqpacker({
                sort: true
            }),
            cssNano({
                reduceIdents: false,
                discardComments: {
                    removeAll: true
                }
            })
        ]);
    }

    let sassLoader = { loader: 'sass-loader' };
    
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback: 'style-loader',
                        use: baseUse
                    })
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback: 'style-loader',
                        use: baseUse.concat( sassLoader )
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('./css/[name].css')
        ]
    };
}
