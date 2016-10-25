"use strict";
var tmdb_connection_1 = require('./tmdb_connection');
var tmdb_services = (function () {
    function tmdb_services() {
        this.tmdb_connection = new tmdb_connection_1.tmdb_connection;
        this.getSessionData();
    }
    tmdb_services.prototype.getSessionData = function () {
        var _this = this;
        var session = this.tmdb_connection.getSession();
        if (session.success) {
            console.log('done !');
            this.connection_established = true;
            this._session = session.data;
        }
        else {
            session.subject.subscribe(function (x) {
                _this._session = x;
                _this.connection_established = true;
                session.subject.unsubscribe();
            });
        }
    };
    //api
    tmdb_services.prototype.getTvshow = function () {
        //if connection_established
        //  call function
        //else 
        //  do connection
    };
    return tmdb_services;
}());
exports.tmdb_services = tmdb_services;

//# sourceMappingURL=tmdb_services.js.map
