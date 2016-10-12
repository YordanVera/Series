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
        pool.query('SELECT id_serie, nombre FROM series', function (error, rows, fields) {
            if (error)
                return res.json({ success: false, error: error });
            return res.json({
                success: true,
                result: rows });
        });
    }
});
router.post('/add_tvshow', function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        //db add
        pool.query('INSERT INTO series (nombre) VALUES (?)', [req.body.nombre], function (error, result) {
            if (error)
                return res.json({ success: false, error: error });
            return res.json({
                success: true,
                id_serie: result.insertId
            });
        });
    }
});
router.delete('/del_tvshow/:id_serie', function (req, res) {
    if (!req.params) {
        return res.sendStatus(400);
    }
    else {
        //db del
        pool.query('DELETE FROM series WHERE id_serie = ?', [req.params.id_serie], function (error) {
            if (error)
                return res.json({ success: false, error: error });
            return res.json({ success: true });
        });
    }
});
router.put('/update_tvshow', function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        //db update
        pool.query('UPDATE series SET nombre = ? WHERE id_serie = ?', [req.body.nombre, req.body.id_serie], function (error) {
            if (error)
                return res.json({ success: false, error: error });
            return res.json({ success: true });
        });
    }
});
module.exports = router;

//# sourceMappingURL=index.js.map
