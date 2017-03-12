'use strict';

let gulp = require('gulp');
let watch = require('gulp-watch');
let prefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
let concat = require("gulp-concat");
let cssmin = require('gulp-minify-css');
let less = require('gulp-less');
let imagemin = require('gulp-imagemin');
let browserSync = require("browser-sync");
let jpegtran = require('imagemin-jpegtran');
let nodemon = require('gulp-nodemon');
let reload = browserSync.reload;


let babel = require("gulp-babel");

let path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        models: 'build/models/',
        view_models: 'build/view_models/',
    },
    src: { //Пути откуда брать исходники
        html: 'src/blocks/**/*.html', //мы хотим взять все файлы с расширением .html
        js: 'src/blocks/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/blocks/**/*.css',
        img: 'src/blocks/**/img/*.*', //Синтаксис /**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        models: 'src/models/**/*.*',
        view_models: 'src/view_models/**/*.*',
    },
    watch: { //Ослеживаем изменения тих файлов
        html: 'src/**/*.html',
        js: 'src/**/*.js',
        style: 'src/**/*.css',
        img: 'src/**/img/*.*',
        fonts: 'src/*/fonts/**/*.*',
        models: 'src/models/**/*.*',
        view_models: 'src/view_models/**/*.*',
    },
    clean: './build'
};

gulp.task('html:build', () => {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', () => {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(babel()) //переводим ES6 => ES5
        .pipe(uglify()) //Сожмем наш js
        .pipe(concat('all.js')) //Конкатинируем js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', () => {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(less()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(concat('all.css')) //Конкатинируем css
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', () => {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [jpegtran()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', () => {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('sjs:build', () => {
    gulp.src(path.src.view_models)
        .pipe(gulp.dest(path.build.view_models));
    gulp.src(path.src.models)
        .pipe(gulp.dest(path.build.models));
});

gulp.task('build', [

    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'sjs:build',
]);

gulp.task('watch', () => {
    watch([path.watch.html], (event, cb) => {
        gulp.start('html:build');
    });
    watch([path.watch.style], (event, cb) => {
        gulp.start('style:build');
    });
    watch([path.watch.js], (event, cb) => {
        gulp.start('js:build');
    });
    watch([path.watch.img], (event, cb) => {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], (event, cb) => {
        gulp.start('fonts:build');
    });
});

gulp.task('clean', (cb) => {
    rimraf(path.clean, cb);
});

gulp.task('nodemon', (cb) => {
    let called = false;
    return nodemon({
        script: 'app.js',
        ignore: [
            'gulpfile.js',
            'node_modules/'
        ]
    })
        .on('start', () => {
            if (!called) {
                called = true;
                cb();
            }
        })
        .on('restart', () => {
            setTimeout(() => {
                reload({stream: false});
            }, 1000);
        });
});


gulp.task('webserver', ['nodemon'], () => {
    browserSync({
        proxy: "localhost:8080",  // порт приложения
        port: 5000,  // другой порт
        notify: true
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);
