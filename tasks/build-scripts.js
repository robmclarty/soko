'use strict'

const DEFAULT_INPUT_NAME = 'index.js'
const DEFAULT_INPUT_PATH = './scripts'
const DEFAULT_OUTPUT_NAME = 'application.js'
const DEFAULT_OUTPUT_PATH = `./build/javascripts/${ DEFAULT_OUTPUT_NAME }`
const DEFAULT_BROWSERS = ['last 2 versions']

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const gulpif = require('gulp-if')
const size = require('gulp-size')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const babelify = require('babelify')
const envify = require('envify/custom')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

// Concatenate all app JS files, parse JSX and ES6 using Babel, write
// sourcemaps, use browserify for CommonJS and output to
// 'public/js/application.js' as ES5.
const buildJS = argv => {
  const isProduction = argv.production || false
  const inputPath = argv._[1] || DEFAULT_INPUT_PATH
  const outputPath = argv.output || DEFAULT_OUTPUT_PATH
  const browsers = argv.browsers || DEFAULT_BROWSERS
  const node = argv.node || null
  const targets = node ? { node } : { browsers }
  const outputFilename = outputPath.substr(outputPath.lastIndexOf('.') + 1) === 'js' ?
    outputPath :
    `${ outputPath }/${ DEFAULT_OUTPUT_NAME }`
  const outputFolders = outputFilename.split('/').slice(0, -1).join('/')

  const browserifyOptions = {
    entries: [inputPath],
    debug: true,
    fullPaths: false
  }
  const babelifyOptions = {
    presets: [['env', { targets }], 'react'],
    plugins: ['babel-plugin-transform-object-rest-spread']
  }
  const stream = browserify(browserifyOptions)
    .transform(envify())
    .transform(babelify.configure(babelifyOptions))

  return stream.bundle()
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(outputFolders))
}

module.exports = buildJS
