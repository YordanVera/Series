"use strict";
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var tmdb_services_1 = require('./tmdb/tmdb_services');
var router_1 = require('./router');
var ServerApp = (function () {
    function ServerApp() {
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.use(express.static(path.join(__dirname, '..', 'client')));
        this.tmdb_service = new tmdb_services_1.tmdb_services;
        this.Router = new router_1.RouterETV(this._app, this.tmdb_service);
    }
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
