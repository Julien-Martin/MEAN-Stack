var stack_404 = function (request, response, next) {
    var err = new Error('Not Found');
    err.status = 404;
    response.statusCode = 404;
    response.send("404");
};
var authSerializer = function (user, done) {
    done(null, user.id);
};

var authDeserializer = function (id, done) {
    var User = getDependency(dapi_model_users);
    if(id == "admin"){
        done(null, {admin : "true", id: "admin"})
    } else {
        User.findById(id, function (error, user) {
            done(error, user);
        });
    }
};

function authentication() {
    var User = getDependency(dapi_model_users);

    var passport = getDependency('passport');
    var PassportLocalStrategy = getDependency('passport-local');

    var authStrategy = new PassportLocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        User.authenticate(username, password, function(error, user){
            // You can write any kind of message you'd like.
            // The message will be displayed on the next page the user visits.
            // We're currently not displaying any success message for logging in.
            done(error, user, error ? { message: error.message } : null);
        });
    });

    passport.use(authStrategy);
    passport.serializeUser(authSerializer);
    passport.deserializeUser(authDeserializer);
    var session = getDependency('express-session');

    var app = stack.globals.expressApp;
    app.use(getDependency('connect-flash')());
    app.use(passport.initialize());
    app.use(passport.session());
}
var stack_catch = function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.send(err);
};
var stack_controllers = {
    /*"/users": router_users,
    "/files": router_files,
    "/settings": router_settings,
    "/contents": router_contents,
    "/people": router_people,
    "/page": router_page,
    "/forms": router_forms,
    "/doctors": router_client_doctors,
    "/individuals": router_client_individuals,
    "/users": router_users,
    "/agenda": router_agenda,
    "/statistics": router_statistics,
    "/access": router_access,*/
    "/": router_front
};



function stack_crash(error) {
    var debug = getDependency('debug')('test:server');
    var http = getDependency('http');
    var https = getDependency('https');
    var fs = getDependency('fs');
    var express = getDependency('express');


    console.log(error);

    var crashApp = express();
    crashApp.get('*', function (request, response, next) {
        response.send("This server is in maintenance")
    });
    if (stack.globals.environment.https){
        var privateKey = fs.readFileSync(stack.globals.environment.privateKeyPath, "utf8");
        var certificate = fs.readFileSync(stack.globals.environment.certificatePath, "utf8");
        var ca = [];
        for (var caPath of stack.globals.environment.caPaths) {
            ca.push(fs.readFileSync(caPath, "utf8"));
        }
        var credentials = {key: privateKey, cert: certificate, secure: true, ca: ca};
        crashApp.set('port', stack.globals.environment.httpsPort);
        var crashServer = https.createServer(credentials, crashApp);
        crashServer.listen(stack.globals.environment.httpsPort);
        console.log((new Date()).toLocaleString() + " CATCH SERVER LAUNCHED ON PORT " + stack.globals.environment.httpsPort);
    } else {
        console.log((new Date()).toLocaleString() + " CATCH SERVER LAUNCHED ON PORT " + stack.globals.environment.httpPort);
        crashApp.listen(stack.globals.environment.httpPort);
    }

}
function stack_mapis() {

}
var stack_middleware = [
    function poweredBy(request, response, next) {
        response.setHeader("x-powered-by", "KVM Stack");
        next();
    }
];
function requirements() {
    var promises = [];
    var mongoose = getDependency('mongoose');
    mongoose.Promise = Promise;

    var config = {};
    config.mongo = getDependency('../config/mongo.json');

    promises.push(
        new Promise((resolve, reject) => {
            mongoose.connect(config.mongo.url, {user: config.mongo.user, pass: config.mongo.password}, function (err) {
                if (err) {
                    reject("Failed to connect MongoDB: " + err);
                }
                else {
                    console.log("Mongoose connection validated");
                    mongoose.connection.close();
                    resolve("Mongoose connection validated");
                }
            })
        })
    );

    return promises;
}
function stack_tests() {
}
function router_access() {
    var express = getDependency('express'),
        router = express.Router();


    router.get("/logout",
        stack.dapis.access.pehgs.logout(),
        function* (request, response, next){
            response.redirect("/loggedOut");
        }
    );

    router.get("/", stack.dapis.access.ehgs.me());
    router.post("/", stack.dapis.access.pehgs.login("/", "/?e=asd"));

    return router;
}
/**
 * Created by eqo on 19/12/16.
 */

function router_agenda() {
    let router = new StackRouter();

    let bodyExtractor = request => request.body;
    let identifierExtractor = request => request.params.identifier;

    var Agenda = getDependency(model_agenda);

    router.onRoute("/")
        .onGet((request, response, next) => {
            Agenda.find()
                .then(data => {
                    response.send(data);
                })
                .catch(errors => {
                    console.log(errors);
                });
        })
        .onPost((request, response, next) => {
            if (data) {
                var myAgenda = new Agenda();
                myAgenda.date = request.body.date;
                myAgenda.title = request.body.title;
                myAgenda.content = request.body.content;
                return myClient.save();
            } else {
                throw "No data";
            }
        })
        .then(data => {
            response.send(data);
        })
        .catch(errors => {
            console.log(errors);
        });


    router.onRoute("/:identifier")
        .onGet((request, response, next) => {

        })
        .onPut((request, response, next) => {

        })
        .onDelete((request, response, next) => {

        })
    ;

    return router;
}
/**
 * Created by eqo on 19/12/16.
 */

function router_client_doctors() {
    let router = new StackRouter();

    let bodyExtractor = request => request.body;
    let identifierExtractor = request => request.params.identifier;

    var Client = getDependency(model_client_doctor);

    router.onRoute("/")
        .onGet((request, response, next) => {
            Client.find()
                .then(data => {
                    response.send(data);
                })
                .catch(errors => {
                    console.log(errors);
                });
        })
        .onPost((request, response, next) => {
            if (data) {
                var myClient = new Client();
                myClient.name           = request.body.name;
                myClient.surname        = request.body.surname;
                myClient.society        = request.body.society;
                myClient.address        = request.body.address;
                myClient.postalCode     = request.body.postalCode;
                myClient.city           = request.body.city;
                myClient.phoneNumber1   = request.body.phoneNumber1;
                myClient.phoneNumber2   = request.body.phoneNumber2;
                myClient.fax            = request.body.fax;
                myClient.mobile         = request.body.mobile;
                myClient.infos          = request.body.infos;
                myClient.state          = request.body.state;
                myClient.user           = request.body.user;
                return myClient.save();
            } else {
                throw "No data";
            }
        })
        .then(data => {
            response.send(data);
        })
        .catch(errors => {
            console.log(errors);
        });

    router.onRoute("/:identifier")
        .onGet((request, response, next) => {

        })
        .onPut((request, response, next) => {

        })
        .onDelete((request, response, next) => {

        })
    ;

    return router;
}
/**
 * Created by eqo on 19/12/16.
 */

