#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const {
  deploy,
  deployAssets,
  deployApp,
  deployRemote
} = require('../tasks/deploy')
const {
  rev
} = require('../tasks/rev')

const tasks = {
  'server': require('../tasks/server'),
  'build:css': require('../tasks/build-styles'),
  'build:js': require('../tasks/build-scripts'),
  'rev': rev,
  'clean': require('../tasks/clean'),
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
