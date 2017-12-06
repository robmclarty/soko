'use strict'

const DEFAULT_INTPUT_PATH = './styles'
const DEFAULT_INPUT_NAME = 'index.scss'
const DEFAULT_OUTPUT_NAME = 'application.css'
const DEFAULT_OUTPUT_PATH = `./build/stylesheets/${ DEFAULT_OUTPUT_NAME }`

const fs = require('fs')
const mkdirp = require('mkdirp')
const CleanCSS = require('clean-css')
const sass = require('node-sass')

// Specify a full path including filename to the root .scss file, or if no
// .scss file is specified, assume the path to be a folder with a file named
// `index.scss` in its root.
const getSass = path => new Promise((resolve, reject) => {
  const filename = path.substr(path.lastIndexOf('.') + 1) === 'scss' ?
    path :
    `${ path }/${ DEFAULT_INPUT_NAME }`

  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) return reject(err)

    resolve(data)
  })
})

// Save file to `path`, if specified, otherwise save to `./build/application.css`.
const saveCSS = (path, data) => new Promise((resolve, reject) => {
  const filename = path.substr(path.lastIndexOf('.') + 1) === 'css' ?
      path :
      `${ path }/${ DEFAULT_OUTPUT_NAME }`
  const folders = filename.split('/').slice(0, -1).join('/')

  mkdirp(folders, mkdirErr => {
    if (mkdirErr) return reject(mkdirErr)

    fs.writeFile(filename, data, err => {
      if (err) return reject(err)

      resolve()
    })
  })
})

// Open a .scss file and render it as CSS.
const sassToCSS = (data, includePaths) => new Promise((resolve, reject) => {
  sass.render({
    data,
    includePaths
  }, (err, results) => {
    if (err) return reject(err)

    console.log('node-sass entry: ', results.stats.entry)
    console.log('node-sass start: ', results.stats.start)
    console.log('node-sass end: ', results.stats.end)
    console.log(`node-sass duration: ${ results.stats.duration }ms`)
    console.log('node-sass included files: ', results.stats.includedFiles)

    resolve(results.css.toString())
  })
})

// Take regular CSS and return compressed and minified CSS.
const minifyCSS = source => new CleanCSS({
  level: 2,
  returnPromise: true
})
  .minify(source)
  .then(output => {
    console.log(`clean-css original size: ${ output.stats.originalSize }bytes`)
    console.log(`clean-css minified size: ${ output.stats.minifiedSize }bytes`)
    console.log(`clean-css time spent: ${ output.stats.timeSpent }ms`)
    console.log('clean-css efficiency: ', output.stats.efficiency)

    return output.styles
  })

 const buildStyles = argv => {
  const inputPath = argv._[1] || DEFAULT_INPUT_PATH
  const outputPath = argv.output || DEFAULT_OUTPUT_PATH

  getSass(inputPath)
    .then(data => sassToCSS(data, [inputPath]))
    .then(css => minifyCSS(css))
    .then(miniCSS => saveCSS(outputPath, miniCSS))
    .then(() => console.log('build css complete'))
    .catch(err => console.log('ERROR: ', err))
}

module.exports = buildStyles
