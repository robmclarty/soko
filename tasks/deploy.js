'use strict'

const gulp = require('gulp')
const rsync = require('gulp-rsync')
const spawn = require('child_process').spawn
const size = require('gulp-size')

const noop = () => {}

const manifestAssets = 'rev-assets-manifest.json'
const manifestScripts = 'rev-scripts-manifest.json'
const manifestStyles = 'rev-styles-manifest.json'

const DEFAULT_ASSETS_PATH = '/build'
const DEFAULT_ASSETS_DESTINATION = '/srv/opt/app'

// Copy static assets to server.
const deployAssets = argv => {
  const serverHost = argv.host || process.env.SERVER_HOST
  const assetsDest = argv.assetsDest || DEFAULT_ASSETS_DESTINATION
  const assetsPath = argv.assetsPath || DEFAULT_ASSETS_PATH

  console.log('Deploying assets...')

  return gulp.src(`${ assetsPath }/**`)
    .pipe(rsync({
      root: `${ assetsPath }`,
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
}

const DEFAULT_SOURCES = ['tests/app/**/*']
const DEFAULT_APP_DESTINATION = '/opt/app'
const DEFAULT_APP_ROOT = 'tests/app'

// Copy all Nodejs app files to server.
const deployApp = argv => {
  const serverHost = argv.host || process.env.SERVER_HOST
  const sources = argv.appPath || argv.sources || process.env.SOURCE_LIST || DEFAULT_SOURCES
  const appDest = argv.appDest || DEFAULT_APP_DESTINATION
  const appRoot = argv.appRoot || DEFAULT_APP_ROOT

  console.log('Deploying app...')

  return gulp.src(sources)
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

const DEFAULT_REMOTE_COMMANDS = [
  `cd /opt/app`,
  'npm install --production --loglevel info'
]

// Install npm dependencies and restart pm2 process on remote server over SSH.
//
// References:
// ssh remote commands in quotes using spawn - http://stackoverflow.com/questions/27670686/ssh-with-nodejs-child-process-command-not-found-on-server
// npm flags - https://docs.npmjs.com/misc/config
// child_process docs - https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
// stdio options - https://nodejs.org/api/child_process.html#child_process_options_stdio
const deployRemote = argv => {
  const serverHost = argv.host || process.env.SERVER_HOST
  const remoteCommandList = argv.commands || process.env.REMOTE_COMMANDS || DEFAULT_REMOTE_COMMANDS
  const concatCommands = (acc, cmd) => acc ? `${ acc } && ${ cmd }` : cmd
  const remoteCommands = Array.isArray(remoteCommandList) ?
    remoteCommandList.reduce(concatCommands, '') :
    remoteCommandList

  console.log('Deploying remote...')

  const proc = spawn('ssh', [serverHost, remoteCommands], { stdio: 'inherit' })

  proc.on('exit', code => {
    if (code !== 0) return console.log(`Restart process exited with code ${ code }`)

    console.log('Finished.')
  })
}

// Do everything at once.
const deploy = argv => {
  return gulp.series(
    () => deployAssets(argv),
    () => deployApp(argv),
    () => deployRemote(argv)
  )()
}

module.exports = {
  deploy,
  deployAssets,
  deployApp,
  deployRemote
}
