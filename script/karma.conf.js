// karma.conf.js
// const env = process.env.NODE_ENV;
const webpack = require('webpack');
var webpackConfig = {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
        }
      })
    ],
    devtool: '#inline-source-map'
  }

module.exports = function(config) {
    config.set({
        // basePath: './',
        // autoWatch: false,
        frameworks: ['mocha'],
        //...
        files: [
            '../test/index.js',
            '../test/**/*.js'
        ],
    
        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage', 'htmlDetailed'],
    
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '../src/**/*.js': ['coverage'],
            '../test/index.js': ['webpack'],
            '../test/**/*.js': ['webpack']
        },
    
        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        htmlDetailed: {
          splitResults: true
        },
        plugins: [
            'karma-mocha',
            'karma-coverage',
            'karma-rollup-preprocessor',
            'karma-webpack',
            'karma-html-detailed-reporter'
        ]
    });

  };