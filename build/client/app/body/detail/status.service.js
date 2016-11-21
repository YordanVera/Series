"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var StatusService = (function () {
    function StatusService(http) {
        this.http = http;
    }
    StatusService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    StatusService.prototype.get_status = function (id_tvshow, season) {
        return this.http.get('/get_status/' + id_tvshow + '/' + season)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    StatusService.prototype.update_status = function (status) {
        return this.http.put('/put_status', status)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    StatusService.prototype.add_status = function (status) {
        return this.http.post('/add_status', status)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    StatusService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], StatusService);
    return StatusService;
}());
exports.StatusService = StatusService;

//# sourceMappingURL=status.service.js.map
