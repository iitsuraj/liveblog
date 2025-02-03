const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    performance: {
        maxAssetSize: 2000000, // 2MB
        maxEntrypointSize: 2000000,
    },
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
        path: path.resolve(process.cwd(), 'build'),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        chunkLoadingGlobal: 'wpJsonpLiveBlog'
    },
};
