var initExpress = function () {
    console.log();
    console.log("|-| Initializing express...");
    console.log(" | ");
    console.time("|-| Express init");
    stack.helpers.log("Importing dependencies", 1).iLog();

    var express = getDependency('express'),
        session = getDependency('express-session'),
        path = getDependency('path'),
        favicon = getDependency('serve-favicon'),
        logger = getDependency('morgan'),
        cookieParser = getDependency('cookie-parser'),
        bodyParser = getDependency('body-parser'),
        mongoose = getDependency('mongoose');

    stack.helpers.cLog("Dependencies imported");

    //Import of configuration files
    var config = {};
    config.main = getDependency('../config/main.json');
    config.mongo = getDependency('../config/mongo.json');

    stack.helpers.log("Initializing mongoDB").iLog();
    stack.helpers.log("Connection to mongoDB initialized");
    stack.helpers.log(config.mongo.url);
    // Connect to mongoDB
    mongoose.connect(config.mongo.url, {user: config.mongo.user, pass: config.mongo.password}, function (err) {
        if (err)
            stack.helpers.aLog("Failed to connect MongoDB: " + err);
        else
            stack.helpers.aLog("Connected to MongoDB");
    });

    stack.helpers.log("Injecting ES6 Promises into Mongoose");
    mongoose.Promise = Promise;
    stack.helpers.cLog("MongoDB initialized");


    stack.helpers.log("Setting up Express app").iLog();

    stack.helpers.log("Extracting app from global");
    //create app
    var app = stack.globals.expressApp;

    stack.helpers.log("Setting up view Engine");
    // view engine setup
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'pug');


    stack.helpers.log("Setting up default Middleware");
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    if (app.get('env') === 'development') {
        logger.format('stack', '\033[96m | ASYNC|->\033[0m :remote-addr - :remote-user [:date[clf]] \033[95m":method :url HTTP/:http-version" :status :res[content-length]\033[0m');
        app.use(logger("stack"));
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());


    stack.helpers.log("Setting up Public Folders");
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));


    stack.helpers.log("Setting up Express session");
    app.use(session({
        secret: 'a4f8071f-c873-4447-8ee2',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: stack.globals.environment.https}
    }));

    //stack and stack dependencies
    stack.helpers.log("Setting up Stacks Core Hooks").iLog();
    stack.helpers.log("Loading custom middleware", 3).iLog();

    stack.globals.middleware = stack_middleware;
    for (let middleware of stack_middleware) {
        app.use(middleware);
        stack.helpers.log("Added [" + middleware.name + "] to app.");
    }
    stack.helpers.cLog("Middleware loaded");
    stack.globals.mongoose = mongoose;
    stack.helpers.log("Loading authentication", 3);
    authentication();
    stack.helpers.log("Loading Stack DAPIs", 3);
    stack_dapis();
    stack.helpers.log("Loading Stack MAPIs", 3);
    stack.helpers.iLog();
    stack_mapis();
    stack.helpers.lastLogLevel = 4;
    stack.helpers.cLog("Stack MAPIs Loaded");

    stack.helpers.log("Loading Stack Controllers", 3).iLog();
    stack.globals.controllers = stack_controllers;
    for (var routerBase in stack_controllers) {
        var ccontroller = stack_controllers[routerBase];
        stack.helpers.log("Loading onto " + routerBase + " router [" + ccontroller.name + "]");
        app.use(routerBase, ccontroller());
    }
    stack.helpers.cLog("Stack Controllers loaded");

    if (app.get('env') === 'development') {
        stack.helpers.log("Executing Stack Tests").iLog();
        stack_tests();
        stack.helpers.log("Stack Tests executed", -3);
    }

    stack.helpers.lastLogLevel = 3;

    stack.helpers.log("Loading Stack 404 and error handlers");
    // catch 404 and forward to error handler
    app.use(stack_404);
    app.use(stack_catch);

    stack.helpers.cLog("Stacks Core Hooks called");
    stack.helpers.cLog("Express app configured");

    console.timeEnd("|-| Express init");
    console.log();
    return app;
};