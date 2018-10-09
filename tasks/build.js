'use strict'

const DEFAULT_BROWSERS = ['last 2 versions']

const gulp = require('gulp')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const size = require('gulp-size')

const DEFAULT_ASSETS_INPUT_PATH = 'assets'

const buildAssets = argv => {
  const inputPath = argv.assetsIn || argv._[1] || DEFAULT_ASSETS_INPUT_PATH

  console.log('Building assets...')

  return gulp.src(`${ inputPath }/**/*`)
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('./build'))
}

const DEFAULT_CSS_INPUT_PATH = './css/index.scss'
const DEFAULT_CSS_OUTPUT_PATH = `./build/stylesheets/application.css`

const minifycss = require('gulp-cssnano')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

const buildCSS = argv => {
  const isProduction = argv.production || false
  const browsers = argv.browsers || DEFAULT_BROWSERS
  const inputPath = argv._[1] || argv.cssIn || DEFAULT_CSS_INPUT_PATH
  const outputPath = argv._[2] || argv.cssOut || DEFAULT_CSS_OUTPUT_PATH
  const outputFolder = outputPath.split('/').slice(0, -1).join('/')
  const outputName = outputPath.split(outputFolder + '/')[1].split('.css')[0]

  console.log('Building CSS...')

  gulp.src([inputPath])
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(concat(`${ outputName }.scss`))
      .pipe(sass({ style: 'expanded' }))
      .pipe(autoprefixer({ browsers }))
      .pipe(gulpif(isProduction, minifycss()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(outputFolder))
}

// const DEFAULT_JS_INPUT_NAME = 'index.js'
// const DEFAULT_JS_INPUT_PATH = './scripts'
// const DEFAULT_JS_OUTPUT_NAME = 'application'
// const DEFAULT_JS_OUTPUT_PATH = `./build/javascripts`

const DEFAULT_JS_INPUT_PATH = './js/index.js'
const DEFAULT_JS_OUTPUT_PATH = './build/javascripts/application.js'

const uglify = require('gulp-uglify')
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
  const browsers = argv.browsers || DEFAULT_BROWSERS
  const electron = argv.electron || null
  const node = argv.node || null
  const targets = node ? { node } : { browsers }
  const inputPath = argv._[1] || argv.jsIn || DEFAULT_JS_INPUT_PATH
  const outputPath = argv.jsOut || DEFAULT_JS_OUTPUT_PATH
  const outputFolder = outputPath.split('/').slice(0, -1).join('/')
  const outputName = outputPath.split(outputFolder + '/')[1]

  const presetEnv = electron ?
    {
      useBuiltIns: 'usage',
      targets: { electron: '2.0.7' }
    } :
    {
      useBuiltIns: false,
      targets
    }

  // const outputFilename = outputPath.substr(outputPath.lastIndexOf('.') + 1) === 'js' ?
  //   outputPath :
  //   `${ outputPath }/${ outputName }.js`
  // const outputFolders = outputFilename.split('/').slice(0, -1).join('/')

  const browserifyOptions = {
    entries: [inputPath],
    debug: true,
    fullPaths: false
  }
  const babelifyOptions = {
    presets: [
      ['@babel/preset-env', presetEnv],
      '@babel/preset-react'
    ],
    plugins: [
      ['@babel/plugin-transform-runtime', {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false
      }],
      '@babel/plugin-syntax-async-generators',
      '@babel/plugin-syntax-object-rest-spread'
    ]
  }
  const stream = browserify(browserifyOptions)
    .transform(envify())
    .transform(babelify.configure(babelifyOptions))


  console.log('Building JS...')

  return stream.bundle()
    .pipe(source(outputName))
    .pipe(buffer())
    .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(outputFolder))
}

const build = argv => {
  return gulp.parallel(
    () => buildAssets(argv),
    () => buildCSS(argv),
    () => buildJS(argv)
  )()
}

module.exports = {
  build,
  buildAssets,
  buildCSS,
  buildJS
}
