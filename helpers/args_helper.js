'user strict'

// Takes `argv` from yargs and returns the args formatted as a string for the cli.
// ref: https://github.com/yargs/yargs
const yargsToString = argv => {
  return Object.keys(argv).reduce((acc, key) => {
    if (key === '$0' || key === '_') return acc

    if (argv[key] === true) return acc + ` --${ key }`

    if (argv[key] === false) return acc + ` --no-${ key }`

    return acc + ` --${ key } ${ argv[key] }`
  }, '')
}

module.exports = {
  yargsToString
}
