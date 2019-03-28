// gulpfile.js
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

// 일반 컴파일
gulp.task('sass', function () {
    return gulp.src('./scss/style.min.scss') // 입력 경로
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('../')); // 출력 경로
});

// 런타임 중 파일 감시
gulp.task('sass:watch', function () {
    gulp.watch('./scss/*.scss', gulp.series('sass')); // 입력 경로와 파일 변경 감지 시 실행할 Actions(Task Name)
});

// Babel run!
gulp.task('babel', function () {
    return gulp.src('./Babel/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('./Babel/map/',{sourcRoot: '../src'}))
        .pipe(gulp.dest('./js/Babel/'));
});

gulp.task('babel:watch', function(){
    gulp.watch('./Babel/*.js', gulp.series('babel'));
});
