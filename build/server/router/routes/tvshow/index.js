"use strict";
var express = require("express");
var route = express.Router();
route.get('/tvshows', function (req, res) {
    console.log('tesasddas adst');
    res.json({ success: true });
});
module.exports = route;

//# sourceMappingURL=index.js.map
