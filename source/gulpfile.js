var del         = require('del');
var gulp        = require('gulp');
var sourcemaps  = require('gulp-sourcemaps');
var ts          = require('gulp-typescript');
var watch       = require('gulp-watch');
var path        = require('path');

//elimina lo que esta en build, excepto node_modules por su peso
gulp.task('clean', function () {
    return del.sync([
        '.././build/server',
        '.././build/client/**',
        '!.././build/client',
        '!.././build/client/node_modules/**']
    ,{
            'force': true
        });
});

//gulp.task('copy:node_modules', function () {
//    return gulp.watch('node_modules/**/*', function(obj){
//        if( obj.type === 'changed') {
//            gulp.src( obj.path, { "base": "node_modules"})
//                .pipe(gulp.dest('./build/client/node_modules'));
//        }
//    });
//});

//gulp.task('copy:node_modules', ['clean'], function() {
//    var source = './node_modules',
//        destination = './build/client/node_modules';
//
//    gulp.src(source + '/**', {base: source})
//        .pipe(watch(source, {base: source}))
//        .pipe(gulp.dest(destination));
//});

gulp.task('copy:node_modules', ['clean'], function () {
    return gulp.src([
            'node_modules/**/*'
        ])
        .pipe(gulp.dest('.././build/client/node_modules/'));
});
gulp.task('copy:node_modules2', ['clean'], function () {
    return gulp.src([
            'node_modules/**/*'
        ])
        .pipe(gulp.dest('.././build/node_modules/'));
});

gulp.task('copy:assets', ['clean'], function() {
    return gulp.src([
        'client/*',
        '!client/app/*.ts'],
        { base : './' })
        .pipe(gulp.dest('../build'))
});

gulp.task('compile', ['clean'], function () {
    var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
    var tsResult = tsProject
                            .src()
                            .pipe(sourcemaps.init())
                            .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.././build'));
});

gulp.task('build', [
    'compile',
    'copy:assets',
    'copy:node_modules',
    'copy:node_modules2'
]);

gulp.task('default', ['build']);