"use strict";
var mysql = require('mysql');
var _ = require('lodash');
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
        this.get_tvshow_full_data();
        this.get_season_detail();
    };
    tvshow_routes.prototype.list_tvshows = function () {
        var _this = this;
        this._app.get('/list_tvshows', function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
            else
                _this._pool.query('SELECT id_tvshow, name FROM tvshow', function (error, rows, fields) {
                    if (error)
                        return res.json({ success: false, error: error });
                    else
                        //get data api
                        var data = [];
                    rows.forEach(function (tvshow, index, rows) {
                        var subject = _this._tmdb_services.getTVShowData(tvshow.name);
                        subject.subscribe(function (x) {
                            if (x.total_results === 1) {
                                data.push({
                                    id_tvshow: rows[index].id_tvshow,
                                    name: rows[index].name,
                                    data: x.results[0] });
                            }
                            else {
                                var tvshow_1 = _.find(x.results, function (o) {
                                    return (o.name === rows[index].name &&
                                        o.poster_path.length > 1 &&
                                        o.overview.length > 1);
                                });
                                data.push({
                                    id_tvshow: rows[index].id_tvshow,
                                    name: rows[index].name,
                                    data: tvshow_1 });
                            }
                        }, function (e) {
                            data.push({
                                id_tvshow: rows[index].id_tvshow,
                                name: rows[index].name,
                                data: e });
                        }, function () {
                            if (data.length === rows.length) {
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
                _this._pool.query('INSERT INTO tvshow (name) VALUES (?)', [req.body.TVShow_name], function (error, result) {
                    if (error)
                        return res.json({ success: false, error: error });
                    return res.json({
                        success: true,
                        id_tvshow: result.insertId
                    });
                });
        });
    };
    tvshow_routes.prototype.del_tvshow = function () {
        var _this = this;
        this._app.delete('/del_tvshow/:id_tvshow', function (req, res) {
            if (!req.params)
                return res.sendStatus(400);
            else
                _this._pool.query('DELETE FROM tvshow WHERE id_tvshow = ?', [req.params.id_tvshow], function (error) {
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
                _this._pool.query('UPDATE tvshow SET name = ? WHERE id_tvshow = ?', [req.body.nombre, req.body.id_tvshow], function (error) {
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
        this._app.get('/get_tvshow_data/:name', function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
            else
                var subject = _this._tmdb_services.getTVShowData(req.params.name);
            subject.subscribe(function (x) {
                if (x.total_results === 1) {
                    return res.json({ success: true, result: x.results[0] });
                }
                else {
                    var tvshow = _.find(x.results, function (o) {
                        return (o.name === req.params.name &&
                            o.poster_path.length > 1 &&
                            o.overview.length > 1);
                    });
                    return res.json({ success: true, result: tvshow });
                }
            }, function (e) {
                return res.json({ success: false, err: e });
            });
        });
    };
    tvshow_routes.prototype.get_tvshow_full_data = function () {
        var _this = this;
        this._app.get('/get_tvshow_full_data/:id', function (req, res) {
            if (!req.body) {
                return res.sendStatus(400);
            }
            else {
                _this._tmdb_services.getTVShowFullData(req.params.id).subscribe(function (data) {
                    return res.json({ success: true, result: data });
                });
            }
        });
    };
    tvshow_routes.prototype.get_season_detail = function () {
        var _this = this;
        this._app.get('/get_season_detail/:id/:season_number', function (req, res) {
            if (!req.body) {
                return res.sendStatus(400);
            }
            else {
                _this._tmdb_services.getSeasonDetail(req.params.id, req.params.season_number).subscribe(function (data) {
                    return res.json({ success: true, result: data });
                });
            }
        });
    };
    return tvshow_routes;
}());
exports.tvshow_routes = tvshow_routes;

//# sourceMappingURL=index.js.map
