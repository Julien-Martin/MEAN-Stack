//Requires and declares
var gulp = require('gulp'),
    fs = require('fs'),
    gutil = require('gulp-util'),
    debug = require('gulp-debug'),
    uglifyjs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename"),
    minifyCss = require('gulp-cssnano'),
    del = require('del'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    typescript = require('gulp-typescript'),
    config = require('../../config/buildSystem.json'),
    jade = require('gulp-jade'),
    traceur = require('gulp-traceur');

input = {
    'server': [
        'sources/app/**/*.js',
        'sources/hooks/**/*.js',
        'sources/mvc/controllers/**/*.js',
        'sources/mvc/models/**/*.js',
        'assets/server/**/*.js'
    ],
    'static': 'sources/public/**/*',
    'stylesheets': 'sources/assets/stylesheets/**/*.main.scss',
    'views': 'sources/mvc/views/**/*',
    'javascript': 'sources/assets/javascript/**/*.js',
    'typescript': 'sources/assets/typescript/**/*.ts',
    'angularModules': {
        'typescript': 'sources/assets/angularModules/**/*.ts',
        'jade': 'sources/assets/angularModules/**/*.pug',
        'scss': 'sources/assets/angularModules/**/*.scss'
    }
},

    output = {
        'index': './',
        'static': 'server/public/',
        'javascript': 'server/public/assets/javascript/',
        'typescript': 'server/public/assets/javascript/compiled/',
        'stylesheets': 'server/public/assets/stylesheets/',
        'views': 'server/views/',
        'server': 'server/',
        'angularModules': 'server/public/assets/angularModules/'
    },

    typescriptConfig = typescript.createProject('tsconfig.json');

var env = require('../../config/env.json');
var node_env = process.env.NODE_ENV || 'development';

var _ = env[node_env];


//Create Void infrastructure
var mdir = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        //console.log(e);
    }
};

exports.arch = {};
exports.arch.responsive = function () {
    mdir("./sources/assets/stylesheets/desktop");
    mdir("./sources/assets/stylesheets/mobile");
    mdir("./sources/assets/stylesheets/tablet");
    mdir("./sources/assets/stylesheets/globals");
    mdir("./sources/assets/stylesheets/print");
    var handler = function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    };
    fs.writeFile("./sources/assets/stylesheets/desktop.main.scss", "", handler);
    fs.writeFile("./sources/assets/stylesheets/print.main.scss", "", handler);
    fs.writeFile("./sources/assets/stylesheets/mobile.main.scss", "", handler);
    fs.writeFile("./sources/assets/stylesheets/tablet.main.scss", "", handler);
    fs.writeFile("./sources/assets/stylesheets/globals.main.scss", "", handler);
};
exports.arch.server = function () {
    mdir("./server");
    mdir("./server/uploads");
    mdir("./server/suploads");
};
exports.arch.responsivepages = function () {
    delete require.cache[require.resolve('../../config/structure.json')];
    var structure = require('../../config/structure.json');
    console.log(structure);
    var handler = function (err) {
        if (err) {
            return console.log("Error: check json and gulp arch-res");
        }

        console.log("The file was saved!");
    };
    for (var file of structure) {
        var desktop;
        try {
            desktop = fs.statSync("./sources/assets/stylesheets/desktop/" + file + ".scss").isFile();
        } catch (e) {
            desktop = false;
        }
        if (!desktop) {
            fs.writeFile("./sources/assets/stylesheets/desktop/" + file + ".scss", "", handler);
        }
        var mobile;
        try {
            mobile = fs.statSync("./sources/assets/stylesheets/mobile/" + file + ".scss").isFile();
        } catch (e) {
            mobile = false;
        }
        if (!desktop) {
            fs.writeFile("./sources/assets/stylesheets/mobile/" + file + ".scss", "", handler);
        }
        var tablet;
        try {
            tablet = fs.statSync("./sources/assets/stylesheets/tablet/" + file + ".scss").isFile();
        } catch (e) {
            tablet = false;
        }
        if (!tablet) {
            fs.writeFile("./sources/assets/stylesheets/tablet/" + file + ".scss", "", handler);
        }
        var globals;
        try {
            globals = fs.statSync("./sources/assets/stylesheets/globals/" + file + ".scss").isFile();
        } catch (e) {
            globals = false;
        }
        if (!globals) {
            fs.writeFile("./sources/assets/stylesheets/globals/" + file + ".scss", "", handler);
        }
        var print;
        try {
            print = fs.statSync("./sources/assets/stylesheets/print/" + file + ".scss").isFile();
        } catch (e) {
            print = false;
        }
        if (!print) {
            fs.writeFile("./sources/assets/stylesheets/globals/" + file + ".scss", "", handler);
        }
    }
};


