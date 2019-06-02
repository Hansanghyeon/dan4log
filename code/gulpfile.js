// gulpfile.js
const   gulp = require('gulp');
// gulp plugin
const   sass = require('gulp-sass'),
        pug = require('gulp-pug'),
        sourcemaps = require('gulp-sourcemaps'),
        bb = require('gulp-babel'),
        ts = require('gulp-typescript'),
        autoprefixer = require('gulp-autoprefixer'),
        rename = require('gulp-rename');

// gulp notice plugin Slack
const   slack = require('gulp-slack')({
            url: 'https://hooks.slack.com/services/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',
            channel: 'dan_ec2',    // Optional
            user: 'Sass',       // Optional
            icon_url: 'https://cdn.4log.dev/icon/sass-1024x1024.png',   // Optional
            icon_emoji: ''  // Optional
        });


// gulp 4.0 변환

// 통합 scss
function sass_integrated(){
    return gulp
        .src('./scss/intergrated/style.min.scss')               // 입력 경로
        .pipe(sourcemaps.init())                                // 소스맵
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on(
                'error', function (err) {
                    slack([
                        {
                            'text' : '에러발생' ,
                            'color': '#da1836',
                            'fields': [
                                {
                                    'title': 'dan4log',
                                    'value': err.message.toString()
                                }
                            ]
                        }
                    ]);
                    console.log(err.message.toString());
                    this.emit('end');
                }
            )
        )
        .pipe(sourcemaps.write('/map',{sourcRoot: '.'}))        // 소스맵 경로 주석첨부
        .pipe(gulp.dest('../public/css/'));                     // 출력경로
}
// 분리형 scss
function sass_container(){
    return gulp
        .src('./scss/container/*.scss')                         // 입력경로
        .pipe(sourcemaps.init())                                // 소스맵
        .pipe(
            sass({outputStyle: 'compressed'})                   // minify
            .on('error', sass.logError)                         // log
        )
        .pipe(sourcemaps.write('/map',{sourcRoot: '.'}))        // 소스맵경로 주석첨부
        .pipe(gulp.dest('../public/css/'));                     // 출력경로
}

// Babel
function babel(){
    return gulp
        .src('./Babel/*.js')                                    // 입력경로
        .pipe(sourcemaps.init())                                // 소스맵
        .pipe(bb())                                          // complie
        .pipe(sourcemaps.write('/map/',{sourcRoot: '.'}))       // 소스맵경로 주석첨부
        .pipe(gulp.dest('../public/js/Babel/'));                      // 출력경로
}

// TypeScript
function typescript(){
    return gulp
        .src('./TypeScript/*.ts')                               // 입력경로
        .pipe(ts())                                             // complie  
        .pipe(gulp.dest('../public/js/TypeScript/'));           // 출력경로
}

// Crossbrowser
function cross_browser(){
    return gulp
        .src('../public/css/style.min.css')                     // 입력경로
        .pipe(autoprefixer({                                    // complie & option
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('style.min.prefix.css'))                   // 출력이름 변경
        .pipe(gulp.dest('../public/css/'));                     // 출력경로
}

// watch
gulp.task('hello', function(){
    gulp.watch('./scss/intergrated/*.scss', gulp.series(gulp.parallel(sass_integrated),cross_browser));
    gulp.watch('./scss/container/*.scss', gulp.series(gulp.parallel(sass_container)));
    gulp.watch('./Babel/*.js', gulp.series(babel));
    gulp.watch('./TypeScript/*.ts', gulp.series(typescript));
});
