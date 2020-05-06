/**
 * Created by eqo on 19/12/16.
 */
var AgendaService = (function () {
    function AgendaService($http) {
        this._httpService = $http;
    }
    ;
    AgendaService.prototype.get = function () {
        return this._httpService({
            method: 'GET',
            url: '/crud/agenda/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    AgendaService.prototype.post = function (data) {
        return this._httpService({
            method: 'POST',
            url: '/crud/agenda/' + data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    AgendaService.prototype.put = function (id, data) {
        return this._httpService({
            method: 'PUT',
            url: '/crud/agenda/' + id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        });
    };
    AgendaService.prototype.del = function (id) {
        return this._httpService({
            method: 'DELETE',
            url: '/crud/agenda/' + id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: null
        });
    };
    return AgendaService;
}());

//# sourceMappingURL=agenda.controller.js.map
