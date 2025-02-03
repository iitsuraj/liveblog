const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        app: path.resolve(process.cwd(), 'src', 'index.js'),
        amp: path.resolve(process.cwd(), 'src', 'amp.js')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    output: {
        path: path.resolve(process.cwd(), 'assets'),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        chunkLoadingGlobal: 'wpJsonpLiveBlog'
    },
    module: {
        ...defaultConfig.module,
        rules: defaultConfig.module.rules.map(rule => {
            if (rule.test?.toString().includes('scss')) {
                return {
                    ...rule,
                    use: rule.use.map(loader => {
                        if (loader.loader?.includes('sass-loader')) {
                            return {
                                ...loader,
                                options: {
                                    ...loader.options,
                                    sassOptions: {
                                        includePaths: [
                                            path.resolve(process.cwd(), 'src'),
                                            path.resolve(process.cwd(), 'node_modules')
                                        ]
                                    }
                                }
                            };
                        }
                        return loader;
                    })
                };
            }
            return rule;
        })
    }
};
