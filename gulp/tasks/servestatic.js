var gulp = require('gulp');
var webserver = require('gulp-webserver');
var config = require('../config');

module.exports = function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: {
        enable: false, // need this set to true to enable livereload
        filter: function(fileName) {
          if (fileName.match(/(gif|jpg|jpeg|tiff|png)/)) { // exclude all source maps from livereload
            return false;
          } else {
            return true;
          }
        }
      },
      directoryListing: false,
      open: true,
      port: config.STATIC_PORT,
      host: config.STATIC_HOST
    }));
};
