var     gulp        = require('gulp'),
        requireDir  = require('require-dir')('./gulp-tasks');

gulp.task('default', ['build']);

gulp.task('build', [
    'client-tasks',
    'server-tasks',
    'compile',
    'watch'
]);

