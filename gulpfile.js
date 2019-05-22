const config = require("./config.json");

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const postcss = require('gulp-postcss');
const flexibility = require('postcss-flexibility');
const imagemin = require('gulp-imagemin');

/**
 * Gulp Taks
 */

gulp.task('start', function() {
  browserSync.init(config.browserSync);
});

gulp.task('reload', function () {
  browserSync.reload();
});

gulp.task('build:assets', function(){
  return gulp.src([config.paths.images.src])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(postcss([flexibility]))
    .pipe(gulp.dest(config.paths.styles.dist))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(config.paths.styles.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('build:css', function(){
  return gulp.src([config.paths.styles.src])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(postcss([flexibility]))
    .pipe(gulp.dest(config.paths.styles.dist))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(config.paths.styles.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('build:js', function(){
  return gulp.src([
    config.paths.scripts.src,
  ])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(config.paths.scripts.dist))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(config.paths.scripts.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('build:html', function () {
  return gulp.src(config.paths.html.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(gulp.dest(config.paths.html.dist))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('build:fonts', function () {
  return gulp.src(config.paths.fonts.src)
    .pipe(gulp.dest(config.paths.fonts.dist))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('build:images', function () {
  return gulp.src(config.paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(config.paths.images.dist))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('build:vendor', function () {
  return gulp.src(config.paths.vendor.src)
    .pipe(gulp.dest(config.paths.vendor.dist))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('compile', [
  'build:css',
  'build:js',
  'build:html',
  'build:images',
  'build:fonts',
  'build:vendor'

]);

gulp.task('default', ['start', 'compile'], function(){
  gulp.watch(config.paths.styles.src, ['build:css']);
  gulp.watch(config.paths.scripts.src, ['build:js']);
  gulp.watch(config.paths.html.watch, ['build:html']);
});
