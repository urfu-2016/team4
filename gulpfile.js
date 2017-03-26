'use strict';

const rename = require('gulp-rename');
const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const runSequence = require('run-sequence');
const polyfiller = require('gulp-polyfiller');
const watch = require('gulp-watch');
const prefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');
const jpegtran = require('imagemin-jpegtran');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const changed = require('gulp-changed-in-place');
const babel = require('gulp-babel');
const Path = require('path');
const tap = require('gulp-tap');
const util = require('util');
const noop = require('gulp-noop');
const merge = require('merge-stream');
const plumber = require('gulp-plumber');
const stylelint = require('gulp-stylelint');
const htmllint = require('gulp-html-lint');
const eslint = require('gulp-eslint');
const rimraf = require('rimraf');
const fs = require('fs');
const htmlmin = require('gulp-htmlmin');

let path = {

    build: { // тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/html',
        hb: 'build/hbs',
        layouts: 'build/layouts/',
        js: 'build/public/js/',
        css: 'build/public/css/',
        img: 'build/public/img/',
        fonts: 'build/fonts/',
        models: 'build/models/',
        viewModels: 'build/view_models/',
        controllers: 'build/controllers/'
    },
    src: { // пути откуда брать исходники
        html: 'src/blocks/**/*.html', // мы хотим взять все файлы с расширением .html
        hb: 'src/blocks/**/*.hbs', // мы хотим взять все файлы с расширением .html
        layouts: 'src/blocks/layouts/*.hbs', // layouts берем отсюда
        js: 'src/blocks/**/*.js', // в стилях и скриптах нам понадобятся только main файлы
        style: 'src/blocks/**/*.less',
        styleRaw: 'src/blocks/**/*.css',
        img: 'src/blocks/**/img/*.*',
        // синтаксис /**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        models: 'src/models/**/*.*',
        viewModels: 'src/view_models/**/*.*',
        controllers: 'src/controllers/**/*.*'
    },

    clean: './build'
};

path.watch = path.src;

let firstPass = true;
let isWatching = false;

function getUniqueBlockName(directory, camelCase) {
    /**
     * @param directory: String - директория относительно src/blocks/
     * @returns String - уникальное имя компоненты
     */

    if (directory === '.') {
        return '';
    }

    let blockName = directory.split(Path.sep).join('-');
    if (!camelCase) {
        return blockName;
    }

    return directory.split('-').map(x => {
        return x.charAt(0).toUpperCase() + x.slice(1);
    }).join('');
}

gulp.task('html:build', () => {
    gulp.src(path.src.html) // выберем файлы по нужному пути
        .pipe(isWatching ? plumber() : noop())
        .pipe(gulp.dest(path.build.html)) // выплюнем их в папку build
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений
});

function bufferReplace(file, match, str) {
    /**
     * @param file: File - Файл в котором заменяем даные
     * @param match: String/RegEx - шаблон, по которому будем сравнивать строки
     * @param str: String - строка, на которую будет заменена строка, подходящая под шаблон
     * @returns None
     */
    file.contents = new Buffer(file.contents.toString().replace(match, str));
}

