"use strict";
/// <reference path="../../typings/index.d.ts"/>
var tmdn_session_1 = require('./tmdn_session');
var config_tmdb_1 = require('../config/config_tmdb');
var request = require('request');
var Rx = require("rxjs/Rx");
var tmdb_connection = (function () {
    function tmdb_connection() {
        this.status = 'disconnected';
        this.subject = new Rx.Subject();
        this.public_subject = new Rx.Subject();
        if (this.status === 'disconnected')
            this.connect_tmdb();
    }
    tmdb_connection.prototype.getSession = function () {
        if (this.status === 'connected')
            return { success: true, data: this.session, subject: null };
        else
            return { success: false, data: null, subject: this.public_subject };
    };
    tmdb_connection.prototype.getStatus = function () {
        return this.status;
    };
    tmdb_connection.prototype.connect_tmdb = function () {
        var _this = this;
        this.session = new tmdn_session_1.tmdb_session;
        this.status = 'connecting';
        this.subject.subscribe(function (x) {
            if (typeof _this.session.token !== 'undefined' && _this.session.token_validated !== true) {
                _this.Validate_Token();
            }
            if (_this.session.token_validated === true && typeof _this.session.session_id === 'undefined') {
                _this.Create_session();
            }
        }, function (e) {
            //error handle
            console.log(e);
        }, function () {
            _this.status = 'connected';
            _this.public_subject.next(_this.session);
        });
        this.Create_Request_Token();
    };
    tmdb_connection.prototype.Create_Request_Token = function () {
        var _this = this;
        request(this.Create_query('https://api.themoviedb.org/3/authentication/token/new', { api_key: config_tmdb_1.config_tmdb.key }), function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            _this.session.token = body.request_token;
            _this.session.token_validated = false;
            _this.subject.next(_this.session.token);
        });
    };
    tmdb_connection.prototype.Validate_Token = function () {
        var _this = this;
        request(this.Create_query('https://api.themoviedb.org/3/authentication/token/validate_with_login', { request_token: this.session.token,
            password: config_tmdb_1.config_tmdb.password,
            username: config_tmdb_1.config_tmdb.username,
            api_key: config_tmdb_1.config_tmdb.key }), function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            _this.session.token_validated = true;
            _this.subject.next();
        });
    };
    tmdb_connection.prototype.Create_session = function () {
        var _this = this;
        request(this.Create_query('https://api.themoviedb.org/3/authentication/session/new', { request_token: this.session.token,
            api_key: config_tmdb_1.config_tmdb.key }), function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            _this.session.session_id = body.session_id;
            _this.subject.complete();
            _this.subject.unsubscribe();
        });
    };
    tmdb_connection.prototype.Create_query = function (url, qs, method, headers, body, json) {
        return {
            method: (typeof method === 'undefined') ? 'GET' : method,
            url: (typeof url === 'undefined') ? '' : url,
            qs: (typeof qs === 'undefined') ? '' : qs,
            headers: (typeof headers === 'undefined') ? { 'content-type': 'application/json' } : headers,
            body: (typeof body === 'undefined') ? {} : body,
            json: (typeof json === 'undefined') ? true : false
        };
    };
    return tmdb_connection;
}());
exports.tmdb_connection = tmdb_connection;

//# sourceMappingURL=tmdb_connection.js.map
