/**
 * Created by eqo on 19/12/16.
 */
var ManagerService = (function () {
    function ManagerService($http) {
        this._httpService = $http;
    }
    ;
    ManagerService.prototype.get = function () {
        return this._httpService({
            method: 'GET',
            url: '/crud/managers/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    ManagerService.prototype.post = function (data) {
        return this._httpService({
            method: 'POST',
            url: '/crud/managers/' + data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    ManagerService.prototype.put = function (id, data) {
        return this._httpService({
            method: 'PUT',
            url: '/crud/managers/' + id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        });
    };
    ManagerService.prototype.del = function (id) {
        return this._httpService({
            method: 'DELETE',
            url: '/crud/managers/' + id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    return ManagerService;
}());

//# sourceMappingURL=manager.controller.js.map
