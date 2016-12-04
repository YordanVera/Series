"use strict";
var _ = require('lodash');
var Rx = require('rxjs/Rx');
var PirateBay = require('thepiratebay');
var thepiratebay = (function () {
    function thepiratebay() {
    }
    thepiratebay.prototype.search = function (TVShow_name, season, episode) {
        var _this = this;
        var subject = new Rx.Subject();
        var query = this.create_query(TVShow_name, season, episode);
        PirateBay.search(query, { category: 208 })
            .then(function (results) {
            _.forEach(results, function (e) {
                e['site'] = 'The Pirate Bay';
            });
            results = _this.delete_duplicate(results);
            if (results.length > 0) {
                subject.next(results);
            }
            else {
                subject.next('no data');
            }
        })
            .catch(function (err) { return console.log(err); });
        return subject;
    };
    thepiratebay.prototype.create_query = function (TVShow_name, season, episode) {
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
        return TVShow_name + ' ' + cap;
    };
    thepiratebay.prototype.delete_duplicate = function (links) {
        var _links = [];
        _.forEach(links, function (element, index) {
            if (_links.length < 1) {
                _links.push(element);
            }
            else {
                var idx_element = _.findIndex(_links, { id: element.id });
                if (idx_element === -1) {
                    _links.push(element);
                }
            }
        });
        return _links;
    };
    return thepiratebay;
}());
exports.thepiratebay = thepiratebay;
;

//# sourceMappingURL=thepiratebay.js.map