//Gulp server functions
exports.server = {};
exports.server.build = function () {
    return gulp.src(input.server)
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.server));
};
exports.server.clean = function () {
    return del([output.server + '*.*'])
};

//Gulp javascript functions
exports.javascript = {};
exports.javascript.build = function () {
    return gulp.src(input.javascript)
        .pipe(debug())
        .pipe(sourcemaps.init())
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.javascript));
};
exports.javascript.clean = function () {
    return del([output.javascript])
};

//Gulp typescript functions
exports.typescript = {};
exports.typescript.build = function () {
    var stream = gulp.src(input.typescript)
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(typescript(typescriptConfig))
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.typescript));
    stream.on('end', browserSync.reload);
    return stream;
};
exports.typescript.clean = function () {
    return del([output.typescript])
};

//Gulp static functions
exports.static = {};
exports.static.build = function () {
    return gulp.src(input.static)
        .pipe(debug())
        .pipe(gulp.dest(output.static));
};
exports.static.clean = function () {
    return del([output.static])
};

//Gulp css functions
exports.css = {};
exports.css.build = function () {
    var stream = gulp.src(input.stylesheets)
        .pipe(debug())
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
        .pipe(sass())
        .on('error', err => {
            console.log(err);
            console.log("Error building css");
        })
        .pipe(gutil.env.type === 'production' ? minifyCss() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write('./'))
        .pipe(gulp.dest(output.stylesheets));

    stream.on('end', browserSync.reload);
    stream.on('error', err => {
        console.log(err);
        console.log("Error building css");
    });
};
exports.css.clean = function () {
    return del([output.stylesheets]);
};

//Gulp views functions
exports.views = {};
exports.views.build = function () {
    var stream = gulp.src(input.views)
        .pipe(debug())
        .pipe(gulp.dest(output.views));
    stream.on('end', browserSync.reload);
};
exports.views.clean = function () {
    return del([output.views])
};

//Gulp project functions
exports.project = {};
exports.project.clean = function () {
    return del(['./node_modules']);
};

exports.browser_sync = function () {
    if (gutil.env.type != 'production') {
        browserSync.init(null, {
            proxy: "http://localhost:" + (_.https ? _.httpsPort.toString(): _.httpPort.toString()),
            files: ["public/**/*.*"],
            browser: _.browser || "",
            port: _.bsport
        });
    }
};

// ANGULAR2 GULP ############################################ 
exports.angularModules = {};
// ANGULAR2 TYPESCRIPT ######################################
exports.angularModules.typescript = {};
exports.angularModules.typescript.build = function () {
    return gulp.src(input.angularModules.typescript)
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(typescript(typescriptConfig))
        //only uglifyjs if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? traceur() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? uglifyjs() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output.angularModules));
};
exports.angularModules.typescript.clean = function () {
    return del([output.angularModules])
};
// ANGULAR2 SCSS ###########################################
exports.angularModules.scss = {};
exports.angularModules.scss.build = function () {
    return gulp.src(input.angularModules.scss)
        .pipe(debug())
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
        .pipe(sass())
        .pipe(gutil.env.type === 'production' ? minifyCss() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write('./'))
        .pipe(gulp.dest(output.angularModules));
};
exports.angularModules.scss.clean = function () {
    return del([output.angularModules]);
};

// ANGULAR2 JADE ###########################################
exports.angularModules.jade = {};
exports.angularModules.jade.build = function () {
    var locals = {};
    return gulp.src(input.angularModules.jade)
        .pipe(debug())
        .pipe(jade({locals: locals}))
        .pipe(gulp.dest(output.angularModules));
};
exports.angularModules.jade.clean = function () {
    return del([output.angularModules])
};


exports.nodemon = function (cb) {

    var started = false;

    return nodemon({
        script: 'index.js',
        ext: 'js',
        watch: exports.watchInput.server,
        tasks: ['build-all']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function () {

    });
};

exports.help = function () {
    fs.readFile('./assets/gulp/help.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    });
};


exports.watchInput = {
    'server': [
        'sources/app/**/*.js',
        'sources/mvc/controllers/**/*.js',
        'sources/mvc/models/**/*.js',
        'sources/hooks/**/*.js'
    ],
    'static': 'sources/public/**/*',
    'stylesheets': 'sources/assets/stylesheets/**/*.scss',
    'responsive': 'config/structure.json',
    'views': 'sources/mvc/views/**/*',
    'javascript': 'sources/assets/javascript/**/*.js',
    'typescript': 'sources/assets/typescript/**/*.ts',
    'angularModules': {
        'typescript': 'sources/assets/angularModules/**/*.ts',
        'jade': 'sources/assets/angularModules/**/*.pug',
        'scss': 'sources/assets/angularModules/**/*.scss'
    }
};