var gulp           = require('gulp-param')(require('gulp'), process.argv);;
var sass           = require('gulp-sass');
var livereload     = require('gulp-livereload');
var sourcemaps     = require('gulp-sourcemaps');
var postcss        = require('gulp-postcss');
var autoprefixer   = require('autoprefixer');
var gpRename       = require('gulp-rename');
var jscs           = require('gulp-jscs');
var webpack        = require('webpack-stream');
var plumber        = require('gulp-plumber');
var concat         = require('gulp-concat');
var runSequence    = require('run-sequence');
var sassbulkImport = require('gulp-sass-bulk-import');
var rewriteCss     = require('gulp-rewrite-css');
var cleanCss       = require('gulp-clean-css');
var browserSync    = require('browser-sync').create();

// Paths
const paths = {
  dist: '../dist',
  src: '.',
  folders: {
    styles: '/styles',
    scss: '/styles',
    js: '/js',
    libs: '/libs',
    img: '/img'
  }
}

const defaultLocalhost = 'localhost';

// Compile JS
gulp.task('js', function() {
  // Use Jscs in order to inspect syntax and coding rules of js
  // Require .jscsrc file in folder root
  return gulp.src(paths.src + paths.folders.js + '/**/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter());

    gulp.src([paths.src + paths.folders.js + '/app.js'])
    // Init sourcemap generation 
    .pipe(sourcemaps.init())
    // Patch plugin is fixing issue with Node Streams piping.
    .pipe(plumber())
    // Package JS
    .pipe(webpack({
      output: {
        filename: '[name].js'
      }
    }))
    .pipe(gpRename('app.min.js'))
    // Write sourcemap in file
    .pipe(sourcemaps.write())
    // Write file
    .pipe(gulp.dest(paths.dist + paths.folders.js))
    // Reload page
    .pipe(livereload());
});

// Concat JS libs (with CSS files)
gulp.task('libs', function() {
  gulp.src(paths.src + paths.folders.libs + '/*.js')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(paths.dist + paths.folders.libs));

  return gulp.src(paths.src + paths.folders.libs + '/*.css')
    .pipe(concat('libs.css'))
    // Minify CSS
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.dist + paths.folders.libs));
});

// Compile styles
gulp.task('styles', function() {
  return gulp.src(paths.src + paths.folders.scss + '/styles.scss')
    // Start sourcemap generation
    .pipe(sourcemaps.init())
    // Permit importation of all scss file of a folder
    .pipe(sassbulkImport())
    // Include Bourbon library in path
    .pipe(sass({
      includePaths: [require( 'bourbon' ).includePaths]
    })
      .on('error', sass.logError))
    // Add prefixer for 10 versions older browser
    // and add all Media queries at the end of CSS final file
    .pipe(postcss(
      [
        autoprefixer({ browsers: ['last 10 versions','ie >=9'] }),
        require('css-mqpacker')
      ]))
    // Change URL for all path in CSS final file
    .pipe(rewriteCss({
      adaptPath: function (e) {
          console.log('Changement de l\'url du fichier ' + e.targetFile);
        },
      destination: paths.dist + paths.folders.img
      }))
    // Write sourcemap
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist + paths.folders.styles))
    // Reload page
    .pipe(livereload());
});

// Watch files in order to auto compile files
gulp.task('watch', function(bs) {
  livereload.listen();

  // If 'gulp watch --bs', browser-sync start a proxy
  // If 'gulp watch --bs another-localhost.dev' is precised, browser-sync start a proxy from another-localhost.dev
  if (typeof bs !== 'undefined') {
    bs = typeof bs === 'string' ? bs : defaultLocalhost;

    browserSync.init({
      proxy: bs
    });
  }


  gulp.watch(paths.src + paths.folders.scss + '/**/*.scss', ['styles']);
  gulp.watch([paths.src + paths.folders.js + '/app.js', paths.src + paths.folders.js + '/components/*.js'], ['js']);
});

// Run all tasks
gulp.task('build', function() {
  runSequence(['styles', 'js', 'libs']);
});
