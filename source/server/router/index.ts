"use strict";

import * as express from 'express';
import * as mysql from 'mysql';

import * as tvshowRoutes from './routes/tvshow';

import {config_db} from '../config/config_db';
import {config_tmdb} from '../config/config_tmdb';

let pool = mysql.createPool(config_db);
let router = express.Router();

router.get('/tvshows', (req, res) => {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        pool.query('SELECT id_serie, nombre FROM series', function(err, rows, fields) {
            if (err) throw err;
            return res.json(rows);
        });
    }
});

export = router;