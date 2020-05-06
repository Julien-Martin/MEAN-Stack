var gulp = require('gulp'),
    gutil = require('gulp-util'),
    config = require('./config/buildSystem.json'),
    _ = require('./assets/gulp/main');

/* run the watch task when gulp is called without arguments */
gulp.task('default', ['help']);
gulp.task('help', _.help);


gulp.task('arch-res', _.arch.responsive);
gulp.task('arch-res-pages', _.arch.responsivepages);
gulp.task('arch-server', _.arch.server);

gulp.task('build-js', _.javascript.build);
gulp.task('build-server', _.server.build);
gulp.task('build-css', _.css.build);
gulp.task('build-ts', _.typescript.build);
gulp.task('build-views', _.views.build);
gulp.task('build-static', _.static.build);
gulp.task('build-angular2-jade', _.angularModules.jade.build);
gulp.task('build-angular2-scss', _.angularModules.scss.build);
gulp.task('build-angular2-typescript', _.angularModules.typescript.build);

gulp.task('build-angular2', ['build-angular2-jade', 'build-angular2-scss', 'build-angular2-typescript']);
gulp.task('build-front', ['arch-server', 'build-js', 'build-static', 'build-css', 'build-views', 'build-ts']);
gulp.task('build-all', ['build-front', 'build-server', 'build-angular2']);

gulp.task('clean-js', _.javascript.clean);
gulp.task('clean-server', _.server.clean);
gulp.task('clean-css', _.css.clean);
gulp.task('clean-ts', _.typescript.clean);
gulp.task('clean-views', _.views.clean);
gulp.task('clean-static', _.static.clean);
gulp.task('clean-project', _.project.clean);
gulp.task('clean-angular2-jade', _.angularModules.jade.clean);
gulp.task('clean-angular2-scss', _.angularModules.scss.clean);
gulp.task('clean-angular2-typescript', _.angularModules.typescript.clean);

gulp.task('clean-angular2', ['clean-angular2-jade', 'clean-angular2-scss', 'clean-angular2-typescript']);
gulp.task('clean-front', ['clean-static', 'clean-views']);
gulp.task('clean-all', ['clean-front', 'clean-server', 'clean-angular2']);

/* Watch these files for changes and run the task on update */
gulp.task('watch-css', ()=> { gulp.watch(_.watchInput.stylesheets, ['build-css']); });
gulp.task('watch-responsive', ()=> { gulp.watch(_.watchInput.responsive, ['arch-res-pages']); });
gulp.task('watch-server', ()=> { gulp.watch(_.watchInput.server, ['build-server']); });
gulp.task('watch-js', ()=> { gulp.watch(_.watchInput.javascript, ['build-js']); });
gulp.task('watch-ts', ()=> { gulp.watch(_.watchInput.typescript, ['build-ts']); });
gulp.task('watch-views', ()=> { gulp.watch(_.watchInput.views, ['build-views']); });
gulp.task('watch-static', ()=> { gulp.watch(_.watchInput.static, ['build-static']); });
gulp.task('watch-angular2-jade', ()=> { gulp.watch(_.watchInput.angularModules.jade, ['build-angular2-jade']); });
gulp.task('watch-angular2-scss', ()=> { gulp.watch(_.watchInput.angularModules.scss, ['build-angular2-scss']); });
gulp.task('watch-angular2-typescript', ()=> { gulp.watch(_.watchInput.angularModules.typescript, ['build-angular2-typescript']); });

gulp.task('watch-angular2', ['watch-angular2-jade', 'watch-angular2-scss', 'watch-angular2-typescript']);
gulp.task('watch-front', ['watch-static', 'watch-views', 'watch-js', 'watch-ts', 'watch-css']);

//watch all variants
var watchAllTasks;
if (config.advanced_responsive) {
    watchAllTasks = ['watch-responsive', 'watch-front', 'watch-server', 'watch-angular2']
} else {
    watchAllTasks = ['watch-front', 'watch-server', 'watch-angular2'];
}

gulp.task('watch-all', watchAllTasks);

gulp.task('nodemon', ['watch-all'], _.nodemon);
gulp.task('serve', ['nodemon'], _.browser_sync);

var prepareTasks = ['arch-server', 'build-all'];
if (config.advanced_responsive) {
    prepareTasks.push('arch-res')
}
gulp.task('prepare', prepareTasks);