function router_client_individuals() {
    let router = new StackRouter();

    let bodyExtractor = request => request.body;
    let identifierExtractor = request => request.params.identifier;

    var Client = getDependency(model_client_individual);

    router.onRoute("/")
        .onGet((request, response, next) => {
            Client.find()
                .then(data => {
                    response.send(data);
                })
                .catch(errors => {
                    console.log(errors);
                });
        })
        .onPost((request, response, next) => {
            if (data) {
                var myClient = new Client();
                myClient.name           = request.body.name;
                myClient.surname        = request.body.surname;
                myClient.address        = request.body.address;
                myClient.postalCode     = request.body.postalCode;
                myClient.city           = request.body.city;
                myClient.phoneNumber1   = request.body.phoneNumber1;
                myClient.phoneNumber2   = request.body.phoneNumber2;
                myClient.fax            = request.body.fax;
                myClient.mobile         = request.body.mobile;
                myClient.infos          = request.body.infos;
                myClient.state          = request.body.state;
                myClient.user           = request.body.user;
                return myClient.save();
            } else {
                throw "No data";
            }
        })
        .then(data => {
            response.send(data);
        })
        .catch(errors => {
            console.log(errors);
        });

    router.onRoute("/:identifier")
        .onGet((request, response, next) => {

        })
        .onPut((request, response, next) => {

        })
        .onDelete((request, response, next) => {

        })
    ;

    return router;
}
function router_contents() {
    let router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let contentsEhgs = stack.dapis.contents.ehgs;


    router.onRoute("/")
        .onGet(contentsEhgs.getPaged(0, 15))
        .onPost(contentsEhgs.create(bodyExtractor))
    ;

    router.onRoute("/trashs")
        .onGet(contentsEhgs.getTrashed())
    ;

    router.onRoute("/trash/:identifier")
        .onPut(contentsEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/untrash/:identifier")
        .onPut(contentsEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/bind/:identifier")
        .onPut(contentsEhgs.bind(identifierExtractor, r => r.body.childId))
        .onPost(contentsEhgs.createAndBind(bodyExtractor, identifierExtractor))
    ;

    router.onRoute("/makeIndependent/:identifier")
        .onPut(contentsEhgs.makeIndependent(identifierExtractor))
    ;

    router.onRoute("/setChildren/:identifier")
        .onPut(
            stack.dapis.useful.pehgs.parseJson(),
            contentsEhgs.setChildren(identifierExtractor, r => r.body.childrenId))
    ;

    router.onRoute("/channel/:identifier")
        .onGet(contentsEhgs.getInChannel(identifierExtractor))
    ;

    router.onRoute("/independentInChannel/:identifier")
        .onGet(contentsEhgs.getIndependentInChannel(identifierExtractor))
    ;

    router.onRoute("/channel/rename")
        .onPut(contentsEhgs.renameChannel(r => r.body.channelArg, r => r.body.newChannelArg))
    ;

    router.onRoute("/:identifier")
        .onDelete(contentsEhgs.delete(identifierExtractor))
        .onGet(contentsEhgs.get(identifierExtractor))
    ;

    router.onRoute("/publish/:identifier")
        .onPut(contentsEhgs.publish(identifierExtractor))
    ;

    router.onRoute("/unpublish/:identifier")
        .onPut(contentsEhgs.unpublish(identifierExtractor))
    ;

    router.onRoute("/property/:identifier")
        .onPut(contentsEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/properties/:identifier")
        .onPut(contentsEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;


    return router;
}
function router_files() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;
    
    router.onAll("/*", stack.dapis.access.pehgs.restrictTo(5, "/"));

    router.onRoute("/")
        .onGet(function (request, response, next) {
        })
        .onPost(
            stack.dapis.files.pehgs.upload(),
            function* (request, response, next){
                response.send(request.peh);
            }
        )
    ;
    router.onRoute("/s")
        .onPost(
            stack.dapis.files.pehgs.secureUpload(r => r.user._id),
            function* (request, response, next){
                response.send(request.peh);
            }
        )
    ;

    router.onRoute("/s/:identifier")
        .onGet(stack.dapis.files.ehgs.serve(identifierExtractor, r => r.user._id))
    ;

    router.onRoute("/pages/:page/:pageLength")
        .onGet(stack.dapis.files.ehgs.getPaged(r => r.params.page, r => r.params.pageLength))
    ;

    router.onRoute("/:identifier")
        .onGet(stack.dapis.files.ehgs.get(identifierExtractor))
        .onPut(stack.dapis.files.ehgs.update(identifierExtractor, bodyExtractor))
        .onDelete(stack.dapis.files.ehgs.delete(identifierExtractor))
    ;

    return router;
}
function router_forms() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let evaluationEhgs = stack.project.mapis.forms.evaluations.ehgs;
    let surveyEhgs = stack.project.mapis.forms.survey.ehgs;
    let multipleResultEhgs = stack.project.mapis.forms.multipleResults.ehgs;

    //Evaluation
    router.onRoute("/evaluations")
        .onPost(evaluationEhgs.create(bodyExtractor))
    ;

    router.onRoute("/evaluations/getPaged/")
        .onGet(evaluationEhgs.getPaged(0, 15))
    ;

    router.onRoute("/evaluations/:identifier")
        .onGet(evaluationEhgs.get(identifierExtractor))
        .onPut(evaluationEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(evaluationEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/evaluations/trash/:identifier")
        .onPut(evaluationEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/evaluations/untrash/:identifier")
        .onPut(evaluationEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/evaluations/updateProperties/:identifier")
        .onPut(evaluationEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/evaluations/updateProperty/:identifier")
        .onPut(evaluationEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/evaluations/makeCopy/:identifier")
        .onPost(evaluationEhgs.makeCopy(identifierExtractor))
    ;

    router.onRoute("/evaluations/calculateScore/:identifier")
        .onGet(evaluationEhgs.calculateScore(identifierExtractor))
    ;

    router.onRoute("/evaluations/calculateAverage/:identifier")
        .onGet(evaluationEhgs.calculateAverage(r => r.body.title))
    ;

    router.onRoute("/evaluations/calculateVariance/")
        .onGet(evaluationEhgs.calculateVariance(r => r.body.title))
    ;

    //Survey
    router.onRoute("/surveys")
        .onPost(surveyEhgs.create(bodyExtractor))
    ;

    router.onRoute("/surveys/getPaged/")
        .onGet(surveyEhgs.getPaged(0, 15))
    ;

    router.onRoute("/surveys/:identifier")
        .onGet(surveyEhgs.get(identifierExtractor))
        .onPut(surveyEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(surveyEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/surveys/trash/:identifier")
        .onPut(surveyEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/surveys/untrash/:identifier")
        .onPut(surveyEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/surveys/updateProperties/:identifier")
        .onPut(surveyEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/surveys/updateProperty/:identifier")
        .onPut(surveyEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/surveys/makeCopy/:identifier")
        .onPost(surveyEhgs.makeCopy(identifierExtractor))
    ;

    //MultipleResult
    router.onRoute("/multipleResults")
        .onPost(multipleResultEhgs.create(bodyExtractor))
    ;

    router.onRoute("/multipleResults/getPaged/")
        .onGet(multipleResultEhgs.getPaged(0, 15))
    ;

    router.onRoute("/multipleResults/:identifier")
        .onGet(multipleResultEhgs.get(identifierExtractor))
        .onPut(multipleResultEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(multipleResultEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/multipleResults/trash/:identifier")
        .onPut(multipleResultEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/multipleResults/untrash/:identifier")
        .onPut(multipleResultEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/multipleResults/updateProperties/:identifier")
        .onPut(multipleResultEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/multipleResults/updateProperty/:identifier")
        .onPut(multipleResultEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/multipleResults/makeCopy/:identifier")
        .onPost(multipleResultEhgs.makeCopy(identifierExtractor))
    ;

    router.onRoute("/multipleResults/addResult/:identifier")
        .onPut(multipleResultEhgs.addResult(identifierExtractor, r => r.body.resultText, r => r.body.goodResponsesArray, r => r.body.badResponsesArray))
    ;

    router.onRoute("/multipleResults/removeResult/:identifier")
        .onPut(multipleResultEhgs.removeResult(identifierExtractor, r => r.body.index))
    ;

    router.onRoute("/multipleResults/increaseResult/:identifier")
        .onPut(multipleResultEhgs.increaseResult(identifierExtractor, r => r.body.index))
    ;

    router.onRoute("/multipleResults/decreaseResult/:identifier")
        .onPut(multipleResultEhgs.decreaseResult(identifierExtractor, r => r.body.index))
    ;

    router.onRoute("/multipleResults/getFinalResult/:identifier")
        .onGet(multipleResultEhgs.getFinalResult(identifierExtractor))
    ;



    return router;
}

function router_front(){
    var express = getDependency('express'),
        Promise = getDependency('es6-promise').Promise,
        util = getDependency('util'),
        formidable = getDependency('formidable');
    router = express.Router();

    router.get("/", function(req, res){
        res.render("pages/login")
    });

    return router;
}
function router_page() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let pageEhgs = stack.project.mapis.page.page.ehgs;
    let sectionEhgs = stack.project.mapis.page.section.ehgs;

    //Page

    router.onRoute("/page/")
        .onPost(pageEhgs.create(bodyExtractor))
    ;

    router.onRoute("/page/getPaged/")
        .onGet(pageEhgs.getPaged(0, 15))
    ;

    router.onRoute("/page/getAllSeasonal/")
        .onGet(pageEhgs.getAllSeasonal())
    ;

    router.onRoute("/page/getAllEventMod/")
        .onGet(pageEhgs.getAllEventMod())
    ;

    router.onRoute("/page/:identifier")
        .onGet(pageEhgs.get(identifierExtractor))
        .onPut(pageEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(pageEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/page/getSectionsInPage/:identifier")
        .onGet(pageEhgs.getSectionsInPage(identifierExtractor))
    ;

    router.onRoute("/page/trash/:identifier")
        .onPut(pageEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/page/untrash/:identifier")
        .onPut(pageEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/page/updateProperties/:identifier")
        .onPut(pageEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/page/updateProperty/:identifier")
        .onPut(pageEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/page/addChildren/:identifier")
        .onPut(pageEhgs.addChildren(identifierExtractor, r => r.body.childrenIdArg))
    ;

    router.onRoute("/page/makeIndependent/:identifier")
        .onPut(pageEhgs.makeIndependent(identifierExtractor))
    ;

    router.onRoute("/page/bind/:identifier")
        .onPut(pageEhgs.bind(identifierExtractor, r => r.body.childId))
        .onPost(pageEhgs.createAndBind(bodyExtractor, identifierExtractor))
    ;

    router.onRoute("/page/clearChildren/:identifier")
        .onPut(pageEhgs.clearChildren(identifierExtractor))
    ;

    router.onRoute("/page/removeChild/:identifier")
        .onPut(pageEhgs.removeChild(identifierExtractor, r => r.body.childIdArg))
    ;

    //Section

    router.onRoute("/section/getPaged")
        .onPut(sectionEhgs.getPaged(r => r.body.pageArg, r => r.body.pageLengthArg))
    ;

    router.onRoute("/section/")
        .onPost(sectionEhgs.create(bodyExtractor))
    ;

    router.onRoute("/section/:identifier")
        .onGet(sectionEhgs.get(identifierExtractor))
        .onPut(sectionEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(sectionEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/section/trash/:identifier")
        .onPut(sectionEhgs.trash(identifierExtractor))
    ;

    router.onRoute("/section/untrash/:identifier")
        .onPut(sectionEhgs.untrash(identifierExtractor))
    ;

    router.onRoute("/section/updateProperties/:identifier")
        .onPut(sectionEhgs.updateProperties(identifierExtractor, bodyExtractor))
    ;

    router.onRoute("/section/updateProperty/:identifier")
        .onPut(sectionEhgs.updateProperty(identifierExtractor, r => r.body.propertyArg, r => r.body.stringArg))
    ;

    router.onRoute("/section/addChildren/:identifier")
        .onPut(sectionEhgs.addChildren(identifierExtractor, r => r.body.childrenIdArg))
    ;

    router.onRoute("/section/bind/:identifier")
        .onPut(sectionEhgs.bind(identifierExtractor, r => r.body.childId))
        .onPost(sectionEhgs.createAndBind(bodyExtractor, identifierExtractor))
    ;

    router.onRoute("/section/clearChildren/:identifier")
        .onPut(sectionEhgs.clearChildren(identifierExtractor))
    ;

    router.onRoute("/section/removeChild/:identifier")
        .onPut(sectionEhgs.removeChild(identifierExtractor, r => r.body.childIdArg))
    ;

    router.onRoute("/section/setPosition/:identifier")
        .onPut(sectionEhgs.setPosition(identifierExtractor, r => r.body.positionArg))
    ;

    router.onRoute("/section/setAlign/:identifier")
        .onPut(sectionEhgs.setAlign(identifierExtractor, r => r.body.alignArg))
    ;

    router.onRoute("/section/addSectionToPage/:identifier")
        .onPut(sectionEhgs.addSectionToPage(identifierExtractor, r => r.body.pageIdArg))
    ;

    router.onRoute("/section/getParents/:identifier")
        .onGet(sectionEhgs.getParents(identifierExtractor))
    ;

    return router;
}
function router_people() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let peoplesEhgs = stack.project.mapis.people.ehgs;

    router.onRoute("/")
        .onGet(peoplesEhgs.getAll())
        .onPost(peoplesEhgs.create(bodyExtractor))
    ;

    router.onRoute("/:identifier")
        .onGet(peoplesEhgs.get(identifierExtractor))
        .onPut(peoplesEhgs.update(identifierExtractor, bodyExtractor))
        .onDelete(peoplesEhgs.delete(identifierExtractor))
    ;

    router.onRoute("/makeIndependent/:identifier")
        .onPut(peoplesEhgs.makeIndependent(identifierExtractor))
    ;

    router.onRoute("/setChildren/:identifier")
        .onPut(peoplesEhgs.setChildren(identifierExtractor, r => r.body.childrenId))
    ;

    router.onRoute("/makeDivorced/:identifier")
        .onPut(peoplesEhgs.makeDivorced(identifierExtractor))
    ;

    router.onRoute("/setSpouse/:identifier")
        .onPut(peoplesEhgs.setSpouse(identifierExtractor, r => r.body.spouseId))
    ;

    router.onRoute("/desactivateOrReactivate/:identifier")
        .onPut(peoplesEhgs.desactivateOrReactivate(identifierExtractor))
    ;

    router.onRoute("/addFriend/:identifier")
        .onPut(peoplesEhgs.addFriend(identifierExtractor, r => r.body.friendId))
    ;

    router.onRoute("/removeFriend/:identifier")
        .onPut(peoplesEhgs.removeFriend(identifierExtractor, r => r.body.friendId))
    ;

    router.onRoute("/addSibling/:identifier")
        .onPut(peoplesEhgs.addSibling(identifierExtractor, r => r.body.siblingId))
    ;

    router.onRoute("/removeSibling/:identifier")
        .onPut(peoplesEhgs.removeSibling(identifierExtractor, r => r.body.siblingId))
    ;

    router.onRoute("/checkMail/:identifier")
        .onGet(peoplesEhgs.checkMail(identifierExtractor))
    ;

    router.onRoute("/createWithUser")
        .onPost(peoplesEhgs.createWithUser(r => r.body.peopleLightInstance, r => r.body.userLightInstance))
    ;

    router.onRoute("/getPeopleOfUser/:identifier")
        .onGet(peoplesEhgs.getPeopleOfUser(identifierExtractor))
    ;

    return router;
}
function router_settings() {
    var router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    let settings = stack.dapis.settings.ehgs;

    router.onRoute("/")
        .onGet(settings.getPaged(0, 100))
        .onPost(settings.create(bodyExtractor))
    ;

    router.onRoute("/reset/:identifier")
        .onPut(settings.reset(identifierExtractor));

    router.onRoute("/:identifier")
        .onGet(settings.get(identifierExtractor))
        .onPut(settings.set(identifierExtractor, r => r.body.value))
        .onDelete(settings.delete(identifierExtractor))
    ;

    return router;
}
/**
 * Created by eqo on 19/12/16.
 */

function router_statistics() {
    let router = new StackRouter();

    let bodyExtractor = request => request.body;
    let identifierExtractor = request => request.params.identifier;

    var Statistics = getDependency(model_statistics);

    router.onRoute("/")
        .onGet((request, response, next) => {
            Statistics.find()
                .then(data => {
                    response.send(data);
                })
                .catch(errors => {
                    console.log(errors);
                });
        })
        .onPost((request, response, next) => {
            if (data) {
                var myStatistics = new Statistics();
                myStatistics.name      = request.body.name;
                return myStatistics.save();
            } else {
                throw "No data";
            }
        })
        .then(data => {
            response.send(data);
        })
        .catch(errors => {
            console.log(errors);
        });

    router.onRoute("/:identifier")
        .onGet((request, response, next) => {

        })
        .onPut((request, response, next) => {

        })
        .onDelete((request, response, next) => {

        })
    ;

    return router;
}
function router_test() {
    var router = new StackRouter();

    router.onRoute("/")
        .onGet(function* (request, response, next) {
            var dummyArray = yield $project.models.dummy.find();
            console.log(dummyArray);
            response.send(dummyArray);
        })
    ;

    return router;
}
/**
 * Created by eqo on 19/12/16.
 */

function router_users() {
    var express = getDependency('express'),
        router = express.Router();


    let bodyExtractor = request => request.body;
    let identifierExtractor = request => request.params.identifier;

    var User = getDependency(model_user);

    router.route("/")
        .get((request, response, next) => {
            User.find()
                .then(data => {
                    response.send(data);
                })
                .catch(errors => {
                    console.log(errors);
                });
        })
        .post((request, response, next) => {
            if (data) {
                var myUser = new User();
                myUser.name      = request.body.name;
                myUser.surname   = request.body.surname;
                myUser.logId     = request.body.logId;
                myUser.password  = request.body.password;
                myUser.rank      = request.body.rank;
                myUser.stats     = request.body.stats;
                return myUser.save();
            } else {
                throw "No data";
            }
        })
        .then(data => {
            response.send(data);
        })
        .catch(errors => {
            console.log(errors);
        });

    router.route("/:identifier")
        .get((request, response, next) => {

        })
        .put((request, response, next) => {

        })
        .delete((request, response, next) => {

        })
    ;

    return router;
}
function router_users() {
    let router = new StackRouter();

    let bodyExtractor = r => r.body;
    let identifierExtractor = r => r.params.identifier;

    router.onRoute("/")
        .onGet(function (request, response, next) {

        })
        .onPost(stack.dapis.users.ehgs.create(bodyExtractor))
    ;

    router.onRoute("/pages/:page/:pageLength")
        .onGet(stack.dapis.users.ehgs.getPaged(r => r.params.page, r => r.params.pageLength))
    ;

    router.onRoute("/:identifier")
        .onGet(stack.dapis.users.ehgs.get(identifierExtractor))
        .onPut(stack.dapis.users.ehgs.update(identifierExtractor, bodyExtractor))
        .onDelete(stack.dapis.users.ehgs.remove(identifierExtractor))
    ;

    return router;
}
/**
 * Created by eqo on 19/12/16.
 */

function model_agenda() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var agenda = new Schema({
        //incomplete
        date: {type: Date, required: true},
    });

    return mongoose.model('agenda', agenda);
}
/**
 * Created by eqo on 19/12/16.
 */

function model_client_doctor() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var doctor = new Schema({
        name:           {type: String,   required: true},
        surname:        {type: String,   required: true},
        society:        {type: String,   required: true},
        address:        {type: String,   required: true},
        postalCode:     {type: String,   required: true},
        city:           {type: String,   required: true},
        phoneNumber1:   {type: Number,   required: true},
        phoneNumber2:   {type: Number,   required: true},
        fax:            {type: Number,   required: true},
        mobile:         {type: Number,   required: true},
        infos:          {type: String,   required: true},
        state:          {type: String,   required: true},
        user:           {type: objectId, required: true},
    });

    return mongoose.model('doctor', doctor);
}
/**
 * Created by eqo on 19/12/16.
 */

function model_client_individual() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var individual = new Schema({
        name:           {type: String,   required: true},
        surname:        {type: String,   required: true},
        address:        {type: String,   required: true},
        postalCode:     {type: String,   required: true},
        city:           {type: String,   required: true},
        phoneNumber1:   {type: Number,   required: true},
        phoneNumber2:   {type: Number,   required: true},
        fax:            {type: Number,   required: true},
        mobile:         {type: Number,   required: true},
        infos:          {type: String,   required: true},
        state:          {type: String,   required: true},
        user:           {type: objectId, required: true},
    });

    return mongoose.model('individual', individual);
}
function model_dummy() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var myShema = new Schema({
        title: {type: String, required: true}
    });

    return mongoose.model('dummy', myShema);
}
/**
 * Created by eqo on 19/12/16.
 */

function model_statistics() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var statistics = new Schema({
        //incomplete
        name:       {type: String,   required: true},
    });

    return mongoose.model('statistics', statistics);
}
/**
 * Created by eqo on 19/12/16.
 */

function model_user() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var user = new Schema({
        name:       {type: String,   required: true},
        surname:    {type: String,   required: true},
        logId:      {type: String,   required: true},
        password:   {type: String,   required: true},
        rank:       {type: Number,   required: true},
        stats:      {type: objectId, required: true},
    });

    return mongoose.model('user', user);
}
exports.launch = function (__env__) {
    __env__ = __env__.data;

    Promise.all(requirements())
        .then(_ => {
            try {
                launchServer(__env__);
            } catch (e) {
                console.log((new Date()).toLocaleString() + " SERVER CRASHED");

                if (stack.globals.server) {
                    console.log((new Date()).toLocaleString() + " SHUTTING DOWN SERVER");
                    stack.globals.server.close();
                }

                stack_crash(e);
            }
        })
        .catch(err => {
            console.log(err);
            console.log("Error exiting app some requirements were not met.")
        })
    ;
};

var stack = {};
stack.globals = {};
stack.globals.server = {};
stack.globals.expressApp = {};
stack.globals.redirectServer = {};
stack.globals.environment = {};
stack.globals.mongoose = {};
stack.globals.version = "1.0.0";
stack.mapis = {};
stack.dapis = {};
stack.models = {};
stack.core = {};

function launchServer(__env__) {
    stack.globals.environment = __env__;
    //Module dependencies.
    var debug = getDependency('debug')('test:server');
    var http = getDependency('http');
    var https = getDependency('https');
    var fs = getDependency('fs');
    var express = getDependency('express');

    stack.globals.expressApp = express();
    var port;
    //Create HTTP server.
    if (__env__.https) {
        port = __env__.httpsPort;
        stack.globals.expressApp.set('port', port);

        var privateKey = fs.readFileSync(__env__.privateKeyPath, "utf8");
        var certificate = fs.readFileSync(__env__.certificatePath, "utf8");
        var ca = [];
        for (var caPath of __env__.caPaths) {
            ca.push(fs.readFileSync(caPath, "utf8"));
        }
        var credentials = {key: privateKey, cert: certificate, secure: true, ca: ca};

        var redirectServer = express();
        redirectServer.get('*',function(req,res){
            res.redirect('https://'+__env__.domain+":"+port+req.url)
        });

        stack.globals.redirectServer = redirectServer.listen(__env__.httpPort);

        stack.globals.server = https.createServer(credentials, stack.globals.expressApp);
    } else {
        port = __env__.httpPort;
        stack.globals.expressApp.set('port', port);
        stack.globals.server = http.createServer(stack.globals.expressApp);
    }

    initExpress();

    //Listen on provided port, on all network interfaces.
    stack.globals.server.listen(port);
    stack.globals.server.on('error', function (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error('Port requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error('Port is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    stack.globals.server.on('listening', function () {
        var addr = stack.globals.server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        stack.helpers.aLog('\033[32mListening on ' + bind + "\033[0m");
    });
}
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

var dependency = {};

function getDependency(dependencyArg) {
    dependency = dependency || {};
    if(typeof dependencyArg == "string"){
        if (!dependency[dependencyArg]) {
            dependency[dependencyArg] = require(dependencyArg);
        }
        return dependency[dependencyArg];
    }
    else if(typeof dependencyArg == "function"){
        if (!dependency[dependencyArg.name]) {
            dependency[dependencyArg.name] = dependencyArg();
        }
        return dependency[dependencyArg.name];
    }
    else {
        throw "Dependency injection not supported for type " + typeof dependencyArg ;
    }
}

var stack = stack || {};
stack.core = stack.core || {};
stack.core.getDependency = getDependency;

function updateDependency(dependencyArg){
    if (!dependency) {
        dependency = {};
    }
    if(typeof dependencyArg == "string"){
        dependency[dependencyArg] = require(dependencyArg);
        return dependency[dependencyArg];
    }
    else if(typeof dependencyArg == "function"){
        dependency[dependencyArg.name] = dependencyArg();
        return dependency[dependencyArg.name];
    }
    else {
        throw "Dependency injection not supported for type " + typeof dependencyArg ;
    }
}
function loadMAPI(mapiArg) {
    dependency = dependency || {};
    if (typeof mapiArg == "string") {
        if (!dependency[mapiArg]) {
            dependency[mapiArg] = require(mapiArg);
            var myDependency = dependency[mapiArg];
            if (myDependency.__NAME && myDependency.__VERSION && myDependency.__AUTHOR && myDependency.__STACKVERSIONS && myDependency.load) {
                if (myDependency.__STACKVERSIONS.indexOf(stack.globals.version) > -1){
                    stack.mapis[myDependency.__NAME] = myDependency;
                    myDependency.load(stack);
                } else {
                    throw "Dependency is not compatible with this stack version";
                }
            } else {
                console.log(myDependency.__NAME + " " + myDependency.__VERSION + " " + myDependency.__AUTHOR + " " + myDependency.load);
                delete dependency[mapiArg];
                throw "Dependency is not compatible";
            }
        }
        return dependency[mapiArg];
    }
    else {
        throw "Dependency injection not supported for type " + typeof mapiArg;
    }
}

stack.core.loadMAPI = loadMAPI;

var stack = stack || {};
stack.helpers = stack.helpers || {};
stack.helpers.lastLogLevel = 0;



stack.helpers.iLog = function () {
    stack.helpers.lastLogLevel += 1;
    return stack.helpers;
};

stack.helpers.dLog = function () {
    stack.helpers.lastLogLevel -= 1;
    return stack.helpers;
};

stack.helpers.cLog = function (toBeLogged) {
    stack.helpers.lastLogLevel -= 1;
    stack.helpers.log(toBeLogged, -stack.helpers.lastLogLevel);
    stack.helpers.lastLogLevel = -stack.helpers.lastLogLevel;
    stack.helpers.log();
    return stack.helpers;
};

stack.helpers.aLog = function (toBeLogged) {
    console.log("\033[96m | ASYNC|-> \033[0m" + toBeLogged);
    return stack.helpers;
};

stack.helpers.log = function (toBeLogged, level) {
    if (level) {
        stack.helpers.lastLogLevel = level;
    }
    var prefix = "";
    if (stack.helpers.lastLogLevel > 0) {
        for (let i = 0; i < stack.helpers.lastLogLevel; i++) {
            prefix += "\033[3" + (i < 6 ? 2+i : 2).toString() + "m | \033[0m"
        }
    } else {
        for (let i = 0; i < -stack.helpers.lastLogLevel - 1; i++) {
            prefix += "\033[3" + (i < 6 ? 2+i : 2).toString() + "m | "
        }
        prefix += "\033[3" + (2-stack.helpers.lastLogLevel < 6 ? 2-stack.helpers.lastLogLevel : 2).toString() + "m |<- ";
        prefix += "\033[3" + (1-stack.helpers.lastLogLevel < 6 ? 1-stack.helpers.lastLogLevel : 2).toString() + "m";
    }
    console.log(prefix + (toBeLogged || "") +"\033[0m");
    return stack.helpers;
};
function stack_dapis() {
    stack.models.content = getDependency(dapi_model_content);
    stack.models.file = getDependency(dapi_model_file);
    stack.models.groups = getDependency(dapi_model_groups);
    stack.models.users = getDependency(dapi_model_users);
}
var dapi = dapi || {};
dapi.content = dapi.content || {};
dapi.content.interface = {};
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.content.newInstance = function (content, title, identifier, channel, tags, properties, rights, author, isPublic, hasParent) {
    var Content = getDependency(dapi_model_content);
    var myNewContent = new Content();
    myNewContent.title = title;
    myNewContent.content = content;
    myNewContent.channel = channel;
    myNewContent.tags = tags;
    myNewContent.rights = rights;
    myNewContent.author = author;
    myNewContent.isPublic = isPublic;
    myNewContent.children = [];
    myNewContent.hasParent = hasParent;
    myNewContent.identifier = identifier;
    myNewContent.properties = properties;
    return myNewContent;
};

dapi.content.deleteWithChildren = function (objectId) {
    return dapi.content.getChildren(objectId)
        .then(data => {
            if (data) {
                let promiseArray = [];
                for (let child of data) {
                    promiseArray.push(dapi.content.deleteWithChildren(child._id));
                }
                promiseArray.push(dapi.content.delete(objectId));
                return Promise.all(promiseArray);
            } else {
                return dapi.content.delete(objectId);
            }
        })
        ;
};

dapi.content.new = function (content, title, identifier, channel, tags, properties, rights, author, isPublic, hasParent) {
    return dapi.content.getAllIdentifiers(channel)
        .then(data => {
            if (identifier) {
                for (var object of data) {
                    if (object.identifier == identifier) {
                        return new Promise((resolve, reject) => {
                            reject("Identifier allready exists")
                        });
                    }
                }
            }
            var myInstance = dapi.content.newInstance(content, title, identifier, channel, tags, properties, rights, author, isPublic, hasParent);
            return myInstance.save();
        })
    ;
};

dapi.content.delete = function (id) {
    var Content = getDependency(dapi_model_content);
    return Content.findByIdAndRemove(id);
};

dapi.content.get = function (id) {
    var Content = getDependency(dapi_model_content);
    return Content.findById(id).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]).exec();
};
dapi.content.getChildren = function (id) {
    var Content = getDependency(dapi_model_content);
    return Content.findById(id, "children").populate('children').then(data => {
        if (data) {
            return data.children;
        } else {
            return new Promise((resolve, reject) => {
                reject("Object does not exist")
            });
        }
    });
};
dapi.content.getPublic = function (channel) {
    var Content = getDependency(dapi_model_content);
    return Content.find(channel ? {isPublic: true, channel: channel} : {isPublic: true}).populate([{
        path: 'children',
        select: ''
    }, {path: 'author', select: 'username'}]);
};
dapi.content.getAllowed = function (rights, channel) {
    var Content = getDependency(dapi_model_content);
    return Content.find(channel
            ? {
            $and: [
                {channel: channel},
                {
                    $or: [
                        {$where: "this.rights <= " + rights.toString()},
                        {isPublic: true}
                    ]
                }
            ]
        }
            : {
            $or: [
                {$where: "this.rights <= " + rights.toString()},
                {isPublic: true}
            ]
        }
    ).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
};
dapi.content.getAll = function (channel) {
    var Content = getDependency(dapi_model_content);
    return Content.find(channel ? {channel: channel} : {}).populate([{path: 'children', select: ''}, {
        path: 'author',
        select: 'username'
    }]);
};
dapi.content.getByIdentifier = function (channel, identifier) {
    if (channel) {
        var Content = getDependency(dapi_model_content);
        return Content.findOne({
            $and: [
                {channel: channel},
                {identifier: identifier}
            ]
        }).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
    } else {
        throw "Channel arg is not defined";
    }
};
dapi.content.getAllIdentifiers = function (channel) {
    var Content = getDependency(dapi_model_content);
    return Content.find(channel ? {channel: channel} : {}, "identifier").lean().exec();
};
dapi.content.getAllTopLevel = function (channel) {
    var Content = getDependency(dapi_model_content);
    return Content.find(channel ? {
        $and: [
            {channel: channel},
            {hasParent: {$ne: true}}
        ]
    } : {hasParent: {$ne: true}}).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
};
dapi.content.getAllPublicTopLevel = function (channel) {
    var Content = getDependency(dapi_model_content);
    return Content.find(channel ? {
        $and: [
            {isPublic: true},
            {channel: channel},
            {hasParent: {$ne: true}}
        ]
    } : {hasParent: {$ne: true}}).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
};

dapi.content.update = function (id, content, identifier, channel, title, tags, properties, rights, author, isPublic, hasParent) {
    var Content = getDependency(dapi_model_content);
    return dapi.content.getAllIdentifiers(channel)
        .then(data => {
            if (identifier) {
                for (var object of data) {
                    if (object.identifier == identifier && object._id != id) {
                        return new Promise((resolve, reject) => {
                            reject("Identifier allready exists")
                        });
                    }
                }
            }
            return Content.findByIdAndUpdate(id, {
                content: content,
                title: title,
                channel: channel,
                tags: tags,
                rights: rights,
                author: author,
                identifier: identifier,
                isPublic: isPublic,
                properties: properties,
                hasParent: hasParent
            }, {new: true}).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
        })
        ;
};

dapi.content.updateProperties = function (id, properties) {
    var Content = getDependency(dapi_model_content);
    return Content.findByIdAndUpdate(id, {properties: properties}, {new: true})
        .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
};
dapi.content.makePublic = function (id) {
    var Content = getDependency(dapi_model_content);
    return Content.findByIdAndUpdate(id, {isPublic: true}, {new: true})
        .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
};
dapi.content.makePrivate = function (id) {
    var Content = getDependency(dapi_model_content);
    return Content.findByIdAndUpdate(id, {isPublic: false}, {new: true})
        .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
};

dapi.content.addChild = function (parentId, childId) {
    var Content = getDependency(dapi_model_content);
    return Content.findByIdAndUpdate(parentId, {$addToSet: {children: childId}}, {new: true})
        .then(data => {
            return Content.findByIdAndUpdate(childId, {hasParent: true}, {new: true})
                .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
        });
};
dapi.content.updateProperty = function (id, property, stringValue) {
    var Content = getDependency(dapi_model_content);
    return Content.findById(id)
        .then(data => {
            data.properties[property] = stringValue;
            return data.save()
        });
};

dapi.content.createAndBind = function (parentId, content, title, identifier, channel, tags, properties, rights, author, isPublic) {
    return dapi.content.get(parentId).then(data => {
        if (data) {
            return dapi.content.new(content, title, identifier, channel, tags, properties, rights, author, isPublic, true).then(data => {
                return dapi.content.addChild(parentId, data._id);
            });
        } else {
            return new Promise((resolve, reject) => {
                reject("Object does not exist")
            });
        }
    });
};
dapi.content.ehCreateAndBind = function () {
    return function (request, response, next) {
        var data = request.body;
        dapi.content.createAndBind(
            data.parentId,
            data.content,
            data.title,
            data.identifier,
            data.channel,
            data.tags,
            data.properties,
            data.rights,
            data.author,
            data.isPublic
        ).then(data => {
            response.send(data);
        }).catch(errors => {
            response.send(errors)
        });
    };
};

dapi.content.ehCreatePublic = function (rights) {
    return function (request, response, next) {
        var data = request.body;
        dapi.content.new(data.content, data.title, data.identifier, data.channel, data.tags || [], data.properties || [], rights, data.author, true, false)
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors)
            })
        ;
    };
};

dapi.content.ehCreateRestricted = function (rights) {
    return function (request, response, next) {
        var data = request.body;
        dapi.content.new(data.content, data.title, data.identifier, data.channel, data.tags, data.properties || [], rights, data.author, false, false)
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors)
            })
        ;
    };
};

dapi.content.ehYieldSpecific = function (id) {
    return function (request, response, next) {
        dapi.content.get(id)
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors)
            })
        ;
    };
};

dapi.content.ehYield = function (fieldName) {
    return function (request, response, next) {
        dapi.content.get(request.params[fieldName || "id"])
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors)
            })
        ;
    };
};

dapi.content.ehDelete = function (fieldName) {
    return function (request, response, next) {
        dapi.content.delete(request.params[fieldName || "id"])
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors)
            })
        ;
    };
};

dapi.content.ehUpdate = function (idFieldName) {
    return function (request, response, next) {
        var data = request.body;
        dapi.content.update(
            request.params[idFieldName || "id"],
            data.content,
            data.identifier,
            data.channel,
            data.title,
            data.tags,
            data.properties,
            data.rights,
            data.author,
            data.isPublic
        )
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors);
            })
        ;
    };
};

dapi.content.ehUpdateProperties = function (idFieldName, propertiesFieldName) {
    return function (request, response, next) {
        var data = request.body;
        dapi.content.updateProperties(request.params[idFieldName || "id"], data[propertiesFieldName || "properties"])
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors);
            })
        ;
    };
};

