///<reference path="../javascript/angularjs/Typings/angular.d.ts"/>
///<reference path="../remoteData.ts"/>
var app = angular.module('myApp', []);
var angDocumentation = (function () {
    function angDocumentation($http, $scope) {
        var _this = this;
        this._httpService = $http;
        this.$inject = ["$http", "$scope"];
        //injections
        this._httpService = $http;
        this._scope = $scope;
        this.console = console;
        this.confirm = confirm;
        this.tool = "Edit";
        this.elem = document.getElementById("output");
        this.docContainer = document.getElementById("docContainer");
        //libraries
        //noinspection TypeScriptUnresolvedFunction
        this.mark = new Remarkable({
            html: true,
            linkify: true,
            typographer: true
        });
        this.fabDisplayed = false;
        //data related
        this.view = "Home";
        this._scope.$watch("$.remoteDocs.localData.content", function () {
            _this.elem.innerHTML = _this.mark.render(_this.remoteDocs.localData.content);
        });
        this.remoteDocs = new RemoteData("/dashboard/docs", "/dashboard/docs", "/dashboard/docs", "/dashboard/docs", {
            title: "",
            content: "Text here",
            tags: [],
            author: "Documentation",
        }, this._httpService);
        this.remoteUser = new RemoteData("/me", "/me", "/me", "/me", {
            title: "",
            content: "Text here",
            tags: []
        }, this._httpService);
        this.remoteDocs.getAllData()
            .then(function (data) {
            _this._scope.$apply();
        });
        this.admin = false;
        this.remoteUser.getAllData()
            .then(function (data) {
            if (data.admin) {
                _this.admin = true;
            }
        });
        this.remoteDocs.clearLocal();
    }
    angDocumentation.prototype.output = function (element) {
        this.docContainer.innerHTML = this.mark.render(element.content);
        this.fabDisplayed = true;
        this.currentElement = element;
    };
    angDocumentation.prototype.save = function () {
        var _this = this;
        this.remoteDocs.localData.author = "Documentation";
        this.remoteDocs.postToRemote().then(function (data) {
            _this.remoteDocs.clearLocal();
            _this.view = "Home";
            _this.tool = "Create";
            _this._scope.$apply();
        });
    };
    angDocumentation.prototype.delete = function () {
        var _this = this;
        this.remoteDocs.deleteRemote(this.currentElement._id)
            .then(function (data) {
            _this._scope.$apply();
        });
        this.docContainer.innerHTML = "";
    };
    angDocumentation.prototype.update = function () {
        var _this = this;
        if (confirm('Are you sure you want to update this document?')) {
            var content = this.currentElement.content;
            this.remoteDocs.updateRemote(this.currentElement._id)
                .then(function (data) {
                console.log(_this.currentElement);
                _this.remoteDocs.clearLocal();
                _this.view = "Home";
                _this.tool = "Create";
                _this.docContainer.innerHTML = _this.mark.render(content);
                _this._scope.$apply();
            });
        }
        else {
        }
    };
    angDocumentation.prototype.edit = function () {
        console.log("asdasdasdasdads");
        this.view = "Edit";
        this.remoteDocs.localData = this.currentElement;
        this.tool = "Edit";
    };
    return angDocumentation;
}());
app.controller('angDocumentationController', angDocumentation);

//# sourceMappingURL=documentation.js.map
