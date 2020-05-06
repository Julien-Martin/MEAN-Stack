var stack_404 = function (request, response, next) {
    var err = new Error('Not Found');
    err.status = 404;
    response.statusCode = 404;
    response.send("404");
};