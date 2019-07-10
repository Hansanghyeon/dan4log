// gulpfile.js
const gulp = require("gulp");

// 프로젝트명
const PROJECT = "dan4log";

// cdn url
const CDN_URL = "https://cdn.4log.dev";

// gulp plugin
const sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  sourcemaps = require("gulp-sourcemaps"),
  bb = require("gulp-babel"),
  ts = require("gulp-typescript"),
  autoprefixer = require("autoprefixer"),
  postcss = require("gulp-postcss"),
  rename = require("gulp-rename"),
  awspublish = require("gulp-awspublish"),
  key = require("./key.js");

// gulp notice plugin Slack
// webhook url list
const slack_dataset = {
  space:
    "https://hooks.slack.com/services/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",
  icon_url: {
    sass: CDN_URL + "/icons/sass.png",
    babel: CDN_URL + "/icons/babel.png",
    typescript: CDN_URL + "/icons/typescript.png"
  }
};
function slack_notice(user, channel, url, icon_url) {
  var slack = require("gulp-slack")({
    url: url,
    channel: channel,
    user: user,
    icon_url: icon_url
  });

  return slack;
}

// gulp s3 upload
const publisher = awspublish.create({
  region: "ap-northeast-2",
  params: {
    Bucket: key.BUCKET.NAME
  },
  accessKeyId: key.BUCKET.ACCESSKEYID,
  secretAccessKey: key.BUCKET.SECRETACCESSKEY
});
var headers = {
  "Cache-Control": "max-age=315360000, no-transform, public"
};

// gulp 4.0 변환

// 통합 scss
function sass_mix() {
  return (
    gulp
      .src("./Scss/mix/style.min.scss")
      // 해당파일 소스맵생성
      .pipe(sourcemaps.init())
      // slick notice
      .pipe(
        sass({ outputStyle: "compressed" }).on("error", function(err) {
          slack_notice(
            "Sass",
            "",
            slack_dataset.space,
            slack_dataset.icon_url.sass
          )([
            {
              text: PROJECT,
              color: "#ec407a",
              fields: [
                {
                  title: "에러발생 | mix",
                  value: err.message.toString()
                }
              ]
            }
          ]);
          console.log(err.message.toString());
          this.emit("end");
        })
      )
      // source map 경로 css 마지막 추가
      .pipe(sourcemaps.write())
      // 소스맵할당 개발용 min파일
      .pipe(rename("style.min.dev.css"))
      // output
      .pipe(gulp.dest("../public/css/"))
      // s3 upload
      .pipe(
        rename(function(path) {
          path.dirname = PROJECT + "/css/" + path.dirname;
        })
      )
      .pipe(publisher.publish(headers))
      // .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  );
}
// 분리형 scss
function sass_single() {
  return (
    gulp
      .src("./Scss/single/*.scss")
      // 해당파일 소스맵생성
      .pipe(sourcemaps.init())
      // slick notice
      .pipe(
        sass({ outputStyle: "compressed" }).on("error", function(err) {
          slack_notice(
            "Sass",
            "",
            slack_dataset.space,
            slack_dataset.icon_url.sass
          )([
            {
              text: PROJECT,
              color: "#ec407a",
              fields: [
                {
                  title: "에러발생 | single",
                  value: err.message.toString()
                }
              ]
            }
          ]);
          console.log(err.message.toString());
          this.emit("end");
        })
      )
      // source map 경로 css 마지막 추가
      .pipe(sourcemaps.write())
      // output
      .pipe(gulp.dest("../public/css/"))
      // s3upload
      .pipe(
        rename(function(path) {
          path.dirname = PROJECT + "/css/" + path.dirname;
        })
      )
      .pipe(publisher.publish(headers))
      // .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  );
}

// Babel
function babel() {
  return (
    gulp
      .src("./Babel/*.js")
      .pipe(sourcemaps.init())
      .pipe(
        bb().on("error", function(err) {
          slack_notice(
            "Babel",
            "",
            slack_dataset.space,
            slack_dataset.icon_url.babel
          )([
            {
              text: PROJECT,
              color: "#fdd835",
              fields: [
                {
                  title: "에러발생 | Babel",
                  value: err.message.toString()
                }
              ]
            }
          ]);
          console.log(err.message.toString());
          this.emit("end");
        })
      )
      .pipe(sourcemaps.write("/map/", { sourcRoot: "." }))
      .pipe(gulp.dest("../public/js/"))
      // s3upload
      .pipe(
        rename(function(path) {
          path.dirname = PROJECT + "/js/" + path.dirname;
        })
      )
      .pipe(publisher.publish(headers))
      // .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  );
}

// TypeScript
function typescript() {
  return (
    gulp
      .src("./TypeScript/*.ts")
      .pipe(sourcemaps.init())
      .pipe(
        ts().on("error", function(err) {
          slack_notice(
            "Typescript",
            "",
            slack_dataset.space,
            slack_dataset.icon_url.typescript
          )([
            {
              text: PROJECT,
              color: "#0288d1",
              fields: [
                {
                  title: "에러발생 | Typescript",
                  value: err.message.toString()
                }
              ]
            }
          ]);
          console.log(err.message.toString());
          this.emit("end");
        })
      )
      .pipe(sourcemaps.write("/map/", { sourcRoot: "." }))
      .pipe(gulp.dest("../public/js/"))
      // s3upload
      .pipe(
        rename(function(path) {
          path.dirname = PROJECT + "/js/" + path.dirname;
        })
      )
      .pipe(publisher.publish(headers))
      // .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  );
}

// Crossbrowser
function cross_browser() {
  return (
    gulp
      .src("../public/css/style.min.dev.css")
      .pipe(postcss([autoprefixer()]))
      .pipe(rename("style.min.css"))
      // s3upload
      .pipe(
        rename(function(path) {
          path.dirname = PROJECT + "/css/" + path.dirname;
        })
      )
      .pipe(publisher.publish(headers))
      // .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  );
}

// watch
gulp.task("hello", function() {
  gulp.watch(
    "./Scss/mix/*.scss",
    gulp.series(gulp.parallel(sass_mix), cross_browser)
  );
  gulp.watch(
    "./Scss/single/*.scss",
    gulp.series(gulp.parallel(sass_single), cross_browser)
  );
  gulp.watch("./Babel/*.js", gulp.series(babel));
  gulp.watch("./TypeScript/*.ts", gulp.series(typescript));
});
