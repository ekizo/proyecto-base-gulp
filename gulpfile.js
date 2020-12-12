const { task, watch, src, dest, series } = require('gulp');

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync');

 
function style(cb) {
    src('./source/scss/**/*.scss')
    	.pipe(sass().on('error',sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./public/css'))
    	.pipe(browserSync.stream());
        cb();
};

function includes(cb){
    src(['./source/views/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('./public'));
    cb();
};

function watcher(cb) {
    browserSync.init({
        server: {
           baseDir: "./public",
           index: "index.html"
        }
    });
    watch('./source/scss/**/*.scss', style)
    watch('./source/views/**/*.html', includes)
    watch('./source/layout/**/*.html', includes)
    watch('./source/components/**/*.html', includes)
    watch('./source/**/*.html').on('change',browserSync.reload);
    cb();
}



module.default = task('default', series([style, includes, watcher]));