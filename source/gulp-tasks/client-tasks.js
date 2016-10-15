//tareas para el cliente
var     gulp        = require('gulp')
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        gncd        = require('gulp-npm-copy-deps');
        path        = require('path'),
        copy_dep    = require('./rec_lib.js'),
        fs          = require('fs');;


gulp.task('client-tasks', [
    'copy:assets',
    'copy:client_dep'
]);

//copia los archivos para el cliente
gulp.task('copy:assets', function() {
    return gulp.src([
        'client/*',
        '!client/app/*.ts',
        '!client/client_dependencies.json',
        '!server/server_dependencies.json'],
        { base : './' })
        .pipe(gulp.dest('../build'))
});
//copia las dependencias del cliente
gulp.task('copy:client_dep', ['copy:assets'], function() {
    var rootDir = path.resolve('../');
    var node_modules = rootDir+'/source/node_modules';
    var json_source = rootDir+'/source/client/client_dependencies.json';
    var json_build = rootDir+'/build/client/client_dependencies.json';

    fs.open(json_build, 'r', function(err, fd){
        if(err){
            if(err.code === "ENOENT"){
                gulp.src(['client/client_dependencies.json'], {base:'./'}).pipe(gulp.dest('../build'));
                return copy_dep('./', '../build/client', node_modules, json_source);
            }else{
                throw err;
            }
        }else{
             var bufferBuildJson = fs.readFileSync(json_build);
             var bufferSourceJson = fs.readFileSync(json_source);
             //comprueba si las depdencias han cambiado, en tal caso las copia nuevamente
             if(bufferBuildJson.toString() !== bufferSourceJson.toString()){
                 return copy_dep('./', '../build/client', node_modules, json_source);
             }
        }
    });
});