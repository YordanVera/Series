//tareas para el servidor
var     gulp        = require('gulp'),
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path'),
        nodemon     = require('gulp-nodemon');

gulp.task('server-tasks', [
    'nodemon',
    'copy:server_dep'
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

gulp.task('copy:server_dep', function() {
    var rootDir = path.resolve('../');
    var node_modules = rootDir+'/source/node_modules';
    var json_source = rootDir+'/source/server/server_dependencies.json';
    var json_build = rootDir+'/build/server/server_dependencies.json';

    fs.open(json_build, 'r', function(err, fd){
        if(err){
            if(err.code === "ENOENT"){
                gulp.src(['server/server_dependencies.json'], {base:'./'}).pipe(gulp.dest('../build'));
                return copy_dep('./', '../build/server', node_modules, json_source);
            }else{
                throw err;
            }
        }else{
             var bufferBuildJson = fs.readFileSync(json_build);
             var bufferSourceJson = fs.readFileSync(json_source);
             //comprueba si las depdencias han cambiado, en tal caso las copia nuevamente
             if(bufferBuildJson.toString() !== bufferSourceJson.toString()){
                 return copy_dep('./', '../build/server', node_modules, json_source);
             }
        }
    });
});