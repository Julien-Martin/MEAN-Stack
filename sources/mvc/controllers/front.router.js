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