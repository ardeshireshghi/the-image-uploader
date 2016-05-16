var gulp = require('gulp');

// configure which files to watch and what tasks to use on file changes
module.exports = function() {
  gulp.watch('./src/javascript/**/*.js', ['jshint', 'browserify']);
  gulp.watch('./src/stylesheets/**/*.scss', ['sass']);
};
