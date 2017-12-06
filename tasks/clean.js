'use strict'

const del = require('del')

// Wipe out any existing files and folders in the ./build directory so we can
// start again fresh.
const clean = () => {
  del([
    `./build/**/*`,
    `!./build/.keep`
  ])
}

module.exports = clean
