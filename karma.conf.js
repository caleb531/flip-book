/* eslint-env node */

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: ['ChromeHeadlessCustom'],
    files: [
      'styles/index.css',
      'scripts/mithril.min.js',
      'scripts/lodash.min.js',
      'scripts/gif.js',
      'scripts/sw-update-manager.js',
      'scripts/test.js'
    ],
    reporters: ['dots'],
    frameworks: ['mocha', 'chai'],
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
