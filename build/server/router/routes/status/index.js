"use strict";
var mysql = require('mysql');
var config_db_1 = require('../../../config/config_db');
var status_routes = (function () {
    function status_routes(app) {
        this._app = app;
        this._pool = mysql.createPool(config_db_1.config_db);
        this.setRoutes();
    }
    status_routes.prototype.setRoutes = function () {
        this.get_status();
        this.put_status();
        this.add_status();
    };
    status_routes.prototype.get_status = function () {
        var _this = this;
        this._app.get('/get_status/:id_tvshow/:season', function (req, res) {
            if (!req.params) {
                return res.sendStatus(400);
            }
            else {
                _this._pool.query('SELECT id_status, id_tvshow, downloaded, viewed, season, episode FROM status WHERE id_tvshow=? AND season=?', [req.params.id_tvshow, req.params.season], function (error, rows) {
                    if (error) {
                        return res.json({ success: false, error: error });
                    }
                    else {
                        return res.json({ success: true, result: rows });
                    }
                });
            }
        });
    };
    status_routes.prototype.add_status = function () {
        var _this = this;
        this._app.post('/add_status', function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
            else
                _this._pool.query('INSERT INTO status (id_tvshow, downloaded, viewed, season, episode) VALUES (?,?,?,?,?)', [req.body.id_tvshow, req.body.downloaded, req.body.viewed, req.body.season, req.body.episode], function (error, result) {
                    if (error) {
                        return res.json({ success: false, error: error });
                    }
                    else {
                        return res.json({
                            success: true,
                            id_status: result.insertId
                        });
                    }
                });
        });
    };
    status_routes.prototype.put_status = function () {
        var _this = this;
        this._app.put('/put_status', function (req, res) {
            if (!req.body) {
                return res.sendStatus(400);
            }
            else {
                _this._pool.query('UPDATE status SET downloaded=?, viewed=? WHERE id_status = ?', [req.body.downloaded, req.body.viewed, req.body.id_status], function (error) {
                    if (error)
                        return res.json({ success: false, error: error });
                    else
                        return res.json({ success: true });
                });
            }
        });
    };
    return status_routes;
}());
exports.status_routes = status_routes;

//# sourceMappingURL=index.js.map
