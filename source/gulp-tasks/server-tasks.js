//tareas para el servidor
var     gulp        = require('gulp'),
        sourcemaps  = require('gulp-sourcemaps'),
        ts          = require('gulp-typescript'),
        path        = require('path'),
        nodemon     = require('gulp-nodemon');

gulp.task('server-tasks', [
    'watch',
    'copy:server_dep'
]);


//inicia nodemon (reinicia en caso de modificacion de archivos)
// var watching = false;
// gulp.task('nodemon', function(cb){
//     var started = false;
//     var script_path = path.resolve('../build/server')+'/index.js';

//         nodemon({script: script_path})
//         .on('start', function () {
//             console.info('Demon started');

//             if (!watching) {
//                 gulp.watch('../build/server/**', ['compile']);
//                 //gulp.watch(assets.watch.scss, ['css']);
//                 watching = true;
//             }
//         })
//         .on('restart', function () {
//             console.clear();
//         });
// });
gulp.task('nodemon', function () {
    var script_path = path.resolve('../build/server')+'/index.js';
    nodemon({
        script: script_path
        , ext: 'js html'
        , env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('watch', ['compile'], function () {
  var stream = nodemon({
                 script: '../build/server/index.js' // run ES5 code
               , watch: '../source/server' // watch ES2015 code
               , tasks: ['compile'] // compile synchronously onChange
               })

  return stream
})
// gulp.task('develop', function(){
//   gulp.start('scripts');
//   nodemon({ 
//     script: './server.js',
//     env: { 'NODE_ENV': 'development' },
//     ignore: ['public/dist/']
//   })
//   //have nodemon run watch on start
//   .on('start', ['watch-public']);
// });

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