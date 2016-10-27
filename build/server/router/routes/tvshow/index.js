"use strict";
var mysql = require('mysql');
var config_db_1 = require('../../../config/config_db');
var tvshow_routes = (function () {
    function tvshow_routes(app, tmdb_services) {
        this._app = app;
        this._tmdb_services = tmdb_services;
        this._pool = mysql.createPool(config_db_1.config_db);
        this.setRoutes();
    }
    tvshow_routes.prototype.setRoutes = function () {
        this.list_tvshows();
        this.add_tvshow();
        this.del_tvshow();
        this.update_tvshow();
        this.get_tvshow_data();
    };
    tvshow_routes.prototype.list_tvshows = function () {
        var _this = this;
        this._app.get('/list_tvshows', function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
            else
                _this._pool.query('SELECT id_serie, title FROM series', function (error, rows, fields) {
                    if (error)
                        return res.json({ success: false, error: error });
                    else
                        //get data api
                        var data = [];
                    rows.forEach(function (tvshow, index, rows) {
                        var subject = _this._tmdb_services.getTVShowData(tvshow.title);
                        subject.subscribe(function (x) {
                            if (x.total_results === 1) {
                                data.push({
                                    id_serie: rows[index].id_serie,
                                    title: rows[index].title,
                                    data: x.results[0]
                                });
                            }
                            else {
                                x.results.forEach(function (element) {
                                    if (rows[index].title === element.name) {
                                        data.push({
                                            id_serie: rows[index].id_serie,
                                            title: rows[index].title,
                                            data: element
                                        });
                                    }
                                });
                            }
                        }, function (e) {
                            data.push({
                                id_serie: rows[index].id_serie,
                                title: rows[index].title,
                                data: e
                            });
                        }, function () {
                            if (index === rows.length - 1) {
                                return res.json({ success: true, result: data });
                            }
                        });
                    });
                });
        });
    };
    tvshow_routes.prototype.add_tvshow = function () {
        var _this = this;
        this._app.post('/add_tvshow', function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
            else
                _this._pool.query('INSERT INTO series (title) VALUES (?)', [req.body.nombre], function (error, result) {
                    if (error)
                        return res.json({ success: false, error: error });
                    return res.json({
                        success: true,
                        id_serie: result.insertId
                    });
                });
        });
    };
    tvshow_routes.prototype.del_tvshow = function () {
        var _this = this;
        this._app.delete('/del_tvshow/:id_serie', function (req, res) {
            if (!req.params)
                return res.sendStatus(400);
            else
                _this._pool.query('DELETE FROM series WHERE id_serie = ?', [req.params.id_serie], function (error) {
                    if (error)
                        return res.json({ success: false, error: error });
                    return res.json({ success: true });
                });
        });
    };
    tvshow_routes.prototype.update_tvshow = function () {
        var _this = this;
        this._app.put('/update_tvshow', function (req, res) {
            if (!req.body) {
                return res.sendStatus(400);
            }
            else {
                _this._pool.query('UPDATE series SET title = ? WHERE id_serie = ?', [req.body.nombre, req.body.id_serie], function (error) {
                    if (error)
                        return res.json({ success: false, error: error });
                    else
                        return res.json({ success: true });
                });
            }
        });
    };
    tvshow_routes.prototype.get_tvshow_data = function () {
        var _this = this;
        this._app.get('/get_tvshow_data/:title', function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
            else
                var subject = _this._tmdb_services.getTVShowData(req.params.title);
            subject.subscribe(function (x) {
                if (x.total_results === 1)
                    return res.json({ success: true, result: x.results[0] });
                else
                    return res.json({ success: false, result: x.results });
            }, function (e) {
                return res.json({ success: false, err: e });
            });
        });
    };
    return tvshow_routes;
}());
exports.tvshow_routes = tvshow_routes;

//# sourceMappingURL=index.js.map
