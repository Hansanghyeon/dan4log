// gulpfile.js
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var ts = require('gulp-typescript');
const autoprefixer = require('gulp-autoprefixer');

// gulp 4.0 변환

// 통합 scss
function sass_integrated(){
    return gulp.src('./scss/intergrated/style.min.scss') // 입력 경로
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('../')); // 출력 경로
}
// 분리형 scss
function sass_container(){
    return gulp.src('./scss/container/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
}

// Babel
function babel(){
    return gulp.src('./Babel/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('./Babel/map/',{sourcRoot: '../src'}))
        .pipe(gulp.dest('./js/Babel/'));
}

// TypeScript
function typescript(){
    return gulp.src('./TypeScript/*.ts')
        .pipe(ts())
        .pipe(gulp.dest('./js/TypeScript/'));
}

// Crossbrowser
function cross_browser(){
    return gulp.src('../style.min.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('../'));
}


// watch
gulp.task('hello', function(){
    gulp.watch('./scss/intergrated/*.scss', gulp.series(gulp.parallel(sass_integrated),cross_browser));
    gulp.watch('./scss/container/*.scss', gulp.series(gulp.parallel(sass_container)));
    gulp.watch('./Babel/*.js', gulp.series(babel));
    gulp.watch('./TypeScript/*.ts', gulp.series(typescript));
});
