var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('default', ['build-ext'])

gulp.task('build-ext', ['img', 'manifest', 'en', 'index', 'css']);

gulp.task('index', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('scss', function() {
  return gulp.src('./app/scss/*.scss')
    .pipe($.sass())
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('css', function() {
  return gulp.src(['./app/scss/*.css', 'node_modules/codemirror/lib/codemirror.css'])
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('watch', ['build-ext'], function() {
  // gulp.watch('./app/scripts/**.js', ['js'])
  // gulp.watch('./app/js/**.js', ['app'])
  gulp.watch('./app/**.html', ['index'])
  // gulp.watch('./app/templates/**.html', ['templates'])
  gulp.watch('./app/scss/**.css', ['css'])
})

gulp.task('bump', function(){
  gulp.src('./app/manifest.json')
  .pipe($.bump({type: 'patch'}))
  .pipe(gulp.dest('./dist/'))
})

gulp.task('zip', function() {
  return gulp.src('./dist/**/**.*')
    .pipe($.zip('Veneer.zip'))
    .pipe(gulp.dest('./'));
})

gulp.task('release', ['build-ext', 'bump', 'zip'])

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
