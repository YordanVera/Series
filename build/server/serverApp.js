"use strict";
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var Router = require("./router");
var tmdb_services_1 = require('./tmdb/tmdb_services');
var ServerApp = (function () {
    function ServerApp() {
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.use(express.static(path.join(__dirname, '..', 'client')));
        this.Routes();
        this.tmdb_service = new tmdb_services_1.tmdb_services;
    }
    ServerApp.prototype.subTMDB = function () {
        // var subject = this.tmdbService.getSubject();
        // var subscription = subject.subscribe(
        //     x => console.log('onNext: ' + x),
        //     e => console.log('onError: ' + e.message),
        //     () => console.log('onCompleted'));
        //     this.tmdbService.getToken();
    };
    ServerApp.prototype.setRoutes = function () {
        //this._app.get('/*', this._indexRender);
    };
    ServerApp.prototype.Routes = function () {
        this._app.use(Router);
    };
    ServerApp.prototype.startServer = function () {
        this._app.listen(5000, function () {
            console.log('running on port 5000...');
        });
    };
    ServerApp.prototype._indexRender = function (req, res) {
        res.sendFile(path.resolve('.') + '/build/client', 'index.html');
    };
    return ServerApp;
}());
exports.ServerApp = ServerApp;

//# sourceMappingURL=serverApp.js.map
