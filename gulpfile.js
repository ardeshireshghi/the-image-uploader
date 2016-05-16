var gulp = require('./gulp')([
    'browserify',
    'sass',
    'watch',
    'jshint',
    'serve'
]);

gulp.task('build', ['browserify', 'sass']);
gulp.task('default', ['build', 'watch','serve']);
