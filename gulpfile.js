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
<<<<<<< ec08867e7a8bb3b20ca5d58c5dfff6eee9346c4e
const merge = require('merge-stream');
const plumber = require('gulp-plumber');
const lesshint = require('gulp-lesshint');
const stylelint = require('gulp-stylelint');
const htmllint = require('gulp-html-lint');
const eslint = require('gulp-eslint');
const rimraf = require('rimraf');
const fs = require('fs');
const htmlmin = require('gulp-htmlmin');

let path = {

    build: { // тут мы укажем куда складывать готовые после сборки файлы
=======
const path = {

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    build: { // Тут мы укажем куда складывать готовые после сборки файлы
>>>>>>> починила линт
        html: 'build/html',
        hb: 'build/hbs',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        layouts: 'build/layouts/',
        js: 'build/public/js/',
        css: 'build/public/css/',
        img: 'build/public/img/',
        fonts: 'build/fonts/',
        models: 'build/models/',
        viewModels: 'build/view_models/',
        controllers: 'build/controllers/'
    },
<<<<<<< ec08867e7a8bb3b20ca5d58c5dfff6eee9346c4e
    src: { // пути откуда брать исходники
        html: 'src/blocks/**/*.html', // мы хотим взять все файлы с расширением .html
        hb: 'src/blocks/**/*.hbs', // мы хотим взять все файлы с расширением .html
        layouts: 'src/blocks/layouts/*.hbs', // layouts берем отсюда
        js: 'src/blocks/**/*.js', // в стилях и скриптах нам понадобятся только main файлы
        style: 'src/blocks/**/*.less',
        styleRaw: 'src/blocks/**/*.css',
        img: 'src/blocks/**/img/*.*',
        // синтаксис /**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
=======
    src: { // Пути откуда брать исходники
        html: 'src/blocks/**/*.html', // мы хотим взять все файлы с расширением .html
        hb: 'src/blocks/**/*.hbs', // мы хотим взять все файлы с расширением .html
        layouts: 'src/blocks/layouts/*.hbs', //layouts берем отсюда
        js: 'src/blocks/**/*.js', // В стилях и скриптах нам понадобятся только main файлы
        style: 'src/blocks/**/*.less',
        img: 'src/blocks/**/img/*.*', //Синтаксис /**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        models: 'src/models/**/*.*',
        view_models: 'src/view_models/**/*.*',
        controllers: 'src/controllers/**/*.*'
    },

    watch: { //Ослеживаем изменения тих файлов
        html: 'src/**/*.html',
        hb: 'src/**/*.hbs',
        js: 'src/**/*.js',
        style: 'src/**/*.css',
        img: 'src/**/img/*.*',
        fonts: 'src/*/fonts/**/*.*',
>>>>>>> починила линт
        fonts: 'src/fonts/**/*.*',
        models: 'src/models/**/*.*',
        viewModels: 'src/view_models/**/*.*',
        controllers: 'src/controllers/**/*.*'
    },

    clean: './build'
};

path.watch = path.src;

let firstPass = true;

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
        .pipe(plumber())
        .pipe(gulp.dest(path.build.html)) // выплюнем их в папку build
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений
=======
	build: { // Тут мы укажем куда складывать готовые после сборки файлы
		html: 'build/html',
		hb: 'build/hbs',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		layouts: 'build/layouts/',
		js: 'build/public/js/',
		css: 'build/public/css/',
		img: 'build/public/img/',
		fonts: 'build/fonts/',
		models: 'build/models/',
		view_models: 'build/view_models/',
		controllers: 'build/controllers/'
	},
	src: { // Пути откуда брать исходники
		html: 'src/blocks/**/*.html', // мы хотим взять все файлы с расширением .html
		hb: 'src/blocks/**/*.hbs', // мы хотим взять все файлы с расширением .html
		layouts: 'src/blocks/layouts/*.hbs', // layouts берем отсюда
		js: 'src/blocks/**/*.js', // В стилях и скриптах нам понадобятся только main файлы
		style: 'src/blocks/**/*.less',
		img: 'src/blocks/**/img/*.*', // Синтаксис /**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
		fonts: 'src/fonts/**/*.*',
		models: 'src/models/**/*.*',
		view_models: 'src/view_models/**/*.*',
		controllers: 'src/controllers/**/*.*'
	},

	watch: { // Ослеживаем изменения тих файлов
		html: 'src/**/*.html',
		hb: 'src/**/*.hbs',
		js: 'src/**/*.js',
		style: 'src/**/*.css',
		img: 'src/**/img/*.*',
		fonts: 'src/*/fonts/**/*.*',
		fonts: 'src/fonts/**/*.*',
		models: 'src/models/**/*.*',
		view_models: 'src/view_models/**/*.*',
		controllers: 'src/controllers/**/*.*'
	},
	clean: './build'
};

function getUniqueBlockName(directory) {
	if (directory === '.') {
		return '';
	}

	return directory.split(Path.sep).join('-');
}

gulp.task('html:build', () => {
	gulp.src(path.src.html) // Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html)) // Выплюнем их в папку build
        .pipe(reload({stream: true})); // И перезагрузим наш сервер для обновлений
>>>>>>> настроила тесты
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
<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    gulp.src([path.src.hb, '!' + path.src.layouts]) // выберем файлы по нужному пути
        .pipe(plumber())
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
                new Buffer(util.format('<div class="%s">\n', className)),
                file.contents,
                new Buffer('</div>')
            ]);
            // меняем адреса с картинками на /static/img...
            bufferReplace(file, /img\/([A-Za-z0-9.]+)/g, '/static/img/' + dir + '/img/$1');
            bufferReplace(file, /\{\{\s*bind-attr\s+(\w*)\s*=\s*"(\w*):(\w*)"\s*\}\s*\}/g,
                '{{#if $2}}$1={{$3}}{{/if}}');
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
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.hb)) // выплюнем их в папку build
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений
=======
	gulp.src([path.src.hb, '!' + path.src.layouts]) // Выберем файлы по нужному пути
        .pipe(tap((file, t) => {
	let className = getUniqueBlockName(Path.dirname(file.relative));
	file.contents = Buffer.concat([
		new Buffer(util.format('<div class="%s">\n', className)),
		file.contents,
		new Buffer('<\div>')
	]);
}))
        .pipe(rename(path => {
            // для того чтобы не было колизий в partials имена в build
            // будут выглядеть так: путь-до-файла-из-blocks-файл.hbs
            // в шаблонах partials нужно будет указывать именно так
	let dir = path.dirname;
	path.dirname = '';
	path.basename = getUniqueBlockName(dir);
}))
>>>>>>> настроила тесты

