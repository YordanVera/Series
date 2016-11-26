"use strict";
var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');
var Rx = require('rxjs/Rx');
var extratorrent = (function () {
    function extratorrent() {
    }
    extratorrent.prototype.search = function (TVShow_name, season, episode) {
        var _this = this;
        var subject = new Rx.Subject();
        var query = this.create_query(TVShow_name, season, episode);
        var links = [];
        request(query, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html, { normalizeWhitespace: false, xmlMode: false, decodeEntities: true });
                var _self = _this;
                //tabla con resultados
                $('table .tl').filter(function (idx, element) {
                    $(this).filter(function (i, e) {
                        //se comprueba que hayan resultados, sino no hay data
                        if (e.children.length > 2) {
                            //contenido de la tabla
                            _.forEach(e.children, function (elem, index) {
                                //solo tr (filas) 
                                if (elem.name === 'tr') {
                                    var _torrent = elem.children[0].children[0].attribs;
                                    var _magnet = elem.children[0].children[1].attribs;
                                    var _name = elem.children[2].children[3].attribs;
                                    var _added = elem.children[3].children[0];
                                    var _size = elem.children[4].children[0];
                                    var _seeders = elem.children[5].children[0];
                                    var _leechers = elem.children[6].children[0];
                                    if (_.values(_name)[0] === 'c_tor') {
                                        _name = elem.children[2].children[2].attribs;
                                    }
                                    var name = '';
                                    var link = '';
                                    if (typeof _name !== 'undefined') {
                                        name = _.values(_name)[1].toString();
                                        name = name.substring(5); //cut 'view '
                                        name = name.substring(0, name.length - 8); // cut ' torrent' 
                                        link = 'http://extratorrent.cc' + _.values(_name)[0].toString();
                                    }
                                    else {
                                        _name = elem.children[2].children[2].attribs;
                                        name = _.values(_name)[1].toString();
                                        name = name.substring(5); //cut 'view ' 
                                        name = name.substring(0, name.length - 8); // cut ' torrent' 
                                        link = 'http://extratorrent.cc' + _.values(_name)[0].toString();
                                    }
                                    // console.log(name);
                                    links.push({
                                        'name': name,
                                        'torrent': 'http://extratorrent.cc' + _.values(_torrent)[0],
                                        'link': link,
                                        'magnet': _.values(_magnet)[0],
                                        'added': _.values(_added)[0],
                                        'size': _.values(_size)[0],
                                        'seeders': _.values(_seeders)[0],
                                        'leechers': _.values(_leechers)[0],
                                        'site': 'ExtraTorrent'
                                    });
                                }
                                if (index === (e.children.length - 1)) {
                                    var res_links = _self.delete_duplicate(links);
                                    subject.next(res_links);
                                }
                            });
                        }
                        else {
                            subject.next('no data');
                        }
                        return true;
                    });
                    return true;
                });
            }
            else {
                subject.error(error);
            }
        });
        return subject;
    };
    extratorrent.prototype.create_query = function (TVShow_name, season, episode) {
        var cap = '';
        if (season <= 9 && episode <= 9) {
            cap = 'S0' + season + 'E0' + episode;
        }
        else if (season <= 9 && episode > 9) {
            cap = 'S0' + season + 'E' + episode;
        }
        else if (season > 9 && episode <= 9) {
            cap = 'S' + season + 'E0' + episode;
        }
        else if (season > 9 && episode > 9) {
            cap = 'S' + season + 'E' + episode;
        }
        return 'http://extratorrent.cc/search/?search=' + TVShow_name + '+' + cap + '&s_cat=8&pp=&srt=seeds&order=desc';
    };
    extratorrent.prototype.delete_duplicate = function (links) {
        var _links = links;
        var _finale_links = [];
        _.forEach(_links, function (element, index) {
            if (_finale_links.length === 0) {
                _finale_links.push(element);
            }
            else {
                var link_splited = _.split(element.link, '/');
                var link_id = link_splited[4];
                var counter = 0;
                _.forEach(_finale_links, function (e, i) {
                    var finale_link = _.split(e.link, '/');
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
    return extratorrent;
}());
exports.extratorrent = extratorrent;

//# sourceMappingURL=extratorrent.js.map
