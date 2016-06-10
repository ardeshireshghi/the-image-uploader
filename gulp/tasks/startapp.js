var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var config = require('../config');

module.exports = function() {
  nodemon({
    script: 'app/server.js',
    ext: 'js html',
    ignore: [
      'uploads'
    ],
    env: {
    'NODE_ENV': 'development',
    'PORT': config.APP_PORT
    }
  });
};
