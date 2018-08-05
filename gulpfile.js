let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let sass = require('gulp-sass');
let rollup = require('rollup');
let rollupConfig = require('./rollup.config.js');
let workboxBuild = require('workbox-build');

gulp.task('assets:core', () => {
  return gulp.src('app/assets/**/*')
    .pipe(gulp.dest('public'));
});
gulp.task('assets:js', () => {
  return gulp.src([
      'node_modules/gif.js.optimized/dist/gif.js',
      'node_modules/gif.js.optimized/dist/gif.worker.js'
    ])
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('assets', gulp.parallel(
  'assets:core',
  'assets:js'
));
gulp.task('assets:watch', () => {
  return gulp.watch('app/assets/**/*', gulp.series('assets:core', 'sw'));
});

gulp.task('sass', () => {
  return gulp.src('app/styles/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/styles'));
});
gulp.task('sass:watch', () => {
  return gulp.watch('app/styles/**/*.scss', gulp.series('sass', 'sw'));
});

gulp.task('rollup', () => {
  return rollup.rollup(rollupConfig).then((bundle) => {
    return bundle.write(rollupConfig.output);
  });
});
gulp.task('rollup:watch', () => {
  return gulp.watch('app/scripts/**/*.js', gulp.series('rollup', 'sw'));
});

gulp.task('sw', () => {
  return workboxBuild.generateSW({
    globDirectory: 'public',
    globPatterns: [
      '**\/*.{html,js,css,png}'
    ],
    swDest: 'public/service-worker.js',
    runtimeCaching: [{
      urlPattern: new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
      handler: 'cacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 30
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }]
  }).then(({warnings}) => {
    warnings.forEach(console.warn);
  });
});

gulp.task('build', gulp.series(
  gulp.parallel(
    'assets',
    'sass',
    'rollup'
  ),
  'sw'
));
gulp.task('build:watch', gulp.series(
  'build',
  gulp.parallel(
    'assets:watch',
    'sass:watch',
    'rollup:watch'
  )
));