<<<<<<< ec08867e7a8bb3b20ca5d58c5dfff6eee9346c4e
    gulp.src(path.src.layouts) // выберем файлы по нужному пути
        .pipe(plumber())
        .pipe(gulp.dest(path.build.layouts)) // выплюнем их в папку build
        .pipe(changed({firstPass: firstPass}))
        .pipe(livereload()); // и перезагрузим наш сервер для обновлений
=======
        .pipe(gulp.dest(path.build.hb)) // Выплюнем их в папку build
        .pipe(reload({stream: true})); // И перезагрузим наш сервер для обновлений

<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    gulp.src(path.src.layouts) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.layouts)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений

>>>>>>> починила линт
});

gulp.task('js:build', () => {
    gulp.src(path.src.js) // найдем наш main файл
        .pipe(plumber())
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
<<<<<<< ec08867e7a8bb3b20ca5d58c5dfff6eee9346c4e
    let lessStream = gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(tap(file => {
=======
    gulp.src(path.src.style) //Выберем наши less файлы
        .pipe(sourcemaps.init()) // То же самое что и с js
        .pipe(tap((file, t) => {

>>>>>>> починила линт
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
        .pipe(less())
        .pipe(concat('less-files.css'));

<<<<<<< ec08867e7a8bb3b20ca5d58c5dfff6eee9346c4e
    let cssStream = gulp.src(path.src.styleRaw)
        .pipe(concat('css-files.css'));
=======
	gulp.src(path.src.layouts) // Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.layouts)) // Выплюнем их в папку build
        .pipe(reload({stream: true})); // И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', () => {
	gulp.src(path.src.js) // Найдем наш main файл
        .pipe(sourcemaps.init()) // Инициализируем sourcemap
        .pipe(babel()) // переводим ES6 => ES5
        .pipe(uglify()) // Сожмем наш js
        .pipe(concat('all.js')) // Конкатинируем js
        .pipe(sourcemaps.write()) // Пропишем карты
        .pipe(gulp.dest(path.build.js)) // Выплюнем готовый файл в build
        .pipe(reload({stream: true})); // И перезагрузим сервер
});

gulp.task('style:build', () => {
	gulp.src(path.src.style) // Выберем наши less файлы
        .pipe(sourcemaps.init()) // То же самое что и с js
        .pipe(tap((file, t) => {
	let className = getUniqueBlockName(Path.dirname(file.relative));
	if (!className) {
		return;
	}
	file.contents = Buffer.concat([
		new Buffer('.' + className + '{\n'),
		file.contents,
		new Buffer('}')
	]);
}))
>>>>>>> настроила тесты

    return merge(lessStream, cssStream)
        .pipe(plumber())
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(concat('all.css')) // конкатинируем css
        .pipe(prefixer()) // добавим вендорные префиксы
        .pipe(cleanCSS()) // сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) // и в build
        .pipe(changed({firstPass: firstPass}))
        .pipe(livereload());
=======
        .pipe(less()) // Скомпилируем
        .pipe(prefixer()) // Добавим вендорные префиксы
        .pipe(cssmin()) // Сожмем
        .pipe(concat('all.css')) // Конкатинируем css
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) // И в build
        .pipe(reload({stream: true}));
>>>>>>> починила линт
});

gulp.task('image:build', () => {
<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
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
    gulp.src(path.src.viewModels)
        .pipe(gulp.dest(path.build.viewModels));

    gulp.src(path.src.models)
        .pipe(gulp.dest(path.build.models));

    gulp.src(path.src.controllers)
=======
	gulp.src(path.src.img) // Выберем наши картинки
        .pipe(imagemin({ // Сожмем их
	progressive: true,
	svgoPlugins: [{removeViewBox: false}],
	use: [jpegtran()],
	interlaced: true
}))
        .pipe(gulp.dest(path.build.img)) // И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', () => {
	gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('sjs:build', () => {
	gulp.src(path.src.view_models)
        .pipe(gulp.dest(path.build.view_models));
	gulp.src(path.src.models)
        .pipe(gulp.dest(path.build.models));
	gulp.src(path.src.controllers)
>>>>>>> настроила тесты
        .pipe(gulp.dest(path.build.controllers));
});

gulp.task('build', [
<<<<<<< 95980db34d85aed4141607dd4b9ed02483bd02ac
    'html:build',
    'hb:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'sjs:build'
]);

gulp.task('style:lint', () => {
    gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(lesshint())
        .pipe(lesshint.reporter())
        .pipe(lesshint.failOnError());

    gulp.src(path.src.styleRaw)
        .pipe(plumber())
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
        .pipe(plumber())
        .pipe(htmllint())
        .pipe(htmllint.format())
        .pipe(htmllint.failOnError());
});

gulp.task('hb:lint', () => {
    gulp.src(path.src.hb)
        .pipe(plumber())
        .pipe(htmllint())
        .pipe(htmllint.format())
        .pipe(htmllint.failOnError());
});

gulp.task('js:lint', () => {
    gulp.src([path.src.js,
        'gulpfile.js',
        'app.js',
        path.src.models,
        path.src.controllers,
        path.src.viewModels])
        .pipe(plumber())
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
            demon.emit('restart');
        });
    });
=======
	'html:build',
	'hb:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build',
	'sjs:build'
]);

gulp.task('watch', () => {
	watch([path.watch.html], (event, cb) => {
		gulp.start('html:build');
	});
	watch([path.watch.style], (event, cb) => {
		gulp.start('style:build');
	});
	watch([path.watch.layouts], (event, cb) => {
		gulp.start('hb:build');
	});
	watch([path.watch.js], (event, cb) => {
		gulp.start('js:build');
	});
	watch([path.watch.hb], (event, cb) => {
		gulp.start('hb:build');
	});
	watch([path.watch.controllers], (event, cb) => {
		gulp.start('sjs:build');
	});
	watch([path.watch.models], (event, cb) => {
		gulp.start('sjs:build');
	});
	watch([path.watch.view_models], (event, cb) => {
		gulp.start('sjs:build');
	});
	watch([path.watch.img], (event, cb) => {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], (event, cb) => {
		gulp.start('fonts:build');
	});
	watch(['gulpfile.js'], (event, cb) => {
		gulp.start('build');
	});
});

gulp.task('clean', cb => {
	rimraf(path.clean, cb);
});

gulp.task('nodemon', cb => {
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
		proxy: 'localhost:8080',  // порт приложения
		notify: true
	});
>>>>>>> настроила тесты
});

gulp.task('default', gulpSequence('lint', 'build', 'webserver', 'watch'));
