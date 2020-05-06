///<reference path="../javascript/angularjs/Typings/angular.d.ts"/>
///<reference path="../remoteData.ts"/>
var app = angular.module('myApp', []);
var angAdministration = (function () {
    function angAdministration($http, $scope) {
        this._httpService = $http;
        this.$inject = ["$http", "$scope"];
        //injections
        this._httpService = $http;
        this._scope = $scope;
        this.console = console;
        //data related
        this.view = "Home";
    }
    return angAdministration;
}());
app.controller('angAdministrationController', angAdministration);

//# sourceMappingURL=admin.js.map
