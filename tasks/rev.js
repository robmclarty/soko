'use strict';

const gulp = require('gulp')
const rev = require('gulp-rev')
const revReplace = require('gulp-rev-replace')
const size = require('gulp-size')

const DEFAULT_BUILD_FOLDER = './build'
const DEFAULT_MANIFEST_ASSETS_NAME = 'rev-manifest-assets.json'
const DEFAULT_MANIFEST_JS_NAME = 'rev-manifest-js.json'
const DEFAULT_MANIFEST_CSS_NAME = 'rev-manifest-css.json'

const revAssets = argv => {
  const inputPath = DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`

  return gulp.src([
    `${ inputPath }/**/*`,
    '!*.js',
    '!*.css',
    '!*.html'
  ])
    .pipe(rev())
    .pipe(gulp.dest(inputPath))
    .pipe(size())
    .pipe(rev.manifest(manifestAssetsPath))
    .pipe(gulp.dest('.'))
}

const revJS = argv => {
  const inputPath = DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`
  const manifestJSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_JS_NAME }`

  return gulp.src(`${ inputPath }/**/*.js`)
    .pipe(revReplace({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(rev())
    .pipe(gulp.dest(inputPath))
    .pipe(rev.manifest(manifestJSPath))
    .pipe(gulp.dest('.'))
}

const revCSS = argv => {
  const inputPath = DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`
  const manifestCSSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_CSS_NAME }`

  return gulp.src(`${ inputPath }/**/*.css`)
    .pipe(revReplace({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(rev())
    .pipe(gulp.dest(inputPath))
    .pipe(rev.manifest(manifestCSSPath))
    .pipe(gulp.dest('.'))
}

const revHTML = argv => {
  const inputPath = DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`
  const manifestJSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_JS_NAME }`
  const manifestCSSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_CSS_NAME }`

  return gulp.src(`${ inputPath }/**/*.html`)
    .pipe(revReplace({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(revReplace({ manifest: gulp.src(manifestCSSPath) }))
    .pipe(revReplace({ manifest: gulp.src(manifestJSPath) }))
    .pipe(gulp.dest(inputPath))
}

const revAll = argv => {
  return gulp.series(
    () => revAssets(argv),
    gulp.parallel(
      () => revJS(argv),
      () => revCSS(argv)
    ),
    () => revHTML(argv)
  )()
}

module.exports = {
  rev: revAll,
  revAssets,
  revJS,
  revCSS,
  revHTML
}
