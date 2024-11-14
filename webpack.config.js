const version = require('./package.json').version;

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry:  {
        'test-ui':  './src/js/test-ui.js',
    },
    output: {
        path:     __dirname + '/dist/js/',
        filename: `[name]-${version}.js`
    },
    optimization: {
        minimizer: [ new TerserPlugin({extractComments: false}) ],
    },
};
