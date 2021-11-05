const WebpackPwaManifest = require('/webpack-pwas-manifest');
const path = require('path');

const config = {
    entry: {
        app: './assets/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: 'bundle.js'
    }
}