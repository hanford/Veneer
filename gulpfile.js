var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('default', ['build-ext'])

gulp.task('build-ext', ['js', 'img', 'manifest', 'en']);

gulp.task('js', function() {
  return gulp.src('./app/scripts/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/scripts/'))
})

gulp.task('img', function() {
  return gulp.src('./app/images/*.png')
    .pipe(gulp.dest('./dist/images/'))
})

gulp.task('manifest', function() {
  return gulp.src('./app/manifest.json')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('en', function() {
  return gulp.src('./app/_locales/**/**.**')
    .pipe(gulp.dest('./dist/_locales'))
})

