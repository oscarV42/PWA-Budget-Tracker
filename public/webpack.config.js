const WebpackPwaManifest = require('/webpack-pwas-manifest');
const path = require('path');

const config = {
    entry: {
        app: './assets/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new WebpackPwaManifest({
        fingerprints: false,
        name: 'Budegt App',
        short_name: 'Budget', 
        description: 'A budget tracking application.',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        'theme-color': '#ffffff',
        start_url: '/',
        icons: [
          {
            src: path.resolve('assets/images/icons/icon-192x192.png'),
            sizes: [192, 512],
            destination: path.join('assets', 'icons')
          }
        ]
      })  
    ]
}