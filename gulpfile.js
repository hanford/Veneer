var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('default', ['build-ext'])

gulp.task('build-ext', ['js', 'img', 'manifest', 'en', 'index', 'scss', 'app', 'templates']);

gulp.task('index', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('scss', function() {
  return gulp.src('./app/scss/*.scss')
    .pipe($.sass())
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('watch', ['build-ext'], function() {
  gulp.watch('./app/scripts/**.js', ['js'])
  gulp.watch('./app/js/**.js', ['app'])
  gulp.watch('./app/**.html', ['index'])
  gulp.watch('./app/templates/**.html', ['templates'])
  gulp.watch('./app/scss/**.scss', ['scss'])
})

gulp.task('app', function() {
  return gulp.src('./app/js/*.js')
    // .pipe($.uglify())
    .pipe(gulp.dest('./dist/js/'))
})

gulp.task('js', function() {
  return gulp.src('./app/scripts/**.js')
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/scripts/'))
})

gulp.task('img', function() {
  return gulp.src('./app/images/**')
    .pipe(gulp.dest('./dist/images/'))
})

gulp.task('templates', function() {
  return gulp.src('./app/templates/**.html')
    .pipe(gulp.dest('./dist/templates/'))
})

gulp.task('manifest', function() {
  return gulp.src('./app/manifest.json')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('en', function() {
  return gulp.src('./app/_locales/**/**.**')
    .pipe(gulp.dest('./dist/_locales'))
})
