"use strict";
var tvshow_1 = require('./routes/tvshow');
var torrent_1 = require('./routes/torrent');
var subs_1 = require('./routes/subs');
var RouterETV = (function () {
    function RouterETV(app, tmdb_services) {
        new tvshow_1.tvshow_routes(app, tmdb_services);
        new torrent_1.torrent_routes(app);
        new subs_1.subs_routes(app);
    }
    return RouterETV;
}());
exports.RouterETV = RouterETV;

//# sourceMappingURL=index.js.map
