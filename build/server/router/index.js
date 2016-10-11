"use strict";
var express = require('express');
var mysql = require('mysql');
var config_db_1 = require('../config/config_db');
var pool = mysql.createPool(config_db_1.config_db);
var router = express.Router();
router.get('/tvshows', function (req, res) {
    //console.log('route tvshow');
    //res.json({success : true});
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        pool.query('SELECT id_serie, nombre FROM series', function (err, rows, fields) {
            if (err)
                throw err;
            return res.json(rows);
        });
    }
});
module.exports = router;

//# sourceMappingURL=index.js.map
