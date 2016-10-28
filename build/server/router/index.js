"use strict";
var tvshow_1 = require('./routes/tvshow');
var RouterETV = (function () {
    function RouterETV(app, tmdb_services) {
        new tvshow_1.tvshow_routes(app, tmdb_services);
    }
    return RouterETV;
}());
exports.RouterETV = RouterETV;

//# sourceMappingURL=index.js.map
