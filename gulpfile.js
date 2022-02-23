/*
|-assets
|  |__fonts
|  |__img
|  |__js
|    |__index.js
|  |__css
|    |__index.css
|  |__index.html
|
|-src
|  |__fonts
|  |__html-_templates
|      |__ _header.html
|      |__ _footer.html
|  |__img
|  |__js
|    |__index.js
|  |__scss
|    |__index.scss
|  |__index.html
|
|-node_modules
|-gulpfile.js
|-package.json


*/


'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),


    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'), // зборка в один файл разных файлов
    fileinclude = require('gulp-file-include'), //include html

    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;


// ---------------------------------------------------------------------------------
// PATH----PATH----PATH----PATH----PATH----PATH----PATH----PATH----PATH----PATH-----
// ---------------------------------------------------------------------------------

let path = {
  //папка куда складываются готовые файлы
    assets: {
        html: 'assets/',
        js: 'assets/js/',
        css: 'assets/css/',
        img: 'assets/img/',
        fonts: 'assets/fonts/',
        libs: 'assets/libs/',
    },
    //папка откуда брать файлы
    src: {
        html: 'src/[^_]*.html',
        js: 'src/js/**/*.js',
        scss: 'src/scss/*.scss',
        img: 'src/img/**/**/*.*',
        fonts: 'src/fonts/**/*.*',
        libs: 'src/libs/**/**/*.*',

        html_templates: 'src/html-_templates/**/*.html'
    },
    //указываем после измененя каких файлов нужно действовать
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        libs: 'src/libs/**/*.*',
    },
    clean: './assets'
};

var config = {
  server: {
      baseDir: "./assets"
  },
  // tunnel: true,
  host: 'localhost',
  port: 3000,
  logPrefix: "liudmila.front-end"
};

// ---------------------------------------------------------------------------------
// TASKS----TASKS----TASKS----TASKS----TASKS----TASKS----TASKS----TASKS----TASKS----
// ---------------------------------------------------------------------------------

gulp.task('html:assets', function () {
  gulp.src(path.src.html) //Выберем файлы по нужному пути
      // .pipe(rigger()) //Прогоним через rigger
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest(path.assets.html)) //Выплюнем их в папку assets
      .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:assets', function () {
  gulp.src(path.src.js) //Найдем наш main файл
      // .pipe(rigger()) //Прогоним через rigger
      // .pipe(sourcemaps.init()) //Инициализируем sourcemap
      // .pipe(uglify()) //Сожмем наш js
      // .pipe(sourcemaps.write()) //Пропишем карты
      .pipe(gulp.dest(path.assets.js)) //Выплюнем готовый файл в assets
      .pipe(reload({stream: true})); //И перезагрузим сервер
});


gulp.task('scss:assets', function () {
  gulp.src(path.src.scss) //Выберем наш scss
      // .pipe(sourcemaps.init()) //То же самое что и с js
      .pipe(sass().on('error', notify.onError(
        {
          message: "<%= error.message %>",
          title  : '   (╯°□°）╯   '
        }))
      )
      .pipe(prefixer({overrideBrowserslist: ['last 4 versions']})) //Добавим вендорные префиксы
      // .pipe(cssmin()) //Сожмем
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.assets.css)) //И в assets
      .pipe(reload({stream: true}));
});

gulp.task('image:assets', function () {
  gulp.src(path.src.img) //Выберем наши картинки
      .pipe(imagemin({ //Сожмем их
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()],
          interlaced: true
      }))
      .pipe(gulp.dest(path.assets.img)) //И бросим в assets
      .pipe(reload({stream: true}));
});

gulp.task('libs:assets', function() {
  gulp.src(path.src.libs)
      .pipe(gulp.dest(path.assets.libs))
});

gulp.task('fonts:assets', function() {
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.assets.fonts))
});

// ---------------------------------------------------------------------------------
// START----START----START----START----START----START----START----START----START----
// ---------------------------------------------------------------------------------

gulp.task('assets', [
  'html:assets',
  'js:assets',
  'scss:assets',
  'libs:assets',
  'fonts:assets',
  'image:assets',
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
      gulp.start('html:assets');
  });
  watch([path.watch.scss], function(event, cb) {
      gulp.start('scss:assets');
  });
  watch([path.watch.js], function(event, cb) {
      gulp.start('js:assets');
  });
  watch([path.watch.img], function(event, cb) {
      gulp.start('image:assets');
  });
  watch([path.watch.libs], function(event, cb) {
    gulp.start('libs:assets');
});
  watch([path.watch.fonts], function(event, cb) {
      gulp.start('fonts:assets');
  });
});

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['assets', 'webserver', 'watch']);