gulp.task('hb:build', () => {
    gulp.src([path.src.hb, '!' + path.src.layouts]) // выберем файлы по нужному пути
        .pipe(isWatching ? plumber() : noop())
        .pipe(changed({firstPass: firstPass}))
        .pipe(tap(file => {
            let dir = Path.dirname(file.relative);
            let className = getUniqueBlockName(dir);
            let files = fs.readdirSync(Path.join('src/blocks', dir)).filter(file => {
                return file.includes('.js');
            });
            let headerBlock = '';
            if (files.length) {
                headerBlock = '{{#section \'scripts\'}}\n';
                files.forEach(file => {
                    headerBlock += '\t<script src="/static/js/' + Path.join(dir, file) + '"></script>\n';
                });
                headerBlock += '{{/section}}\n';
            }
            file.contents = Buffer.concat([
                new Buffer(headerBlock),
                new Buffer(util.format('<div class="%s{{#if blockClass}} {{blockClass}}{{/if}}">\n', className)),
                file.contents,
                new Buffer('</div>')
            ]);
            // меняем адреса с картинками на /static/img...
            bufferReplace(file, /img\/([A-Za-z0-9.]+)/g, '/static/img/' + dir + '/img/$1');
            bufferReplace(file, /\{\{\s*bind-attr\s+(\w*)\s*=\s*"(\w*):(\w*)"\s*\}\s*\}/g,
                '{{#if $2}}$1="{{$3}}"{{/if}}');
            bufferReplace(file, /<!--.*-->\n/g, '');
        }))
        .pipe(rename(path => {
            /* для того чтобы не было колизий в partials имена в build
             будут выглядеть так: путь-до-файла-из-blocks-файл.hbs
             в шаблонах partials нужно будет указывать именно так */
            let dir = path.dirname;
            path.dirname = '';
            path.basename = getUniqueBlockName(dir);
        }))
        .pipe(htmlmin({collapseWhitespace: true, caseSensetive: true,
            customAttrSurround: [[/\{\{#if\s*\w*\}\}/, /\{\{\/if\}\}/]]}))
        .pipe(gulp.dest(path.build.hb)) // выплюнем их в папку build
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений

    gulp.src(path.src.layouts) // выберем файлы по нужному пути
        .pipe(isWatching ? plumber() : noop())
        .pipe(gulp.dest(path.build.layouts)) // выплюнем их в папку build
        .pipe(changed({firstPass: firstPass}))
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений
});

gulp.task('js:build', () => {
    gulp.src(path.src.js) // найдем наш main файл
        .pipe(isWatching ? plumber() : noop())
        .pipe(sourcemaps.init()) // инициализируем sgulpourcemap
        .pipe(babel()) // переводим ES6 => ES5
        .pipe(uglify()) // сожмем наш js
        .pipe(sourcemaps.write()) // пропишем карты
        .pipe(gulp.dest(path.build.js)) // выплюнем готовый файл в build
        .pipe(changed({firstPass: firstPass}))
        .pipe(livereload()); // и перезагрузим сервер

    polyfiller.bundle(['Promise', 'Fetch'])
        .pipe(uglify()) // сожмем наш js
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', () => {
    let lessStream = gulp.src(path.src.style)
        .pipe(isWatching ? plumber() : noop())
        .pipe(tap(file => {
            let className = getUniqueBlockName(Path.dirname(file.relative));
            if (!className) {
                return;
            }
            file.contents = Buffer.concat([
                new Buffer('.' + className + '{\n'),
                file.contents,
                new Buffer('}')
            ]);
            // меняем адреса с картинками на /static/img...
            bufferReplace(file, /img\/([A-Za-z0-9.]+)/g, '/static/img/' + file.relative + '/img/$1');
        }))
        .pipe(concat('less-files.css'))
        .pipe(less());

    let cssStream = gulp.src(path.src.styleRaw)
        .pipe(concat('css-files.css'));

    return merge(lessStream, cssStream)
        .pipe(isWatching ? plumber() : noop())
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(concat('all.css')) // конкатинируем css
        .pipe(prefixer()) // добавим вендорные префиксы
        .pipe(cleanCSS()) // сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) // и в build
        .pipe(changed({firstPass: firstPass}))
        .pipe(livereload());
});

gulp.task('image:build', () => {
    gulp.src(path.src.img) // выберем наши картинки
        .pipe(imagemin({ // сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [jpegtran()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) // и бросим в build
        .pipe(livereload());
});

gulp.task('fonts:build', () => {
    gulp.src(path.src.fonts)
        .pipe(changed({firstPass: firstPass}))
        .pipe(gulp.dest(path.build.fonts))
        .pipe(livereload());
});

gulp.task('sjs:build', () => {
    let viewModelsStream = gulp.src(path.src.viewModels)
        .pipe(changed({firstPass: firstPass}))
        .pipe(gulp.dest(path.build.viewModels));

    let modelsStream = gulp.src(path.src.models)
        .pipe(changed({firstPass: firstPass}))
        .pipe(gulp.dest(path.build.models));

    let ctrlStream = gulp.src(path.src.controllers)
        .pipe(changed({firstPass: firstPass}))
        .pipe(gulp.dest(path.build.controllers));

    return merge(viewModelsStream, modelsStream, ctrlStream);
});

gulp.task('build', [
    'html:build',
    'hb:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'sjs:build'
]);

gulp.task('style:lint', () => {
    gulp.src([path.src.styleRaw, path.src.style])
        .pipe(isWatching ? plumber() : noop())
        .pipe(stylelint({
            debug: true,
            failAfterError: true,
            reporters: [
                {formatter: 'string', console: true}
            ]
        }));
});

gulp.task('html:lint', () => {
    gulp.src(path.src.html)
        .pipe(isWatching ? plumber() : noop())
        .pipe(htmllint())
        .pipe(htmllint.format())
        .pipe(htmllint.failOnError());
});

gulp.task('hb:lint', () => {
    gulp.src(path.src.hb)
        .pipe(isWatching ? plumber() : noop())
        .pipe(htmllint())
        .pipe(htmllint.format())
        .pipe(htmllint.failOnError());
});

gulp.task('js:lint', () => {
    gulp.src([path.src.js,
        'gulpfile.js',
        'app.js',
        'tests/**/*.js',
        path.src.models,
        path.src.controllers,
        path.src.viewModels])
        .pipe(isWatching ? plumber() : noop())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('lint', [
    'style:lint',
    'html:lint',
    'hb:lint',
    'js:lint'
]);

gulp.task('watch', () => {
    isWatching = true;

    watch([path.watch.html], () => {
        gulp.start('html:build');
        gulp.start('html:lint');
    });

    watch([path.watch.style, path.watch.styleRaw], () => {
        gulp.start('style:lint');
        gulp.start('style:build');
    });

    watch([path.watch.js,
        'gulpfile.js',
        'app.js',
        'tests/**/*.js',
        path.src.models,
        path.src.controllers,
        path.src.viewModels], () => {
        gulp.start('js:build');
        gulp.start('js:lint');
    });

    watch([path.watch.hb, path.watch.layouts], () => {
        gulp.start('hb:build');
        gulp.start('hb:lint');
    });

    watch([path.watch.img], () => {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], () => {
        gulp.start('fonts:build');
    });
});

gulp.task('clean', cb => {
    rimraf(path.clean, cb);
});

gulp.task('webserver', () => {
    livereload.listen();
    firstPass = false;
    // configure nodemon
    const demon = nodemon({
        // the script to run the app
        script: 'app.js',
        watch: 'app.js'
    });
    watch([path.watch.controllers, path.watch.models, path.watch.viewModels], () => {
        runSequence('sjs:build', () => {
            console.log('done');
            demon.emit('restart');
        });
    });
});

gulp.task('default', gulpSequence('watch', 'lint', 'build', 'webserver'));
