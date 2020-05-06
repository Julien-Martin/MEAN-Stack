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