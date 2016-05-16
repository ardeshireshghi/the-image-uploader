var gulp = require('./gulp')([
    'browserify',
    'sass',
    'watch'
    // 'serve'
]);

gulp.task('build', ['browserify', 'sass']);
gulp.task('default', ['build', 'watch']);
