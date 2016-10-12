"use strict";
var express = require('express');
var mysql = require('mysql');
var config_db_1 = require('../config/config_db');
var pool = mysql.createPool(config_db_1.config_db);
var router = express.Router();
router.get('/', function (req, res) {
    res.sendFile('./build/client', 'index.html');
});
router.get('/list_tvshows', function (req, res) {
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
router.post('/add_tvshow', function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        //db add
        res.json({ success: true });
    }
});
router.post('/del_tvshow', function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        //db del
        res.json({ success: true });
    }
});
router.post('/update_tvshow', function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        //db update
        res.json({ success: true });
    }
});
module.exports = router;

//# sourceMappingURL=index.js.map
