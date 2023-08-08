// Определяем константы Gulp
const { src, dest, parallel, watch } = require('gulp');
 
// Подключаем Browsersync
const browserSync = require('browser-sync').create();
 
// Подключаем gulp-concat
const concat = require('gulp-concat');
 
// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-sass
const sass = require('gulp-sass')(require('sass'));
 
// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
 
// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем compress-images для работы с изображениями
const imagecomp = require('compress-images');
 
// Подключаем модуль gulp-clean (вместо del)
const clean = require('gulp-clean');
  
// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: './' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}

function scripts() {
	return src([ // Берем файлы из источников
		'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
		'dev/js/**/*.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
		])
	.pipe(uglify()) // Сжимаем JavaScript
	.pipe(dest('build/js/')) // Выгружаем готовый файл в папку назначения
	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
	return src('dev/scss/**/*.scss') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
	.pipe(sass()) // Преобразуем значение переменной "preprocessor" в функцию
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
	.pipe(dest('build/css/')) // Выгрузим результат в папку "app/css/"
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

async function images() {
	imagecomp(
		"dev/images/**/*", // Берём все изображения из папки источника
		"build/images/", // Выгружаем оптимизированные изображения в папку назначения
		{ compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) { // Обновляем страницу по завершению
			if (completed === true) {
				browserSync.reload()
			}
		}
	)
}

function startwatch() {
 
	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(['dev/js/**/*.js', '!app/**/*.min.js'], scripts);
  
  // Мониторим файлы препроцессора на изменения
  watch('dev/scss/**/*.scss', styles);
  
  // Мониторим файлы HTML на изменения
	watch('./**/*.html').on('change', browserSync.reload);

	// Мониторим файлы препроцессора на изменения
  watch('dev/images/**/*', images);
 
}

function cleanbuild() {
	return src('build', {allowEmpty: true}).pipe(clean()) // Удаляем папку "build/"
}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;
	 
// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспорт функции images() в таск images
exports.images = images;

exports.cleanbuild = cleanbuild;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, images, startwatch);
// exports.default = parallel(styles, scripts, browsersync, startwatch);
