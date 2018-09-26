/* eslint-env node */

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: ['ChromeHeadlessCustom'],
    files: [
      '../node_modules/chai/chai.js',
      'styles/index.css',
      'scripts/mithril.min.js',
      'scripts/lodash.min.js',
      'scripts/gif.js',
      'scripts/sw-update-manager.js',
      'scripts/main.js',
      'scripts/test.js'
    ],
    reporters: ['dots'],
    frameworks: ['mocha'],
    preprocessors: {
      '**/*.js': ['sourcemap']
    },
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    }
  });
};