dapi.content.ehMakePublic = function (idFieldNamee) {
    return function (request, response, next) {
        dapi.content.makePublic(request.params[idFieldName || "id"])
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors);
            })
        ;
    };
};

dapi.content.ehMakePrivate = function (idFieldName) {
    return function (request, response, next) {
        dapi.content.makePrivate(request.params[idFieldName || "id"])
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors);
            })
        ;
    };
};

dapi.content.ehYieldAllowedBySpecificLimit = function (rights, channel) {
    return function (request, response, next) {
        var data = request.body;
        dapi.content.getAllowed(rights, channel)
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors);
            })
        ;
    };
};

dapi.content.ehYieldAll = function (channel) {
    return function (request, response, next) {
        var promise = dapi.content.getAll(channel)
                .then(data => {
                    response.send(data);
                })
                .catch(errors => {
                    response.send(errors);
                })
            ;
    };
};

dapi.content.ehYieldAllTopLevel = function (channel) {
    return function (request, response, next) {
        dapi.content.getAllTopLevel(channel)
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors);
            })
        ;
    }
};

dapi.content.ehUpdateProperty = function (idFieldName, propertyFieldName, valueFieldName) {
    return function (request, response, next) {
        dapi.content.updateProperty(request.params[idFieldName || "id"], request.body[propertyFieldName || "property"], request.body[valueFieldName || "value"])
            .then(data => {
                response.send(data);
            })
            .catch(errors => {
                response.send(errors);
            })
        ;
    };
};

