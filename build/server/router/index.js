"use strict";
var tvshow_1 = require('./routes/tvshow');
var links_1 = require('./routes/links');
var status_1 = require('./routes/status');
var RouterETV = (function () {
    function RouterETV(app, tmdb_services) {
        new tvshow_1.tvshow_routes(app, tmdb_services);
        new links_1.links_routes(app);
        new status_1.status_routes(app);
    }
    return RouterETV;
}());
exports.RouterETV = RouterETV;

//# sourceMappingURL=index.js.map
