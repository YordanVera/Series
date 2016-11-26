"use strict";
var _ = require('lodash');
var extratorrent_1 = require('./extratorrent');
var thepiratebay_1 = require('./thepiratebay');
var subdivx_1 = require('./subdivx');
var groups_1 = require('./groups');
var links_routes = (function () {
    function links_routes(app) {
        this._app = app;
        this.extratorrent = new extratorrent_1.extratorrent();
        this.thepiratebay = new thepiratebay_1.thepiratebay();
        this.subdivx = new subdivx_1.subdivx();
        this.setRoutes();
    }
    links_routes.prototype.setRoutes = function () {
        this.get_links();
    };
    links_routes.prototype.get_links = function () {
        var _this = this;
        this._app.get('/get_links/:TVShow_name/:season/:episode', function (req, res) {
            if (!req.params) {
                res.sendStatus(400);
            }
            else {
                var TVShow_name_1 = req.params.TVShow_name;
                var season_1 = req.params.season;
                var episode_1 = req.params.episode;
                var _result = [];
                //search in extratorrent
                _this.extratorrent.search(TVShow_name_1, season_1, episode_1)
                    .flatMap(function (data) {
                    //resultado de extratorrent se almacena en _result
                    if (data !== 'no data') {
                        _.forEach(data, function (e) {
                            _result.push(e);
                        });
                    }
                    //llamada a búsqueda en thepiratebay
                    return _this.thepiratebay.search(TVShow_name_1, season_1, episode_1);
                })
                    .flatMap(function (data) {
                    if (data !== 'no data') {
                        _.forEach(data, function (e) {
                            _result.push(e);
                        });
                    }
                    //se obtiene grupo realease por cada link
                    _result = _this.groups_release(_result);
                    //se obtienen las resoluciones por cada link 
                    _result = _this.get_resolution(_result);
                    //se genera la búsqueda de subtítulos, pasando el conjunto de links
                    return _this.subdivx.search(_result, TVShow_name_1, season_1, episode_1);
                })
                    .subscribe(function (data) {
                    if (_result.length > 0) {
                        _result = _this.format_links(_result);
                        _result = _.orderBy(_result, ['group'], ['asc']);
                        //realizar matching entre enlaces y subtítulos
                        var final_result = _this.match_links_subs(_result, data);
                        return res.json({ success: true, result: final_result });
                    }
                    else {
                        return res.json({ success: false, error: 'no data' });
                    }
                }, function (error) {
                    return res.json({ success: false, error: error });
                });
            }
        });
    };
    links_routes.prototype.groups_release = function (links) {
        var _links = links;
        _.forEach(_links, function (element, index) {
            _.forEach(groups_1._group_list, function (group) {
                var name = _.lowerCase(element.name);
                var grupo = group;
                if (name.indexOf(grupo) !== -1) {
                    _links[index]["group"] = grupo;
                }
            });
        });
        return _links;
    };
    links_routes.prototype.get_resolution = function (links) {
        var _links = [];
        _.forEach(links, function (element, index) {
            if (element.name.indexOf('1080') !== -1) {
                var e = element;
                e['res'] = '1080';
                _links.push(e);
            }
            else {
                if (element.name.indexOf('720') !== -1) {
                    var e = element;
                    e['res'] = '720';
                    _links.push(e);
                }
                else {
                    _links.push(element);
                }
            }
        });
        return _links;
    };
    links_routes.prototype.format_links = function (links) {
        var _links = [];
        _.forEachRight(links, function (element, index) {
            if (_links.length === 0) {
                _links.push({
                    group: element.group,
                    data: [
                        element
                    ]
                });
            }
            else {
                var pos = _.findIndex(_links, { 'group': element.group });
                if (pos > -1) {
                    _links[pos].data.push(element);
                }
                else {
                    _links.push({
                        group: element.group,
                        data: [
                            element
                        ]
                    });
                }
            }
        });
        return _links;
    };
    links_routes.prototype.match_links_subs = function (list_links, list_subs) {
        var links = list_links;
        _.forEach(links, function (element, index) {
            element['subs'] = [];
            _.forEach(element.data, function (elm, idx) {
                if (elm.res === '1080' && typeof elm.group !== 'undefined') {
                    _.forEach(list_subs, function (e, i) {
                        var idx_group = _.findIndex(e.groups, function (group) {
                            return group === element.group;
                        });
                        if (e.res_1080 && idx_group > -1) {
                            var idx_sub = _.findIndex(element.subs, { link: e.link });
                            if (idx_sub < 0) {
                                element.subs.push(e);
                            }
                        }
                    });
                }
                else if (elm.res === '1080' && typeof elm.group === 'undefined') {
                    _.forEach(list_subs, function (e, i) {
                        if (e.res_1080 && e.groups.length === 0) {
                            var idx_sub = _.findIndex(element.subs, { link: e.link });
                            if (idx_sub < 0) {
                                element.subs.push(e);
                            }
                        }
                    });
                }
                else if (elm.res === '720' && typeof elm.group !== 'undefined') {
                    _.forEach(list_subs, function (e, i) {
                        var idx_group = _.findIndex(e.groups, function (group) {
                            return group === element.group;
                        });
                        if (e.res_720 && idx_group > -1) {
                            var idx_sub = _.findIndex(element.subs, { link: e.link });
                            if (idx_sub < 0) {
                                element.subs.push(e);
                            }
                        }
                    });
                }
                else if (elm.res === '720' && typeof elm.group === 'undefined') {
                    _.forEach(list_subs, function (e, i) {
                        if (e.res_720 && e.groups.length === 0) {
                            var idx_sub = _.findIndex(element.subs, { link: e.link });
                            if (idx_sub < 0) {
                                element.subs.push(e);
                            }
                        }
                    });
                }
                else if (typeof elm.res === 'undefined' && typeof elm.group !== 'undefined') {
                    _.forEach(list_subs, function (e, i) {
                        var idx_group = _.findIndex(e.groups, function (group) {
                            return group === element.group;
                        });
                        if (idx_group > -1) {
                            var idx_sub = _.findIndex(element.subs, { link: e.link });
                            if (idx_sub < 0) {
                                element.subs.push(e);
                            }
                        }
                    });
                }
                else if (typeof elm.res === 'undefined' && typeof elm.group === 'undefined') {
                    _.forEach(list_subs, function (e, i) {
                        if (e.groups.length === 0) {
                            var idx_sub = _.findIndex(element.subs, { link: e.link });
                            if (idx_sub < 0) {
                                element.subs.push(e);
                            }
                        }
                    });
                }
            });
        });
        return links;
    };
    return links_routes;
}());
exports.links_routes = links_routes;

//# sourceMappingURL=index.js.map
