//tareas para el servidor
var     gulp        = require('gulp'),
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path'),
        nodemon     = require('gulp-nodemon');

gulp.task('server-tasks', [
    'nodemon'
]);

//inicia nodemon (reinicia en caso de modificacion de archivos)
gulp.task('nodemon', function(cb){
    var started = false;
    return nodemon({
        script: path.resolve('../build/server/index.js')
    }).on('start', function(){
        if(!started) cb(); started=true;
    });
});