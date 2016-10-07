/// <reference path="../typings/index.d.ts" />
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var ServerApp = (function () {
    function ServerApp() {
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.use(express.static(path.resolve('.') + '/build/client'));
    }
    ServerApp.prototype.setRoutes = function () {
        this._app.get('/*', this._indexRender);
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
})();
exports.ServerApp = ServerApp;
//# sourceMappingURL=serverApp.js.map