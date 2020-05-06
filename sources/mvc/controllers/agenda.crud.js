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