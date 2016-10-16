//tareas
var     gulp        = require('gulp')
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path');

//crear proyecto


//compilar el cliente/servidor
gulp.task('compile', function () {
        var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
    var tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.././build'));
});

//vigilar archivos del servidor
// gulp.task('watch', ['compile'], function(){
//         //console.log('viendo: '+path.resolve('../source/server'));
//         gulp.watch('../source/server/**', ['compile']);
// });