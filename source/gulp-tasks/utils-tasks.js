//tareas
var     gulp        = require('gulp')
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path');

//compilar el servidor/cliente
gulp.task('compile', function () {
    var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
    var tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.././build'));
});