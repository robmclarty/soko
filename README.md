# Soko

A toolbox of cli tools for building and running javascript apps.

[Dan Abromov](https://github.com/gaearon) talked about his idea for "tool boxes"
in his talk [The Melting Pot of Javascript](https://www.youtube.com/watch?v=G39lKaONAlA)
which could bundle developers' tools together in an updatable package using the
most sensible defaults that would enable new users to hit the ground running
without getting tangled in a web of configuration. These are my tools.

These are certainly not exhaustive for every situation, but these are a set of
core tools I find myself reusing in each of my projects. This way, when I want
to update my version of babel, or use some new fangled compression algorithm, or
add new deployment methods, I can do that in one place and all my projects will
be updated.

## Install

`npm install soko`

## Usage

`npx soko <command>`

Soko can be installed in your project's local `node_modules` folder and run
using npm's new `npx` command (which will search in your `$PATH`, but also in
your local `node_modules/.bin` for any matching command).

### Launch a NodeJS Server

`npx soko server /path/to/nodejs/app.js`

If there's a server already running, kill it.

### Start Development Environment

`npx soko watch /path/to/nodejs/app.js`

Watch source files for changes and restart server when they do.

### Build React and/or ES2015+ Javascripts

`npx soko build:scripts /path/to/app.js`

Use Babel with the `env` preset to target specific environments for output along
with Browserify to enable multi-file modules, then pass the results through
uglify to make it super small.

### Build SASS Styles

`npx soko build:styles /path/to/styles.scss`

Compile SASS and minify CSS.

### Revisioning Static Assets

`npx soko rev /path/to/build`

Copy all static assets to build folder and rename them using a hash of their
contents such that the hash (and filename) will change if the contents change
thereby breaking any cacheing mechanisms automatically.

Using a manifest of all renamed files, update all references to those files
in any JS, CSS, or HTML files that need to load them.

### Deploy Build to Remote

`npx soko deploy --host 100.200.111.222`

Use rsync to sync files in your build folder with a remote server and run any
necessary remote commands (e.g., `npm install` in nodejs folder to update its
dependencies and then restart the server).

## TODO

- always reduce the amount of configuration required
- add commands to build docker containers easily

## License

MIT
