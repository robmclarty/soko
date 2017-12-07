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

const tasks = {
  'server': server,
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

// Takes `argv` from yargs and returns the args formatted as a string for the cli.
// ref: https://github.com/yargs/yargs
const argvToString = a => {
  return Object.keys(a).reduce((acc, key) => {
    if (key === '_') return acc

    if (a[key] === true) return acc + ` --${ key }`

    if (a[key] === false) return acc + ` --no-${ key }`

    return acc + ` --${ key } ${ a[key] }`
  }, '')
}

const action = argv._[0]

console.log('argv: ', argv)
console.log('action: ', action)
//console.log('tasks: ', tasks)

tasks[action](argv)
