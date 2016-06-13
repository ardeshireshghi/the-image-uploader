var gulp = require('./gulp')([
    'browserify',
    'sass',
    'watch',
    'jshint',
    'servestatic',
    'startapp'
]);

gulp.task('build', ['browserify', 'sass']);
gulp.task('default', ['build', 'watch','startapp', 'servestatic']);
