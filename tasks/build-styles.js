'use strict'

const gulp = require('gulp')
const minifycss = require('gulp-cssnano')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')

const DEFAULT_STYLESHEET_NAME = 'application'

// Compile all SASS into CSS along with auto-prefixing and rev-replace static
// assets. Minify and output to the build folder.
gulp.task('build:styles', function () {
  const name = argv.name || DEFAULT_STYLESHEET_NAME
  const isProduction = process.env.NODE_ENV === 'production'
  const stylesRoot = process.env.STYLES_ROOT || './styles/admin/index.scss'

  return gulp.src([stylesRoot])
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(concat(`${ name }.scss`))
      .pipe(sass({ style: 'expanded' }))
      .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
      .pipe(gulpif(isProduction, minifycss()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest('./build/stylesheets'))
})
