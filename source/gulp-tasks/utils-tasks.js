//tareas compartidas
var     gulp        = require('gulp'),
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path');

//compilar el cliente/servidor
gulp.task('compile', function () {
        var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
        console.log('------- '+path.resolve('./tsconfig.json'));
        var tsResult = tsProject.src()
                                .pipe(sourcemaps.init())
                                .pipe(tsProject());

        return tsResult.js
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('.././build'));
});