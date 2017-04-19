'use strict';

const rename = require('gulp-rename');
const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
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

const PARTIAL_REGEXP = /\{\{\s*>\s*([\w-]+)/g;

let path = {

    build: { // тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/html',
        hb: 'build/hbs',
        layouts: 'build/layouts/',
        blocksJs: 'build/public/js/',
        css: 'build/public/css/',
        img: 'build/public/img/',
        fonts: 'build/fonts/'
    },
    src: { // пути откуда брать исходники
        html: 'src/blocks/**/*.html', // мы хотим взять все файлы с расширением .html
        hb: 'src/blocks/**/*.hbs', // мы хотим взять все файлы с расширением .html
        layouts: 'src/blocks/layouts/*.hbs', // layouts берем отсюда
        blocksJs: 'src/blocks/**/*.js', // в стилях и скриптах нам понадобятся только main файлы
        style: 'src/blocks/**/*.less',
        styleRaw: 'src/blocks/**/*.css',
        img: 'src/blocks/**/img/*.*',
        // синтаксис /**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },

    clean: './build'
};

path.src.js = ['!' + path.src.blocksJs, 'src/**/*.js'];
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

function bufferReplace(file, match, replacer) {
    /**
     * @param file: File - Файл в котором заменяем даные
     * @param match: String/RegEx - шаблон, по которому будем сравнивать строки
     * @param replacer: String/Function - строка или функция возвращающая строку,
     * на которую будет заменена строка, подходящая под шаблон
     * @returns None
     */
    file.contents = new Buffer(file.contents.toString().replace(match, replacer));
}

function isPartialExist(partialName, path, root) {
    /**
     * проверяет есть существует ли такой partial
     * @partialName: String - имя partial внутри которого идет поиск
     * @param match: String - Строка {{>partial
     * @return Bool - если существует путь : true
     */
    root = root || path;
    let dirs = fs.readdirSync(path);
    for (let i = 0; i < dirs.length; i++) {
        let dir = path + dirs[i];
        if (!fs.statSync(dir).isDirectory()) {
            continue;
        }
        if (getUniqueBlockName(dir.replace(root, '')) === partialName ||
            isPartialExist(partialName, dir + Path.sep, root)) {
            return true;
        }
    }
}

function relativeToAbsolutePartial(partialName, match) {
    /**
     * функция поиска абсолютного пути partials
     * @partialName: String - имя partial внутри которого идет поиск
     * @param match: String - Строка {{>partial
     * @return String - абсолютный путь
     */
    let partialAbsoluteName = partialName + '-' + match.replace(PARTIAL_REGEXP, '$1');

    return isPartialExist(partialAbsoluteName, Path.join('src', 'blocks') + Path.sep) ?
        '{{>' + partialAbsoluteName : match;
}

function buildPartials(file) {
    /*
     * определяет путь до блока и заменяет на абсолюьный блок
     * @param file: File - Файл в котором заменяем partials
     * @returns None
     */
    let dir = Path.dirname(file.relative);
    let partialName = getUniqueBlockName(dir);
    bufferReplace(file, PARTIAL_REGEXP, relativeToAbsolutePartial.bind(this, partialName));
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
            buildPartials(file);
        }))
        .pipe(rename(path => {
            /* для того чтобы не было колизий в partials имена в build
             будут выглядеть так: путь-до-файла-из-blocks-файл.hbs
             в шаблонах partials нужно будет указывать именно так */
            let dir = path.dirname;
            path.dirname = '';
            path.basename = getUniqueBlockName(dir);
        }))
        .pipe(htmlmin({
            collapseWhitespace: true, caseSensetive: true,
            customAttrSurround: [[/\{\{#if\s*\w*\}\}/, /\{\{\/if\}\}/]]
        }))
        .pipe(gulp.dest(path.build.hb)) // выплюнем их в папку build
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений

    gulp.src(path.src.layouts) // выберем файлы по нужному пути
        .pipe(isWatching ? plumber() : noop())
        .pipe(gulp.dest(path.build.layouts)) // выплюнем их в папку build
        .pipe(changed({firstPass: firstPass}))
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений
});

function makeJsNamespace() {
    return tap(file => {
        let dir = Path.dirname(file.relative);
        if (dir === '.') {
            return;
        }
        let className = getUniqueBlockName(dir);
        file.contents = Buffer.concat([
            new Buffer('(function () {document.querySelectorAll(\'.' + className + '\').forEach(block => {'),
            file.contents,
            new Buffer('})}());')
        ]);
    });
}

gulp.task('js:build', () => {
    gulp.src(path.src.blocksJs) // найдем наш main файл
        .pipe(isWatching ? plumber() : noop())
        .pipe(sourcemaps.init()) // инициализируем sgulpourcemap
        .pipe(makeJsNamespace())
        .pipe(babel()) // переводим ES6 => ES5
        .pipe(uglify()) // сожмем наш js
        .pipe(sourcemaps.write()) // пропишем карты
        .pipe(gulp.dest(path.build.blocksJs)) // выплюнем готовый файл в build
        .pipe(changed({firstPass: firstPass}))
        .pipe(livereload()); // и перезагрузим сервер

    polyfiller.bundle(['Promise', 'Fetch'])
        .pipe(uglify()) // сожмем наш js
        .pipe(gulp.dest(path.build.blocksJs));
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
            bufferReplace(file, /img\/([A-Za-z0-9.]+)/g, '/static/img/' + Path.dirname(file.relative) + '/img/$1');
        }))
        .pipe(concat('less-files.css'))
        .pipe(less());

    let cssStream = gulp.src(path.src.styleRaw)
        .pipe(concat('css-files.css'));

    return merge(lessStream, cssStream)
        .pipe(isWatching ? plumber() : noop())
        .pipe(concat('all.css')) // конкатинируем css
        .pipe(prefixer()) // добавим вендорные префиксы
        .pipe(cleanCSS()) // сожмем
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

gulp.task('build', [
    'html:build',
    'hb:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('style:lint', () => {
    return gulp.src([path.src.styleRaw, path.src.style])
        .pipe(isWatching ? plumber() : noop())
        .pipe(stylelint({
            debug: true,
            failAfterError: !isWatching,
            reporters: [
                {formatter: 'string', console: true}
            ]
        }));
});

gulp.task('html:lint', () => {
    return gulp.src(path.src.html)
        .pipe(isWatching ? plumber() : noop())
        .pipe(htmllint())
        .pipe(htmllint.format())
        .pipe(isWatching ? noop() : htmllint.failOnError());
});

gulp.task('hb:lint', () => {
    return gulp.src(path.src.hb)
        .pipe(isWatching ? plumber() : noop())
        .pipe(htmllint())
        .pipe(htmllint.format())
        .pipe(isWatching ? noop() : htmllint.failOnError());
});

gulp.task('js:lint', () => {
    return gulp.src([
        'src/**/*.js',
        'gulpfile.js',
        'app.js'
    ])
        .pipe(isWatching ? plumber() : noop())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(isWatching ? noop() : eslint.failOnError());
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

    watch([
        'gulpfile.js',
        'app.js',
        'src/**/*.js'], () => {
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
    watch(path.src.js, () => {
        demon.emit('restart');
    });
});

gulp.task('default', gulpSequence('watch', 'lint', 'build', 'webserver'));
