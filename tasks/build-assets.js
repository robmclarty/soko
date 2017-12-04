'use strict'

const gulp = require('gulp')
const merge = require('merge-stream')

gulp.task('build:assets', function () {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('./build'))
})

gulp.task('build:html', function () {
  const homepage = gulp.src('./assets/index.html')
    .pipe(gulp.dest('./build'))
  const app = gulp.src('./app/index.html')
    .pipe(gulp.dest('./app/client'))

  return merge(homepage, app)
})