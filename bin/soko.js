#!/usr/bin/env node

const gulp = require('gulp')
const argv = require('minimist')(process.argv.slice(2))
const {
  deploy,
  deployAssets,
  deployApp,
  deployRemote
} = require('../tasks/deploy')
const {
  rev,
  revAssets,
  revJS,
  revCSS,
  revHTML
} = require('../tasks/rev')
const server = require('../tasks/server')
const clean = require('../tasks/clean')
const {
  build,
  buildAssets,
  buildCSS,
  buildJS
} = require('../tasks/build')

const DEFAULT_CSS_PATH = 'styles'
const DEFAULT_JS_PATH = 'scripts'
const DEFAULT_ASSETS_PATH = 'assets'

const watch = argv => {
  const cssPath = (argv.cssIn || DEFAULT_CSS_PATH).split('/').slice(0, -1).join('/')
  const jsPath = (argv.jsIn || DEFAULT_JS_PATH).split('/').slice(0, -1).join('/')
  const assetsPath = argv.assetsIn || DEFAULT_ASSETS_PATH

  console.log('Watching ', cssPath, jsPath, assetsPath)

  gulp.watch(`${ cssPath }/**/*`, () => buildCSS(argv))
  gulp.watch(`${ jsPath }/**/*`, () => buildJS(argv))
  gulp.watch(`${ assetsPath }/**/*`, () => buildAssets(argv))
}

const dev = argv => {
  return gulp.series(
    () => build(argv),
    () => server(argv),
    () => watch(argv)
  )()
}

const tasks = {
  'server': server,
  'watch': watch,
  'dev': dev,
  'build': build,
  'build:assets': buildAssets,
  'build:css': buildCSS,
  'build:js': buildJS,
  'rev': rev,
  'rev:assets': revAssets,
  'rev:js': revJS,
  'rev:css': revCSS,
  'rev:html': revHTML,
  'clean': clean,
  'deploy': deploy,
  'deploy:assets': deployAssets,
  'deploy:app': deployApp,
  'deploy:remote': deployRemote
}

const action = argv._[0]

tasks[action](argv)
