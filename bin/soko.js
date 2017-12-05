#!/usr/bin/env node

const shell = require('shelljs')
const argv = require('minimist')(process.argv.slice(2))

const tasks = {
  server: require('../tasks/server'),
  'build:styles': require('../tasks/build-styles')
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
// const cmd = `${} ${ action } ${ argvToString(argv) }`
//
// shell.exec(cmd)

console.log('argv: ', argv)
console.log('action: ', action)
console.log('tasks: ', tasks)

tasks[action](argv)
