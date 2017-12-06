'use strict'

const gulp = require('gulp')
const rsync = require('gulp-rsync')
//const argv = require('yargs').argv
const spawn = require('child_process').spawn
const size = require('gulp-size')

//const serverConf = require('../config/server')
//const host = process.env.SERVER_HOST
// const appRoot = `/opt/app`
// const staticRoot = `/srv/opt/app`
//const pm2Conf = `/etc/opt/app/pm2.json`
//const spawnConf = { cwd: appRoot, env: process.env }

const noop = () => {}

const manifestAssets = 'rev-assets-manifest.json'
const manifestScripts = 'rev-scripts-manifest.json'
const manifestStyles = 'rev-styles-manifest.json'

const bufferToString = (data) => {
  const buff = new Buffer(data)
  return buff.toString('utf8')
}

// Copy static assets to server.
// `hostname` is actually the SSH symbol used in ~/.ssh/config
//gulp.task('deploy:assets', function () {
const DEFAULT_ASSETS_DESTINATION = '/srv/opt/app'

const deployAssets = argv => {
  const serverHost = argv.host || process.env.SERVER_HOST
  const assetsDest = argv.assetsDest || DEFAULT_ASSETS_DESTINATION

  gulp.src('build/**')
    .pipe(rsync({
      root: 'build/',
      hostname: serverHost,
      destination: assetsDest,
      progress: true,
      recursive: true,
      clean: true,
      exclude: [
        '*.map',
        '.DS_Store',
        manifestAssets,
        manifestScripts,
        manifestStyles
      ]
    }))
    .pipe(size())
    .on('data', noop)
    .on('error', err => console.log('ERROR: ', err))
}

// Copy all files in /server as well as npm package manifest.
//gulp.task('deploy:server', function () {
const DEFAULT_SOURCES = ['tests/app/**/*']
const DEFAULT_APP_DESTINATION = '/opt/app'

// [
//     './server/**',
//     './.sequelizerc',
//     './config/server.js',
//     './config/database.js',
//     './db/**',
//     'package.json'
//   ]

const deployApp = argv => {
  const serverHost = argv.host || process.env.SERVER_HOST
  const sources = argv.appPath || argv.sources || process.env.SOURCE_LIST
  const appDest = argv.appDest || DEFAULT_APP_DESTINATION
  const appRoot = argv.appRoot || DEFAULT_APP_ROOT

  gulp.src(sources)
    .pipe(rsync({
      root: appRoot,
      hostname: serverHost,
      destination: appDest,
      progress: true,
      recursive: true,
      clean: true
    }))
    .pipe(size())
    .on('data', noop)
}

// Install npm dependencies and restart pm2 process on remote server over SSH.
//
// References:
// ssh remote commands in quotes using spawn - http://stackoverflow.com/questions/27670686/ssh-with-nodejs-child-process-command-not-found-on-server
// npm flags - https://docs.npmjs.com/misc/config
// child_process docs - https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
// stdio options - https://nodejs.org/api/child_process.html#child_process_options_stdio
//gulp.task('deploy:reload', function (done) {

// const remoteCommandList = [
//   `cd ${ appRoot }`,
//   'npm install --production --loglevel info',
//   `sudo pm2 reload ${ pm2Conf }`
// ]

const DEFAULT_REMOTE_COMMANDS = [
  `cd /opt/app`,
  'npm install --production --loglevel info'
]

const deployRemote = argv => {
  const serverHost = argv.host || process.env.SERVER_HOST
  const remoteCommandList = argv.commands || process.env.REMOTE_COMMANDS || DEFAULT_REMOTE_COMMANDS

  const concatCommands = (acc, cmd) => acc ? `${ acc } && ${ cmd }` : cmd
  const remoteCommands = remoteCommandList.reduce(concatCommands, '')

  const proc = spawn('ssh', [serverHost, remoteCommands], { stdio: 'inherit' })

  proc.on('exit', code => {
    if (code !== 0) return console.log(`Restart process exited with code ${ code }`)

    console.log('Finished.')
  })
}

// Do everything at once.
const deploy = argv => gulp.series(
  // deployAssets(argv),
  // deployApp(argv),
  // deployRemote(argv)
)

module.exports = {
  deploy,
  deployAssets,
  deployApp,
  deployRemote
}
