var gulp = require('gulp');
var webserver = require('gulp-webserver');
var config = require('../config');

module.exports = function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true,
      port: config.PORT,
      host: config.HOST
    }));
};
