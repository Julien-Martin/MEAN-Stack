/**
 * Created by eqo on 6/28/16.
 */
var RemoteData = (function () {
    function RemoteData(postUrl, getUrl, deleteUrl, updateUrl, localDataForm, httpService) {
        this.deleteUrl = deleteUrl;
        this.getUrl = getUrl;
        this.updateUrl = updateUrl;
        this.postUrl = postUrl;
        this.localData = localDataForm;
        this._httpService = httpService;
        this.fetchedData = [];
    }
    RemoteData.formatData = function (data) {
        var myString = "";
        for (var dataBit in data) {
            if (myString.length) {
                myString += "&";
            }
            myString += dataBit.toString() + "=" + JSON.stringify(data[dataBit]);
        }
        return myString;
    };
    RemoteData.prototype.httpPromise = function (settings) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this._httpService(settings).then(res, rej);
        });
    };
    RemoteData.prototype.getAllData = function () {
        var _this = this;
        return this.httpPromise({
            method: 'GET',
            url: this.getUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: ''
        }).then(function (response) {
            _this.lastResponse = response;
            _this.fetchedData = response.data;
            return _this.fetchedData;
        });
    };
    RemoteData.prototype.getSingleData = function (id) {
        var _this = this;
        return this.httpPromise({
            method: 'GET',
            url: this.getUrl + "/" + id,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: ""
        }).then(function (response) {
            _this.lastResponse = response;
            _this.fetchedSingleData = response.data;
            return _this.fetchedSingleData;
        });
    };
    RemoteData.prototype.postToRemote = function () {
        var _this = this;
        return this.httpPromise({
            method: 'POST',
            url: this.postUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: RemoteData.formatData(this.localData)
        }).then(function (response) {
            _this.lastResponse = response;
            return _this.getAllData();
        });
    };
    RemoteData.prototype.updateRemote = function (id) {
        var _this = this;
        return this.httpPromise({
            method: 'PUT',
            url: this.updateUrl + "/" + id.toString(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: RemoteData.formatData(this.localData)
        }).then(function (response) {
            _this.lastResponse = response;
            return _this.getAllData();
        });
    };
    RemoteData.prototype.deleteRemote = function (id) {
        var _this = this;
        return this.httpPromise({
            method: 'DELETE',
            url: this.deleteUrl + "/" + id.toString(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: ""
        }).then(function (response) {
            _this.lastResponse = response;
            return _this.getAllData();
        });
    };
    RemoteData.prototype.clearLocal = function () {
        for (var field in this.localData) {
            this.localData[field] = "";
        }
    };
    return RemoteData;
}());

//# sourceMappingURL=remoteData.js.map
