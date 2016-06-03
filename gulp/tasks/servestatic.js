var gulp = require('gulp');
var webserver = require('gulp-webserver');
var config = require('../config');

module.exports = function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true,
      port: config.STATIC_PORT,
      host: config.STATIC_HOST
    }));
};
