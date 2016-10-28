//tareas para el servidor
var     gulp        = require('gulp'),
        nodemon     = require('gulp-nodemon'),
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path'),
        copy_dep    = require('./rec_lib.js'),
        fs          = require('fs');

gulp.task('server-tasks', [
    'watch:server',
    'nodemon:start'
]);

gulp.task('watch:server', function(){
        gulp.watch('../source/server/**/*.ts', ['compile:server']);
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

gulp.task('compile:server', ['copy:server_dep'], function () {
    console.log('**** compilando servidor ****');
    var tsProject = ts.createProject(path.resolve('./server/tsconfig.json'));
    var tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(tsProject());

    return tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('.././build/server'));
});

gulp.task('nodemon:start', ['compile:server'], function (cb) {
        var rootDir = path.normalize(path.resolve('../'));
        var started = false;
        nodemon({
                script: rootDir+'/build/server/index.js',
                ext: 'js',
                watch: rootDir+'/build/server/'
        })
        .on('start', function () {
		    if (!started) {
			    cb();
			    started = true; 
		    } 
	    });
});