import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import watchGlobs from 'rollup-plugin-watch-globs';
import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import { injectManifest } from 'rollup-plugin-workbox';

export default {
  input: 'src/scripts/index.js',
  output: {
    file: 'dist/scripts/index.js',
    name: 'flipBook',
    sourcemap: true,
    format: 'iife',
    exports: 'auto'
  },
  plugins: [
    watchGlobs(['src/styles/*.*', 'public/**/*.*']),
    copy({
      targets: [
        { src: 'public/*', dest: 'dist/' },
        { src: 'node_modules/mithril/mithril.min.js', dest: 'dist/scripts' },
        { src: 'node_modules/underscore/underscore-min.js', dest: 'dist/scripts' },
        { src: 'node_modules/gif.js.optimized/dist/gif.js', dest: 'dist/scripts' },
        { src: 'node_modules/gif.js.optimized/dist/gif.worker.js', dest: 'dist/scripts' }
      ]
    }),
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    scss({
      sourceMap: true,
      output: 'dist/styles/index.css',
      outputStyle: 'compressed'
    }),
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
