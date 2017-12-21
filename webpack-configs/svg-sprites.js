const SvgStorePlugin = require('external-svg-sprite-loader/lib/SvgStorePlugin');

module.exports = function(paths) {
    let config = {
        module: {
            rules: []
        },
        plugins: [
            new SvgStorePlugin()
        ]
    };

    for (let key in paths) {
        config.module.rules.push({
            test: /\.svg$/i,
            include: paths[key],
            use: [
                {
                    loader: 'external-svg-sprite-loader',
                    options: {
                        name: 'sprites/' + key + '-sprite.svg',
                        iconName: '[name]',
                        svgoOptions: {
                            plugins: [
                                { removeDimensions: true },
                                { removeStyleElement: true },
                                { removeScriptElement: true }
                            ]
                        },
                    }
                },
            ],
        });
    }

    return config;
}
