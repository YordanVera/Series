//tareas para el cliente
var     gulp        = require('gulp')
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path');

//copia los archivos para el cliente
gulp.task('client-tasks', [
    'copy:assets',
    'copy:client_dep'
]);

gulp.task('copy:assets', function() {
    return gulp.src([
        'client/*',
        '!client/app/*.ts',
        '!client/client_dependencies.json',
        '!server/server_dependencies.json'],
        { base : './' })
        .pipe(gulp.dest('../build'))
});

gulp.task('copy:client_dep', function () {
    var dep_list = require('../client/client_dependencies.json');
    var modules = Object.keys(dep_list);
    var moduleFiles = modules.map(function(module) {
        return '../node_modules/' + module + '/**/*.*';
    });
    return gulp.src(moduleFiles, { base: 'node_modules' })
        .pipe(gulp.dest('.././build/client/node_modules/'));
});