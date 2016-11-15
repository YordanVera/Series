"use strict";
var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');
var Rx = require('rxjs/Rx');
var torrent_routes = (function () {
    function torrent_routes(app) {
        this._app = app;
        this.setRoutes();
    }
    torrent_routes.prototype.setRoutes = function () {
        this.get_torrents();
    };
    torrent_routes.prototype.get_torrents = function () {
        var _this = this;
        this._app.get('/get_torrents/:TVShow_name/:season/:episode', function (req, res) {
            if (!req.body) {
                return res.sendStatus(400);
            }
            else {
                var google = require('google');
                google.resultPerPage = 10;
                var _self_1 = _this;
                var _res_1 = res;
                var query = '';
                if (req.params.season <= 9 && req.params.episode <= 9) {
                    query = req.params.TVShow_name + ' S0' + req.params.season + ' E0' + req.params.episode + ' site:extratorrent.cc';
                }
                else if (req.params.season <= 9 && req.params.episode > 9) {
                    query = req.params.TVShow_name + ' S0' + req.params.season + ' E' + req.params.episode + ' site:extratorrent.cc';
                }
                else if (req.params.season > 9 && req.params.episode <= 9) {
                    query = req.params.TVShow_name + ' S' + req.params.season + ' E0' + req.params.episode + ' site:extratorrent.cc';
                }
                else if (req.params.season > 9 && req.params.episode > 9) {
                    query = req.params.TVShow_name + ' S' + req.params.season + ' E' + req.params.episode + ' site:extratorrent.cc';
                }
                google(query, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var result = _self_1.select_links(res.links, req.params.TVShow_name, req.params.season, req.params.episode);
                        result = _self_1.groups_release(result);
                        result = _self_1.delete_duplicate(result);
                        result = _self_1.torrent_link(result);
                        if (result.length === 0) {
                            return _res_1.json({ success: false, result: 'no data' });
                        }
                        else {
                            var sub = _self_1.get_info_torrents(result);
                            sub.subscribe(function (data) {
                                return _res_1.json({ success: true, result: data });
                            });
                        }
                    }
                });
            }
        });
    };
    // [*] primero: se asegura que los links correspondan exclusivamente al capítulo
    torrent_routes.prototype.select_links = function (links, TVShow_name, season, episode) {
        var _links = [];
        _.forEach(links, function (element) {
            var title = _.replace(element.title, '.', ' ');
            if (title.indexOf(TVShow_name) !== -1) {
                var query = '';
                if (season <= 9 && episode <= 9) {
                    query = 'S0' + season + 'E0' + episode;
                }
                else if (season <= 9 && episode > 9) {
                    query = 'S0' + season + 'E' + episode;
                }
                else if (season > 9 && episode <= 9) {
                    query = 'S' + season + 'E0' + episode;
                }
                else if (season > 9 && episode > 9) {
                    query = 'S' + season + 'E' + episode;
                }
                if (element.title.indexOf(query) !== -1) {
                    if (element.href.indexOf('search') === -1) {
                        _links.push(element);
                    }
                }
            }
        });
        return _links;
    };
    // [*] segundo: obtener grupos de los links
    torrent_routes.prototype.groups_release = function (links) {
        var _links = links;
        var _group_list = [
            'dimension',
            'avs',
            'sva',
            'hevc',
            'batv',
            'ctrlhd',
            'd-zon3',
            'ntb',
            'don',
            'form',
            'xander',
            'killers',
            'lol',
            'river',
            'fum',
            'fleet',
            'shaanig',
            'bajskorv'];
        _.forEach(_links, function (element, index) {
            _.forEach(_group_list, function (group) {
                var title = _.lowerCase(element.title);
                var grupo = group;
                if (title.indexOf(grupo) !== -1) {
                    _links[index]["group"] = grupo;
                }
            });
        });
        return _links;
    };
    torrent_routes.prototype.delete_duplicate = function (links) {
        var _links = links;
        var _finale_links = [];
        _.forEach(_links, function (element, index) {
            if (_finale_links.length === 0) {
                _finale_links.push(element);
            }
            else {
                var link_splited = _.split(element.href, '/');
                var link_id = link_splited[4];
                var counter = 0;
                _.forEach(_finale_links, function (e, i) {
                    var finale_link = _.split(e.href, '/');
                    var finale_link_id = finale_link[4];
                    if (finale_link_id === link_id) {
                        counter++;
                    }
                });
                if (counter === 0) {
                    _finale_links.push(element);
                }
            }
        });
        return _finale_links;
    };
    // [*] tercer: obtener links de los .torrent
    torrent_routes.prototype.torrent_link = function (links) {
        var _links = [];
        _.forEach(links, function (element, index) {
            var e = element;
            var link_splited = _.split(element.href, '/');
            if (link_splited[3] === 'torrent_download' || link_splited[3] === 'torrent' || link_splited[3] === 'torrent_files' || link_splited[3] === 'torrent_trackers') {
                e["torrent"] = link_splited[0] + '//' + link_splited[2] + '/download/' + link_splited[4] + '/' + link_splited[5];
            }
            _links.push(e);
        });
        return _links;
    };
    //cuarto: obtener data en relación a seeders y leechers 
    torrent_routes.prototype.get_info_torrents = function (links) {
        var _links = [];
        var subject = new Rx.Subject();
        var cont = 0;
        var tam = links.length;
        _.forEachRight(links, function (element, index) {
            var _link = _.replace(element.torrent, '/download/', '/torrent/');
            var e = element;
            var options = {
                url: _link,
                method: 'GET'
            };
            request(options, function (error, response, html) {
                if (!error) {
                    var $ = cheerio.load(html);
                    var err = $('h1.error').text();
                    if (err.length === 0) {
                        var info_torrent = {};
                        $('td.tabledata0').filter(function (i) {
                            if (i === 4) {
                                var data = $(this).text();
                                data = _.lowerCase(data);
                                data = _.replace(data, ' update', '');
                                var info = _.split(data, ' ');
                                info_torrent["seeds"] = info[1];
                                info_torrent["leechers"] = info[3];
                            }
                            return true;
                        });
                        $('td.tabledata0').filter(function (i) {
                            if (i === 5) {
                                if ($(this).text().indexOf('MB') !== -1 || $(this).text().indexOf('GB') !== -1) {
                                    info_torrent["size"] = $(this).text();
                                }
                            }
                            if (i === 6) {
                                if ($(this).text().indexOf('MB') !== -1 || $(this).text().indexOf('GB') !== -1) {
                                    info_torrent["size"] = $(this).text();
                                }
                            }
                            return true;
                        });
                        e["info_torrent"] = info_torrent;
                        _links.push(e);
                        if (cont === tam - 1) {
                            subject.next(_links);
                        }
                        cont++;
                    }
                    else {
                        if (cont === tam - 1) {
                            subject.next(_links);
                        }
                        cont++;
                    }
                }
                else {
                    console.log('error ' + error);
                }
            });
        });
        return subject;
    };
    return torrent_routes;
}());
exports.torrent_routes = torrent_routes;

//# sourceMappingURL=index.js.map