dapi.content.ehYieldAllowedByUser = function (channel) {
    return function (request, response, next) {
        var data = request.body;
        if (request.user) {
            if (request.user.admin) {
                dapi.content.getAll(channel)
                    .then(data => {
                        response.send(data);
                    })
                    .catch(errors => {
                        response.send(errors);
                    })
                ;
            }
            else if (request.user.rights) {
                dapi.content.getAllowed(request.user.rights, channel)
                    .then(data => {
                        response.send(data);
                    })
                    .catch(errors => {
                        response.send(errors);
                    })
                ;
            }
        } else {
            dapi.content.getPublic(channel)
                .then(data => {
                    response.send(data);
                })
                .catch(errors => {
                    response.send(errors);
                })
            ;
        }
    };
};

stack.dapis.content = dapi.content;
var dapi = dapi || {};
dapi.files = dapi.files || {};
dapi.files.interface = {};
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.files.ehUpload = function (rights, fieldName) {
    return function (req, res, next) {
        if(req.params.userId) {
            var express = getDependency('express'),
                Promise = getDependency('es6-promise').Promise,
                fs = getDependency('fs'),
                multer = getDependency('multer'),
                path = getDependency("path"),
                config = getDependency('../config/main.json'),
                glob = getDependency("glob"),
                models = {},
                conf = getDependency("../config/dapi/files.json"),
                adMessage = "You cannot pass....I am a servant of the Secret Fire, wielder of the flame of Anor. You cannot pass. The dark fire will not avail you, flame of Udûn. Go back to the Shadow! You cannot pass.";

            models.users = getDependency(dapi_model_users);
            models.groups = getDependency(dapi_model_groups);
            models.file = getDependency(dapi_model_file);

            var secureStorage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, './server/suploads');
                },
                filename: function (req, file, callback) {
                    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                }
            });
            var secureUpload = multer({storage: secureStorage}).array('files');
            secureUpload(req, res, function (err) {
                if (err) {
                    return res.end("Error uploading file.<br/>" + err.toString());
                }
                else {
                    var promises = [];
                    for (var i = 0; i < req.files.length; i++) {

                        promises.push(new Promise(function (resolve, reject) {
                            (function (e) {
                                var tempFile = req.files[e];
                                var newFile = new models.file();
                                newFile.rights = rights || req.user.rights || 7;
                                newFile.path = tempFile.path;
                                newFile.filename = tempFile.filename;
                                newFile.type = tempFile.mimetype;
                                newFile.userId = req.params[fieldName || "userId"];
                                newFile.name = tempFile.originalname;
                                newFile.save(function (err, product, mongoose) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(product);
                                    }
                                });
                            })(i); //systeme de capture de mutable
                        }));
                    }
                    Promise.all(promises).then(function (errors) {
                        req.fileUploadResults = errors;
                        next()
                    });
                }
            });
        } else {
            throw new Error("req.params.userId not defined");
        }
    }
};


