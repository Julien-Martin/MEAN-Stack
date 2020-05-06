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