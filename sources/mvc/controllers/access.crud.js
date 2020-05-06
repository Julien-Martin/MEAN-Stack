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