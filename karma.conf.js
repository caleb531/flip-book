/* eslint-env node */

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadlessCustom'],
    files: [
      'node_modules/chai/chai.js',
      'public/styles/index.css',
      'public/scripts/mithril.min.js',
      'public/scripts/lodash.min.js',
      'public/scripts/gif.js',
      'public/scripts/sw-update-manager.js',
      'public/scripts/main.js',
      'public/scripts/test.js'
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
