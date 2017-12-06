'use strict'

const DEFAULT_INPUT_PATH = './styles'
const DEFAULT_INPUT_NAME = 'index.scss'
const DEFAULT_OUTPUT_NAME = 'application.css'
const DEFAULT_OUTPUT_PATH = `./build/stylesheets/${ DEFAULT_OUTPUT_NAME }`

const gulp = require('gulp')
const minifycss = require('gulp-cssnano')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const size = require('gulp-size')

const buildCSS = argv => {
  const isProduction = argv.production || false
  //const stylesRoot = process.env.STYLES_ROOT || './styles/admin/index.scss'
  const inputPath = argv._[1] || DEFAULT_INPUT_PATH

  gulp.src([inputPath])
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(concat('application.scss'))
      .pipe(sass({ style: 'expanded' }))
      .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
      .pipe(gulpif(isProduction, minifycss()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('./build/stylesheets'))
}

module.exports = buildCSS
