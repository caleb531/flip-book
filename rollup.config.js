let path = require('path');
let glob = require('glob');
let commonjs = require('@rollup/plugin-commonjs');
let resolve = require('@rollup/plugin-node-resolve');
let json = require('@rollup/plugin-json');
let scss = require('rollup-plugin-scss');
let terser = require('rollup-plugin-terser').terser;
let copy = require('rollup-plugin-copy');
let serve = require('rollup-plugin-serve');
let { injectManifest } = require('rollup-plugin-workbox');

// Watch additional files outside of the module graph (e.g. SCSS or static
// assets); see <https://github.com/rollup/rollup/issues/3414>
function watcher(globs) {
  return {
    buildStart() {
      for (const item of globs) {
        glob.sync(path.resolve(__dirname, item)).forEach((filename) => {
          this.addWatchFile(filename);
        });
      }
    }
  };
}

module.exports = {
  input: 'src/scripts/index.js',
  output: {
    file: 'dist/index.js',
    name: 'flipBook',
    sourcemap: true,
    format: 'iife'
  },
  plugins: [
    watcher(['src/styles/*.*', 'public/**/*.*']),
    copy({
      targets: [
        { src: 'public/*', dest: 'dist/' },
        { src: 'node_modules/mithril/mithril.min.js', dest: 'dist/' },
        { src: 'node_modules/underscore/underscore-min.js', dest: 'dist/' },
        { src: 'node_modules/gif.js.optimized/dist/gif.js', dest: 'dist/' },
        { src: 'node_modules/gif.js.optimized/dist/gif.worker.js', dest: 'dist/' }
      ]
    }),
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    scss(),
    process.env.NODE_ENV === 'production' ? terser() : null,
    injectManifest({
      globDirectory: 'dist',
      globPatterns: [
        '**\/*.{js,css,png}',
        'icons/*.svg'
      ],
      // Precaching index.html using templatedURLs fixes a "Response served by
      // service worker has redirections" error on iOS 12; see
      // <https://github.com/v8/v8.dev/issues/4> and
      // <https://github.com/v8/v8.dev/pull/7>
      templatedURLs: {
        // '.' must be used instead of '/' because the app is not served from the
        // root of the domain (but rather, from a subdirectory)
        '.': ['index.html']
      },
      swSrc: 'src/scripts/service-worker.js',
      swDest: 'dist/service-worker.js'
    }),
    process.env.SERVE_APP ? serve({
      contentBase: 'dist',
      port: 8080
    }) : null
  ]
};
