#! /usr/bin/env node

const shell = require('shelljs')
const argv = require('yargs').argv
const { yargsToString } = require('../helpers/args_helper')

const action = argv._[0]
const cmd = `gulp ${ action } ${ yargsToString(argv) }`

shell.exec(cmd)
