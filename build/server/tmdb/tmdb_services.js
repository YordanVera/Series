"use strict";
var tmdb_connection_1 = require('./tmdb_connection');
var config_tmdb_1 = require('../config/config_tmdb');
var request = require('request');
var Rx = require("rxjs/Rx");
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
                console.log('connection done !');
                session.subject.unsubscribe();
            });
        }
    };
    //api tmdb
    tmdb_services.prototype.getTVShowData = function (title) {
        var subject = new Rx.Subject();
        request(this.tmdb_connection.Create_query('https://api.themoviedb.org/3/search/tv', { query: title,
            language: 'en-US',
            api_key: config_tmdb_1.config_tmdb.key }), function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            subject.next(body);
            subject.complete();
            subject.unsubscribe();
        });
        return subject;
    };
    tmdb_services.prototype.getTVShowFullData = function (id) {
        var subject = new Rx.Subject();
        request(this.tmdb_connection.Create_query('https://api.themoviedb.org/3/tv/' + id, { language: 'en-US',
            api_key: config_tmdb_1.config_tmdb.key }), function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            subject.next(body);
            subject.complete();
            subject.unsubscribe();
        });
        return subject;
    };
    tmdb_services.prototype.getSeasonDetail = function (id, season_number) {
        var subject = new Rx.Subject();
        request(this.tmdb_connection.Create_query('https://api.themoviedb.org/3/tv/' + id + '/season/' + season_number, { language: 'en-US',
            api_key: config_tmdb_1.config_tmdb.key }), function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            subject.next(body);
            subject.complete();
            subject.unsubscribe();
        });
        return subject;
    };
    return tmdb_services;
}());
exports.tmdb_services = tmdb_services;

//# sourceMappingURL=tmdb_services.js.map
