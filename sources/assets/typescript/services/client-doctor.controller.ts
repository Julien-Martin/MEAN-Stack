/**
 * Created by eqo on 19/12/16.
 */

class ClientService {

    private _httpService  :ng.IHttpService;

    constructor($http:ng.IHttpService) {
        this._httpService = $http;
    };

    get() {
        return this._httpService({
            method: 'GET',
            url: '/crud/clients/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: null
        })
    }

    post(data) {
        return this._httpService({
            method: 'POST',
            url: '/crud/clients/' + data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: null
        })
    }

    put(id, data) {
        return this._httpService({
            method: 'PUT',
            url: '/crud/clients/' + id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: data
        })
    }

    del(id) {
        return this._httpService({
            method: 'DELETE',
            url: '/crud/clients/' + id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: null
        })
    }

}