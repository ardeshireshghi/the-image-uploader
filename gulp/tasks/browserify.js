var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

module.exports = function() {
  var bundler = browserify({
      entries: './src/javascript/app.js',
      // Enable source maps!
      debug: (process.env.DEBUG)
  });

  // Clean up consoles
  if (!process.env.DEBUG) {
    bundler.transform("stripify");
  }

  bundler.bundle()
  //Pass desired output filename to vinyl-source-stream
  .pipe(source('image-uploader.js'))
  // Start piping stream to tasks!
  .pipe(gulp.dest('./dist'));
};
