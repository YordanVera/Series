//tareas
var     gulp        = require('gulp')
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path');

//crear proyecto
var tsProject = ts.createProject(path.resolve('./tsconfig.json'));

//compilar el cliente/servidor
gulp.task('compile', function () {
    var tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.././build'));
});

//vigilar archivos del servidor
gulp.task('watch', ['compile'], function(){
        console.log('viendo: '+path.resolve('../server'));
        gulp.watch('../server/*.ts', ['compile']);
});