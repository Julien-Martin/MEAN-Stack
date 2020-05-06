var stack_catch = function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.send(err);
};