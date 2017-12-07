'use strict'

//const gulp = require('gulp')
//const argv = require('yargs').argv
const spawn = require('child_process').spawn

const DEFAULT_PATH = './index.js'

// A single instance of node wrapped in this module's closure to be reused.
let node

// Launch the server. If there's a server already running, kill it.
// Inspired by https://gist.github.com/webdesserts/5632955
const server = argv => {
  const path = argv._[1] || argv.app || DEFAULT_PATH

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
