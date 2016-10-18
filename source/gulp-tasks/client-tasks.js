//tareas para el cliente
var     gulp        = require('gulp')
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path'),
        copy_dep    = require('./rec_lib.js'),
        fs          = require('fs');
        
gulp.task('client-tasks', [
    'compile:client',
    'watch:client'
]);
gulp.task('watch:client', function(){
        gulp.watch('../source/client/**/*.ts', ['compile:client']);
});
//copia los archivos para el cliente
gulp.task('copy:assets', function() {
    return gulp.src([
        'client/*',
        '!client/app/*.ts',
        '!client/client_dependencies.json',
        '!client/tsconfig.json'],
        { base : './' })
        .pipe(gulp.dest('../build'))
});
//copia las dependencias del cliente
gulp.task('copy:client_dep', ['copy:assets'], function() {
    var rootDir = path.resolve('../');
    var node_modules = rootDir+'/source/node_modules';
    var json_source = rootDir+'/source/client/client_dependencies.json';
    var json_build = rootDir+'/build/client/client_dependencies.json';
    //verifica si se encuentra el archivo de dependencias
    fs.open(json_build, 'r', function(err, fd){
        if(err){
            //no existe: se copia y se cargan las dependencias
            if(err.code === "ENOENT"){
                gulp.src(['client/client_dependencies.json'], {base:'./'}).pipe(gulp.dest('../build'));
                return copy_dep('./', '../build/client', node_modules, json_source);
            }else{
                throw err;
            }
        }else{
            //si existe: se verifica si han cambiado
             var bufferBuildJson = fs.readFileSync(json_build);
             var bufferSourceJson = fs.readFileSync(json_source);
             //comprueba si las depdencias han cambiado, en tal caso las copia nuevamente
             if(bufferBuildJson.toString() !== bufferSourceJson.toString()){
                 return copy_dep('./', '../build/client', node_modules, json_source);
             }
        }
    });
});

gulp.task('compile:client',['copy:client_dep'], function () {
    console.log('**** compilando cliente ****');
    var tsProject = ts.createProject(path.resolve('./client/tsconfig.json'));
    var tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(tsProject());

    return tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('.././build/client'));
});