dapi.files.ehUploadPublic = function () {
    return function (req, res, next) {
        var express = getDependency('express'),
            Promise = getDependency('es6-promise').Promise,
            fs = getDependency('fs'),
            multer = getDependency('multer'),
            path = getDependency("path"),
            config = getDependency('../config/main.json'),
            glob = getDependency("glob"),
            models = {},
            conf = getDependency("../config/dapi/files.json"),
            adMessage = "You cannot pass....I am a servant of the Secret Fire, wielder of the flame of Anor. You cannot pass. The dark fire will not avail you, flame of Udûn. Go back to the Shadow! You cannot pass.";

        models.users = getDependency(dapi_model_users);
        models.groups = getDependency(dapi_model_groups);
        models.file = getDependency(dapi_model_file);

        var secureStorage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './server/uploads');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        var secureUpload = multer({storage: secureStorage}).array('files');

        secureUpload(req, res, function (err) {
            if (err) {
                return res.end("Error uploading file.<br/>" + err.toString());
            }
            else {
                var promises = [];
                for (var i = 0; i < req.files.length; i++) {

                    promises.push(new Promise(function (resolve, reject) {
                        (function (e) {
                            var tempFile = req.files[e];
                            var newFile = new models.file();
                            newFile.rights = 7;
                            newFile.path = tempFile.path;
                            newFile.filename = tempFile.filename;
                            newFile.type = tempFile.mimetype;
                            newFile.userId = null;
                            newFile.name = tempFile.originalname;
                            newFile.save(function (err, product, mongoose) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(product);
                                }
                            });
                        })(i); //systeme de capture de mutable
                    }));
                }
                Promise.all(promises).then(function (errors) {
                    req.fileUploadResults = errors;
                    next()
                });
            }
        });
    }
};

