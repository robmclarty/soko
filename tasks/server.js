'use strict'

//const gulp = require('gulp')
//const argv = require('yargs').argv
const spawn = require('child_process').spawn

const DEFAULT_PATH = './index.js'

let node

// Launch the server. If there's a server already running, kill it.
// Inspired by https://gist.github.com/webdesserts/5632955
// gulp.task('server', function (done) {
//   console.log('args: ', argv)
//   const path = argv.path || DEFAULT_PATH
//
//   if (node) node.kill()
//
//   process.env.NODE_ENV = 'development'
//   node = spawn('node', [path], { stdio: 'inherit' })
//
//   node.on('close', code => {
//     if (code === 8) glup.log('Error detected, waiting for changes...')
//   })
//
//   done()
// })

const server = argv => {
  const path = argv._[1] || DEFAULT_PATH

  console.log('args: ', argv)
  //const path = argv.path || DEFAULT_PATH // TODO: change this to simply be the first argument

  if (node) node.kill()

  process.env.NODE_ENV = 'development'
  node = spawn('node', [path], { stdio: 'inherit' })

  node.on('close', code => {
    if (code === 8) console.log('Error detected, waiting for changes...')
  })
}

// Clean up if an error goes unhandled.
process.on('exit', function () {
  if (node) node.kill()
})

module.exports = server
