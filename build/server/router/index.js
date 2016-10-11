"use strict";
var express = require('express');
var router = express.Router();
// mount express paths, any addition middleware can be added as well.
// ex. router.use('/pathway', middleware_function, sub-router);
//router.use('/tvshows', tvshowRoutes);
router.get('/tvshows', function (req, res) {
    //console.log('route tvshow');
    //res.json({success : true});
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        return res.json({ 'success': true });
    }
});
module.exports = router;

//# sourceMappingURL=index.js.map