dapi.files.ehDelete = function (fileFieldName) {
    return function (req, res, next) {
        var fileId = req.params[fileFieldName || "fileId"];
        var fileModels = getDependency(dapi_model_file);
        fileModels.findById(fileId).then(data => {
            fs.unlinkSync(data.path);
            fileModels.findByIdAndRemove(fileId).then(data => {
                req.fileUploadResults = data;
                next();
            }).catch(data => {
                req.fileUploadResults = data;
                next();
            })
        }).catch(err => {
            req.fileUploadResults = err;
            next();
        })
    }
};

dapi.files.ehServe = function(fileFieldName){
    return function (request, response, next) {
        var fileId = request.params[fileFieldName || "fileId"];
        var fileModels = getDependency(dapi_model_file);
        fileModels.findById(fileId)
            .then(file => {
                console.log(file);
                if(file.userId){
                    //File is owned
                    if(request.user){
                        stack.dapis.access.users.getBestRights(request.user._id)
                            .then(data => {
                                if(file.rights > data || file.userId.toString() == request.user._id.toString()){
                                    response.sendFile(getDependency("path").join(__dirname, "../", file.path));
                                } else {
                                    response.statusCode = 403;
                                    response.send("Permission dennied");
                                }
                            })
                            .catch(error => {
                                response.send(error);
                            })
                        ;
                    } else {
                        response.statusCode = 401;
                        response.send("Authentication failed");
                    }
                } else {
                    //File is public
                    response.sendFile(getDependency("path").join(__dirname, "../", file.path));
                }
            })
            .catch(error => {
                console.log(error, fileId);
                response.send(error);
            })
        ;
    }
};
stack.dapis.files = dapi.files;
var dapi = dapi || {};
dapi.access = dapi.access || {};
dapi.access.groups = {};
stack = stack || {};
stack.dapis = stack.dapis || {};


