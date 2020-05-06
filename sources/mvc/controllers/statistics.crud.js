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