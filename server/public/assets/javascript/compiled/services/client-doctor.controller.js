/**
 * Created by eqo on 19/12/16.
 */
var ClientService = (function () {
    function ClientService($http) {
        this._httpService = $http;
    }
    ;
    ClientService.prototype.get = function () {
        return this._httpService({
            method: 'GET',
            url: '/crud/clients/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    ClientService.prototype.post = function (data) {
        return this._httpService({
            method: 'POST',
            url: '/crud/clients/' + data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    ClientService.prototype.put = function (id, data) {
        return this._httpService({
            method: 'PUT',
            url: '/crud/clients/' + id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        });
    };
    ClientService.prototype.del = function (id) {
        return this._httpService({
            method: 'DELETE',
            url: '/crud/clients/' + id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    return ClientService;
}());

//# sourceMappingURL=client-doctor.controller.js.map