dapi.access.groups.create = function (groupname, admins, groupAdmins, rights, manageableBy) {
    var Groups = getDependency(dapi_model_groups);
    var myGroup = new Groups();
    myGroup.name = groupname;
    myGroup.members = [];
    myGroup.admins = admins;
    myGroup.groupAdmin = groupAdmins;
    myGroup.rights = rights;
    myGroup.manageableBy = manageableBy;
    return myGroup.save();
};
dapi.access.groups.exists = function (groupId) {
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (resolve) {
        Groups.count({_id: groupId}, function (err, count) {
            resolve(count > 0)
        });
    });
};
dapi.access.groups.get = function (groupId) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findById(groupId);
};
dapi.access.groups.getAll = function () {
    var Groups = getDependency(dapi_model_groups);
    return Groups.find({});
};
dapi.access.groups.removeMember = function (groupId, userId) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {$pull: {members: userId}})
};
dapi.access.groups.addUserAsAdmin = function (groupId, userId) {
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (resolve, reject) {
        stack.dapis.access.users.exists(userId).then(exists => {
            if (exists) {
                return stack.dapis.access.groups.get(groupId);
            } else {
                throw "User does not exist";
            }
        }).then(group => {
            if (group.admins.indexOf(userId) == -1) {
                Groups.findByIdAndUpdate(groupId, {$push: {admins: userId}}, function (err, lgroup) {
                    if (err)
                        reject(err);
                    else
                        resolve(lgroup);
                });
            }
            else {
                resolve(group)
            }
        }).catch(error => {
            reject(error);
        })
    });
};
dapi.access.groups.removeUserAsAdmin = function (groupId, userID) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {$pull: {admins: userID}})
};
dapi.access.groups.addGroupAsAdmin = function (groupId, futureAdminGroupId) {
    var Groups = getDependency(dapi_model_groups);
    var Users = getDependency(dapi_model_users);
    return new Promise(function (resolve, reject) {
        stack.dapis.access.groups.exists(futureAdminGroupId).then(exists => {
            if (exists) {
                if (exists) {
                    return stack.dapis.access.groups.get(groupId);
                } else {
                    throw "Group does not exist";
                }
            }
        }).then(group => {
            if (group.groupAdmin.indexOf(futureAdminGroupId) == -1) {
                Groups.findByIdAndUpdate(groupId, {$push: {groupAdmin: futureAdminGroupId}}, function (err, lgroup) {
                    if (err)
                        reject(err);
                    else
                        resolve(lgroup);
                });
            }
            else {
                resolve(group)
            }
        }).catch(error => {
            reject(error);
        })
    });
};
dapi.access.groups.removeGroupAsAdmin = function (groupId, adminGroupId) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {$pull: {groupAdmin: adminGroupId}})
};
dapi.access.groups.update = function (groupId, groupnameArg, rightsArg, manageableByArg) {
    var Groups = getDependency(dapi_model_groups);
    return Groups.findByIdAndUpdate(groupId, {
        $set: {
            name: groupnameArg || name,
            rights: rightsArg || rights,
            manageableBy: manageableByArg || manageableBy
        }
    }, {upsert: true});
};
dapi.access.groups.delete = function (groupId) {
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (topResolve, topReject) {
        stack.dapis.access.groups.exists(groupId).then(exists => {
            if (exists) {
                return stack.dapis.access.groups.get(groupId);
            } else {
                topReject("Group does not exist")
            }
        }).then(group => {
            var myPromises = [];
            myPromises.push(Groups.findByIdAndRemove(groupId));
            for (var memberId of group.members) {
                myPromises.push(stack.dapis.access.users.pureRemoveGroup(memberId, groupId));
            }
            topResolve(Promise.all(myPromises))
        }).catch(err => {
            topReject(err);
        })
    })
};
dapi.access.groups.canUserChangeGroup = function (groupId, userId) {
    return new Promise(function (topResolve, topReject) {
        Promise.all([
            stack.dapis.access.users.getBestRights(userId),
            stack.dapis.access.groups.get(groupId),
            stack.dapis.access.users.getRights(userId)
        ]).then(data => {
            console.log(data);
            topResolve((data[0] <= data[1].manageableBy && data[2].canChangeGroup.value))
        }).catch(err => {
            topReject(err);
        });
    });
};
stack.dapis.access = stack.dapis.access || {};
stack.dapis.access.groups = dapi.access.groups;
/**
 * Created by Kiran on 3/29/2016.
 */

var dapi = dapi || {};
dapi.mailer = dapi.mailer || {};
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.mailer.sendMails = function (mails) {
    return new Promise(function (resolve, reject) {
        var nodemail = getDependency("nodemailer");
        var mailConfig = getDependency("../config/dapi/mailer.json");

        var transport = nodemail.createTransport(mailConfig);
        var work = [];
        mails.forEach(function (mail) {
            work.push(transport.sendMail(mail));
        });
        Promise.all(work).then(data => {
            resolve(data);
        }, errArg => {
            reject(errArg)
        });
    });
};
stack.dapis.mailer = dapi.mailer;
var dapi = dapi || {};
dapi.useful = dapi.useful || {};
dapi.useful.interface = {};
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.useful.ehParseJSON = function (array) {
    var realArray = array || "body";
    return function(request, response, next){
        for(var index in request[realArray]) {
            try {
                request[realArray][index] = JSON.parse(request[realArray][index])
            } catch (e) {
                request[realArray][index] = e;
            }
        }
        next();
    };
};

dapi.useful.ehQuickRender = function (page) {
    return function(request, response, next){
        response.render(page, {user: request.user || false, page: page});
    }
};

dapi.useful.ehPlug = function (message) {
    return function(request, response, next){
        response.send(message);
    }
};

dapi.useful.ehSetHeader = function (field, value) {
    return function(request, response, next){
        response.set(field, value);
        next();
    }
};

dapi.useful.ehFieldsExist = function (fieldArray, requestArrayName) {
    return function (request, response, next) {
        var errors = [];
        var type = requestArrayName || "body";
        for (let field of fieldArray) {
            if (!request[type][field]) {
                errors.push(`${field} does not exists in request.${type}`);
            }
        }
        if (!errors.length) {
            next();
        }
        else {
            response.status(400);
            response.send(errors);
        }
    }
};

dapi.useful.helperEhgfParams = function (element, request, defaultValue) {
    return (typeof element == "function" ? element(request) : element) || defaultValue || 0;
};

stack.dapis.useful = dapi.useful;
var dapi = dapi || {};
dapi.access = dapi.access || {};
dapi.access.conf = getDependency('../config/dapi/access.json');
stack = stack || {};
stack.dapis = stack.dapis || {};

