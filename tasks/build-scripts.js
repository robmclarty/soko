'use strict'

const DEFAULT_INPUT_NAME = 'index.js'
const DEFAULT_INPUT_PATH = './scripts'
const DEFAULT_OUTPUT_NAME = 'application.js'
const DEFAULT_OUTPUT_PATH = `./build/javascripts/${ DEFAULT_OUTPUT_NAME }`
const DEFAULT_BROWSERS = ['last 2 versions']

const fs = require('fs')
const browserify = require('browserify')
const babelify = require('babelify')
const uglifyify = require('uglifyify')
const mkdirp = require('mkdirp')

const buildScripts = argv => {
  const inputPath = argv._[1] || DEFAULT_INPUT_PATH
  const outputPath = argv.output || DEFAULT_OUTPUT_PATH
  const browsers = argv.browsers || DEFAULT_BROWSERS
  const node = argv.node || null
  const targets = node ? { node } : { browsers }
  const outputFilename = outputPath.substr(outputPath.lastIndexOf('.') + 1) === 'js' ?
    outputPath :
    `${ outputPath }/${ DEFAULT_OUTPUT_NAME }`
  const outputFolders = outputFilename.split('/').slice(0, -1).join('/')

  const browserifyOpts = {
    entries: [inputPath],
    debug: false,
    fullPaths: false
  }
  const babelifyOpts = {
    presets: [
      ['env', { targets }],
      ['react']
    ],
    plugins: ['babel-plugin-transform-object-rest-spread']
  }
  const uglifyOpts = {
    global: true,
    sourceMap: false
  }
  const stream = browserify(browserifyOpts)
    .transform(babelify.configure(babelifyOpts))
    .transform('uglifyify', uglifyOpts)

  mkdirp(outputFolders, mkdirErr => {
    if (mkdirErr) return console.log('ERROR: ', mkdirErr)

    stream.bundle()
      .on('error', err => console.log('ERROR: ', err))
      .pipe(fs.createWriteStream(DEFAULT_OUTPUT_PATH))
  })
}

module.exports = buildScripts
