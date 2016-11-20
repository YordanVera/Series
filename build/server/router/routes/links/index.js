"use strict";
var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');
var Rx = require('rxjs/Rx');
var google = require('google');
var links_routes = (function () {
    function links_routes(app) {
        this._app = app;
        this.setRoutes();
    }
    links_routes.prototype.setRoutes = function () {
        this.get_links();
    };
    links_routes.prototype.get_links = function () {
        var _this = this;
        this._app.get('/get_links/:TVShow_name/:season/:episode', function (req, res) {
            if (!req.body) {
                return res.sendStatus(400);
            }
            else {
                var TVShow_name_1 = req.params.TVShow_name;
                var season_1 = req.params.season;
                var episode_1 = req.params.episode;
                var _self_1 = _this;
                var _res_1 = res;
                var query = '';
                var nextCounter = 0;
                if (season_1 <= 9 && episode_1 <= 9) {
                    query = TVShow_name_1 + ' S0' + season_1 + 'E0' + episode_1 + ' site:extratorrent.cc';
                }
                else if (season_1 <= 9 && episode_1 > 9) {
                    query = TVShow_name_1 + ' S0' + season_1 + 'E' + episode_1 + ' site:extratorrent.cc';
                }
                else if (season_1 > 9 && episode_1 <= 9) {
                    query = TVShow_name_1 + ' S' + season_1 + 'E0' + episode_1 + ' site:extratorrent.cc';
                }
                else if (season_1 > 9 && episode_1 > 9) {
                    query = TVShow_name_1 + ' S' + season_1 + 'E' + episode_1 + ' site:extratorrent.cc';
                }
                var links_result = [];
                var result = [];
                setTimeout(function () {
                    google(query, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            _.forEach(res.links, function (e, i) {
                                links_result.push(e);
                            });
                            if (nextCounter < 2) {
                                nextCounter += 1;
                                if (res.next) {
                                    setTimeout(function () { return res.next(); }, 1000);
                                }
                            }
                            else {
                                result = _self_1.select_links(links_result, TVShow_name_1, season_1, episode_1);
                                result = _self_1.groups_release(result);
                                result = _self_1.get_resolution(result);
                                result = _self_1.delete_duplicate(result);
                                result = _self_1.torrent_link(result);
                                if (result.length === 0) {
                                    return _res_1.json({ success: false, result: 'no data' });
                                }
                                else {
                                    _self_1.get_info_torrents(result).subscribe(function (data) {
                                        var _result = _self_1.format_links(data);
                                        _result = _.orderBy(_result, ['group'], ['asc']);
                                        _self_1.get_queries_for_subs(_result, TVShow_name_1, season_1, episode_1).subscribe(function (result) {
                                            _self_1.get_subs_links(result).subscribe(function (_data) {
                                                _.forEach(_result, function (element, index) {
                                                    element['subs'] = [];
                                                    _.forEach(element.data, function (e, i) {
                                                        _.forIn(_data, function (elm, idx) {
                                                            if (elm.group === e.group && elm.res === e.res) {
                                                                element.subs = elm.links;
                                                            }
                                                        });
                                                    });
                                                });
                                                return _res_1.json({ success: true, result: _result });
                                            });
                                        });
                                    });
                                }
                            }
                        }
                    });
                }, 1000);
            }
        });
    };
    links_routes.prototype.select_links = function (links, TVShow_name, season, episode) {
        var _links = [];
        var _error_title = [
            'S0' + season + 'E' + episode,
            'S0' + season + 'E0' + episode,
            'S0' + season + '.E' + episode,
            'S0' + season + '.E0' + episode,
            'S0' + season + ' E' + episode,
            'S0' + season + ' E0' + episode,
            'S' + season + 'E' + episode,
            'S' + season + 'E0' + episode,
            'S' + season + '.E' + episode,
            'S' + season + '.E0' + episode,
            'S' + season + ' E' + episode,
            'S' + season + ' E0' + episode
        ];
        var _title = _.replace(TVShow_name, ' ', '.');
        var _error = true;
        _.forEach(links, function (element) {
            if (element.title.indexOf(TVShow_name) !== -1 || element.title.indexOf(_title) !== -1) {
                _.forEach(_error_title, function (e, i) {
                    if (element.title.indexOf(e) !== -1) {
                        _error = false;
                    }
                });
                if (!_error) {
                    if (element.title.indexOf('Page') === -1 && element.title.indexOf('Search') === -1) {
                        _links.push(element);
                    }
                }
                else {
                    _error = true;
                }
            }
        });
        return _links;
    };
    links_routes.prototype.groups_release = function (links) {
        var _links = links;
        var _group_list = [
            'avs',
            'bajskorv',
            'batv',
            'ctrlhd',
            'd-zon3',
            'dimension',
            'fleet',
            'fum',
            'form',
            'hevc',
            'immerse',
            'killers',
            'lol',
            'ntb',
            'river',
            'shaanig',
            'sva',
            'xander'];
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
    links_routes.prototype.get_resolution = function (links) {
        var _links = [];
        _.forEach(links, function (element, index) {
            if (element.href.indexOf('1080') !== -1) {
                var e = element;
                e['res'] = '1080';
                _links.push(e);
            }
            else {
                if (element.href.indexOf('720') !== -1) {
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
    links_routes.prototype.delete_duplicate = function (links) {
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
    links_routes.prototype.torrent_link = function (links) {
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
    links_routes.prototype.get_info_torrents = function (links) {
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
                    console.log('*******');
                    console.log(element);
                    console.log('error get_info_torrents: ' + error);
                }
            });
        });
        return subject;
    };
    links_routes.prototype.format_links = function (links) {
        var _links = [];
        _.forEachRight(links, function (element, index) {
            if (_links.length === 0) {
                _links.push({
                    group: element.group,
                    data: [
                        {
                            title: element.title,
                            description: element.description,
                            href: element.href,
                            group: element.group,
                            info_torrent: element.info_torrent,
                            link: element.link,
                            res: element.res,
                            torrent: element.torrent
                        }
                    ]
                });
            }
            else {
                var pos = _.findIndex(_links, { 'group': element.group });
                if (pos > -1) {
                    _links[pos].data.push({
                        title: element.title,
                        description: element.description,
                        href: element.href,
                        group: element.group,
                        info_torrent: element.info_torrent,
                        link: element.link,
                        res: element.res,
                        torrent: element.torrent
                    });
                }
                else {
                    _links.push({
                        group: element.group,
                        data: [
                            {
                                title: element.title,
                                description: element.description,
                                href: element.href,
                                group: element.group,
                                info_torrent: element.info_torrent,
                                link: element.link,
                                res: element.res,
                                torrent: element.torrent
                            }
                        ]
                    });
                }
            }
        });
        return _links;
    };
    links_routes.prototype.get_queries_for_subs = function (links, TVShow_name, season, episode) {
        var subject = new Rx.Subject();
        var list_query = this.create_query(links, TVShow_name, season, episode);
        var _self = this;
        var cont = 0;
        _.forEach(list_query, function (element, index) {
            setTimeout(function () {
                google(element.query, function (err, res) {
                    element['links'] = [];
                    if (!err) {
                        var _subs_links = _self.clean_subs_list(res.links, TVShow_name, season, episode);
                        element.links = _subs_links;
                        if (cont === list_query.length - 1) {
                            subject.next(list_query);
                        }
                        cont++;
                    }
                    else {
                        if (cont === list_query.length - 1) {
                            subject.next(list_query);
                        }
                        cont++;
                    }
                });
            }, 1000);
        });
        return subject;
    };
    links_routes.prototype.get_subs_links = function (list_query) {
        var subject = new Rx.Subject();
        var _links = list_query;
        var _total_links_count = 0;
        var _counter = 0;
        _.forEach(_links, function (element, index) {
            _total_links_count += element.links.length;
        });
        _.forEach(_links, function (element, index) {
            if (element.links.length > 0) {
                _.forEach(element.links, function (e, i) {
                    request(e.href, function (error, response, html) {
                        if (!error) {
                            var $ = cheerio.load(html, {
                                normalizeWhitespace: false,
                                xmlMode: false,
                                decodeEntities: true
                            });
                            var sub = {};
                            $('#detalle_datos').filter(function () {
                                e["sub_desc"] = $(this).find('font').text();
                                e["sub_link"] = $(this).find('a.link1').attr('href');
                                // e['sub'] = [];
                                // e.sub.push(sub);
                                return true;
                            });
                            if (_counter === _total_links_count - 1) {
                                subject.next(_links);
                            }
                            _counter++;
                        }
                        else {
                            if (_counter === _total_links_count - 1) {
                                subject.next(_links);
                            }
                            _counter++;
                        }
                    });
                });
            }
        });
        return subject;
    };
    links_routes.prototype.clean_subs_list = function (links, TVShow_name, season, episode) {
        var _links = [];
        var _error_href = [
            'index.php',
            'X5X-subtitulos',
            'X46X-sub',
            '?pg'];
        var _error_title = [
            'Página',
            'pagina',
            'página'];
        _.forEachRight(links, function (element, index) {
            //check _error_href
            if (element.href.length > 23) {
                var _isErrorHref_1 = false;
                _.forEach(_error_href, function (e, i) {
                    if (element.href.indexOf(e) !== -1) {
                        _isErrorHref_1 = true;
                    }
                });
                //check _error_title
                var _isErrorTitle_1 = false;
                _.forEach(_error_title, function (e, i) {
                    if (element.title.indexOf(e) !== -1) {
                        _isErrorTitle_1 = true;
                    }
                });
                //if double check true -> push
                if (!_isErrorHref_1 && !_isErrorTitle_1) {
                    _links.push(element);
                }
            }
        });
        _links = _.uniqBy(_links, 'href');
        return _links;
    };
    links_routes.prototype.create_query = function (links, TVShow_name, season, episode) {
        var query = '';
        var list_query = [];
        if (season <= 9 && episode <= 9) {
            query = TVShow_name + ' S0' + season + 'E0' + episode;
        }
        else if (season <= 9 && episode > 9) {
            query = TVShow_name + ' S0' + season + 'E' + episode;
        }
        else if (season > 9 && episode <= 9) {
            query = TVShow_name + ' S' + season + 'E0' + episode;
        }
        else if (season > 9 && episode > 9) {
            query = TVShow_name + ' S' + season + 'E' + episode;
        }
        _.forEachRight(links, function (element, index) {
            if (typeof element.group !== 'undefined') {
                _.forEachRight(element.data, function (e, i) {
                    if (typeof e.res !== 'undefined') {
                        var _query = query + ' ' + e.res + ' ' + element.group + ' site:subdivx.com';
                        var index_1 = _.findIndex(list_query, { 'query': _query });
                        if (index_1 === -1) {
                            list_query.push({
                                query: _query,
                                res: e.res,
                                group: element.group
                            });
                        }
                    }
                    else {
                        var _query = query + ' ' + element.group + ' site:subdivx.com';
                        var index_2 = _.findIndex(list_query, { 'query': _query });
                        if (index_2 === -1) {
                            list_query.push({
                                query: _query,
                                group: element.group
                            });
                        }
                    }
                });
            }
            else {
                _.forEachRight(element.data, function (e, i) {
                    if (typeof e.res !== 'undefined') {
                        var _query = query + ' ' + e.res + ' site:subdivx.com';
                        var index_3 = _.findIndex(list_query, { 'query': _query });
                        if (index_3 === -1) {
                            list_query.push({
                                query: _query,
                                res: e.res
                            });
                        }
                    }
                    else {
                        var _query = query + ' site:subdivx.com';
                        var index_4 = _.findIndex(list_query, { 'query': _query });
                        if (index_4 === -1) {
                            list_query.push({
                                query: _query
                            });
                        }
                    }
                });
            }
        });
        return list_query;
    };
    return links_routes;
}());
exports.links_routes = links_routes;

//# sourceMappingURL=index.js.map