dapi.access.users = {};
dapi.access.users.create = function (username, password, rights) {
    var Users = getDependency(dapi_model_users);
    var sha = getDependency("sha256");
    return new Promise(function (topResolve, topReject) {
        Users.count({username: username}, function (err, nbr) {
            if (err)
                topReject(err);
            else if (nbr == 0 && username != "") {
                var myUser = new Users();
                myUser.username = username;
                myUser.password = password;
                myUser.rights = rights;

                myUser.save(function (err) {
                    if (err)
                        topReject(err);
                    else
                        topResolve(myUser);
                });
            } else {
                topReject('User with same username already exist');
            }
        });
    });
};
dapi.access.users.get = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findById(userId);
};
dapi.access.users.getWithoutPassword = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findById(userId, "-password");
};
dapi.access.users.getAllByRights = function (rightsArg) {
    var Users = getDependency(dapi_model_users);
    return Users.find({"rights": rightsArg}, "-password");
};
dapi.access.users.getGroups = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findById(userId, 'groups');
};
dapi.access.users.exists = function (userId) {
    var Users = getDependency(dapi_model_users);
    return new Promise(function (resolve, reject) {
        Users.count({_id: userId}, function (err, count) {
            resolve(count > 0)
        });
    });
};
dapi.access.users.addToGroup = function (groupId, userId) {
    var Users = getDependency(dapi_model_users);
    var Groups = getDependency(dapi_model_groups);
    return new Promise(function (topResolve, topReject) {
        dapi.access.groups.exists(groupId).then(function (data) {
            if (data) {
                return dapi.access.users.exists(userId);
            }
            else {
                throw "Group does not exist";
            }
        }).then(userExists => {
            if (userExists) {
                return dapi.access.users.getGroups(userId, false)
            } else {
                throw "User does not exist";
            }
        }).then(data => {
            if (data.groups.indexOf(groupId) == -1) {
                return Users.findByIdAndUpdate(userId, {$push: {groups: groupId}});
            }
            else {
                return "pass"
            }
        }).then(data => {
            return dapi.access.groups.get(groupId, false)
        }).then(data => {
            if (data.members.indexOf(userId) == -1) {
                Groups.findByIdAndUpdate(groupId, {$push: {members: userId}}, function (err) {
                    if (err) {
                        topReject(err);
                    } else {
                        topResolve("All good");
                    }
                });
            }
            else {
                topResolve("All good");
            }
        }).catch(data => {
            topReject(data);
        });
    });
};
dapi.access.users.getBestRights = function (userId) {
    var Users = getDependency(dapi_model_users);
    var Groups = getDependency(dapi_model_groups);
    var groupRights = [];
    return new Promise(function (topResolve, topReject) {
        dapi.access.users.getGroups(userId).then(data => {
            var myPromises = [];
            for (var groupId of data.groups) {
                (function (id) {
                    myPromises.push(new Promise(function (resolve, reject) {
                        Groups.findById(id, 'rights', function (err, group) {
                            resolve(group.rights);
                        })
                    }))
                })(groupId)
            }
            Promise.all(myPromises).then(data => {
                groupRights = data;
                return dapi.access.users.get(userId)
            }).then(user => {
                var usersBestRights = user.rights || 0;
                for (var rights of groupRights) {
                    if (usersBestRights < 2) {
                        continue;
                    }
                    if (rights < usersBestRights) {
                        usersBestRights = rights
                    }
                }
                topResolve(usersBestRights);
            }).catch(err => {
                topReject(err);
            })
        }).catch(err => {
            topReject(err);
        })
    });
};
dapi.access.users.update = function (userId, usernameArg, passwordArg, rightsArg) {
    var Users = getDependency(dapi_model_users);
    return Users.findByIdAndUpdate(userId, {
        $set: {
            username: usernameArg || username,
            password: passwordArg || password,
            rights: rightsArg || rights
        }
    }, {upsert: true});
};
dapi.access.users.remove = function (userId) {
    var Users = getDependency(dapi_model_users);
    return Users.findByIdAndRemove(userId)
};
dapi.access.users.checkCredentials = function (username, password) {
    var Users = getDependency(dapi_model_users);
    var sha = getDependency("sha256");
    return Users.findOne({'username': username, 'password': sha(password)}, '_id').then(data => {
        if (data) {
            return data._id;
        } else {
            return false;
        }
    });
};
dapi.access.users.pureRemoveGroup = function (userId, groupId) {
    var Users = getDependency(dapi_model_users);
    var Groups = getDependency(dapi_model_groups);
    return Users.findByIdAndUpdate(userId, {$pull: {groups: groupId}})
};
dapi.access.users.devare = function (userId) {
    var Users = getDependency(dapi_model_users);
    return new Promise(function (topResolve, topReject) {
        dapi.access.users.exists(userId).then(exists => {
            if (exists) {
                return dapi.access.users.getGroups(userId)
            }
            else {
                topResolve("All good");
            }
        }).then(user => {
            var myPromises = [];
            myPromises.push(Users.findByIdAndRemove(userId));
            for (var groupId of user.groups) {
                myPromises.push(dapi.access.groups.removeUserAsAdmin(groupId, userId));
                myPromises.push(dapi.access.groups.removeMember(groupId, userId));
            }
            topResolve(Promise.all(myPromises))
        }).catch(err => {
            topReject(err);
        })
    });
};
dapi.access.users.getRights = function (userId) {
    var Users = getDependency(dapi_model_users);
    var conf = getDependency("../config/dapi/access.json");
    return new Promise(function (topResolve, topReject) {
        dapi.access.users.getBestRights(userId).then(rights => {
            topResolve(conf.rights[rights])
        }).catch(err => {
            topReject(err)
        })
    });
};
dapi.access.users.canUserChangeUser = function (userId, challengerId) {
    return new Promise(function (topResolve, topReject) {
        Promise.all([
            dapi.access.users.getBestRights(userId),
            dapi.access.users.getBestRights(challengerId),
            dapi.access.users.getRights(challengerId)
        ]).then(data => {
            topResolve((data[0] > data[1] && data[2].canChangeUser.value))
        }).catch(err => {
            topReject(err);
        });
    });
};
dapi.access.users.removeFromGroup = function (groupId, userId) {
    return Promise.all([
        dapi.access.users.pureRemoveGroup(userId, groupId),
        dapi.access.groups.removeMember(groupId, userId)
    ])
};


dapi.access.ehAuth = function (limit, failureRedirect) {
    return function (request, response, next) {
        if (request.user) {
            if (request.user.admin) {
                next();
            } else if(!limit && limit !== 0) {
                console.log("next applied");
                next();
            } else {
                dapi.access.users.getBestRights(request.user._id).then(rights => {
                    if (rights <= limit) {
                        next();
                    } else {
                        response.statusCode = 403;
                        response.redirect(failureRedirect || dapi.access.conf.failureRedirect.value);
                    }
                }).catch(err => {
                    response.statusCode = 401;
                    response.redirect(failureRedirect || dapi.access.conf.failureRedirect.value);
                })
            }
        } else {
            response.statusCode = 401;
            response.redirect(failureRedirect || dapi.access.conf.failureRedirect.value);
        }
    }
};

dapi.access.ehLogin = function (successRedirect, failureRedirect) {
    return getDependency('passport').authenticate('local', {
        successRedirect: successRedirect || dapi.access.conf.successRedirect.value,
        failureRedirect: failureRedirect || dapi.access.conf.failureRedirect.value,
        failureFlash: true
    })
};

dapi.access.ehLogout = function () {
    return function (request, response, next) {
        request.logout();
        next();
    }
};
stack.dapis.access = stack.dapis.access || {};
stack.dapis.access.users = dapi.access.users;
function dapi_model_content(){
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var contents = new Schema({
        title: {type: String, required: true},
        content: {type:String},
        channel: {type:String},
        identifier: {type:String},
        tags: [{type: String}],
        properties: [{type: String}],
        rights: {type: Number},
        author: {type: Schema.ObjectId, ref: "dapi_user", required: false},
        children: [{type: Schema.ObjectId, ref: "dapi_content"}],
        timestamp: {type: Date, default: Date.now},
        isPublic : {type: Boolean},
        hasParent : {type: Boolean, default: false}
    });

    return mongoose.model('dapi_content', contents);
}
/**
 * Created by ressa on 3/10/2016.
 */
function dapi_model_file(){
    var mongoose = getDependency('mongoose'),
        Promise = getDependency('es6-promise').Promise,
        fs = getDependency('fs'),
        multer = getDependency('multer'),
        path = getDependency("path");

    var Schema = mongoose.Schema;

    var model = new Schema({
        name: {type: String, required: true},
        type: {type: String, required: true},
        rights: {type: Number, required: true},
        path: {type: String, required: true},
        filename: {type: String, required: true},
        userId: {type: Schema.ObjectId, ref: "dapi_user"},
        groupId: {type: Schema.ObjectId},
        birthdate: { type : Date, default: Date.now }
    });

    return mongoose.model('File', model);
}
/**
 * Created by Kiran on 3/9/2016.
 */

function dapi_model_groups(){
    //var users = getDependency(model_users);
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var group = new Schema({
        name: {type: String, required: true},
        members: [{type: Schema.ObjectId, ref: "dapi_user"}],
        admins: [{type: Schema.ObjectId, ref: "dapi_user"}],
        groupAdmin: [{type: Schema.ObjectId, ref: "dapi_user"}],
        rights: {type: Number},
        manageableBy: {type: Number}
    });

    return mongoose.model('dapi_group', group);

}

function dapi_model_users(){
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;
    var Hash = require('password-hash');

    var users = new Schema({
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true, set: function(newValue) {
            return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
        }},
        groups: [{type: Schema.ObjectId, ref: 'dapi_group'}],
        rights: {type: Number, default: 5}
    });

    users.statics.authenticate = function(username, password, callback) {
        if (username == dapi.access.conf.adminUser.login.value &&
            getDependency('sha256')(password) == dapi.access.conf.adminUser.password.value
        ) {
            callback(null, {admin : "true", id: "admin"});
        } else {
            this.findOne({ username: username }).then(user => {
                if (user && Hash.verify(password, user.password)) {
                    callback(null, user);
                } else {
                    callback(null, null);
                }
            }).catch(err => {
                callback(null, null);
            })
        }
    };

    return mongoose.model('dapi_user', users);
}
//# sourceMappingURL=index.js.map
