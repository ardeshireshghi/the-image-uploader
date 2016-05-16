var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

module.exports = function() {
  return browserify('./src/javascript/app.js')
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('image-uploader.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist'));
};
