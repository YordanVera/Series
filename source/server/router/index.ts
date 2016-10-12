"use strict";
import * as express from 'express';
import * as mysql from 'mysql';
import * as tvshowRoutes from './routes/tvshow';
import {config_db} from '../config/config_db';
import {config_tmdb} from '../config/config_tmdb';

let pool = mysql.createPool(config_db);
let router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('./build/client', 'index.html');
});

router.get('/list_tvshows', (req, res) => {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        pool.query('SELECT id_serie, nombre FROM series', (error, rows, fields) => {
            if (error) return res.json({success: false, error: error});
            return res.json({
                success: true,
                result: rows});
        });
    }
});

router.post('/add_tvshow', (req, res) => {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        //db add
        pool.query('INSERT INTO series (nombre) VALUES (?)', [req.body.nombre], (error, result) => {
            if (error) return res.json({success: false, error: error});
            return res.json({
                success: true,
                id_serie: result.insertId
            });
        });
    }
});

router.delete('/del_tvshow/:id_serie',(req, res) => {
    if(!req.params){
        return res.sendStatus(400);
    }else{
        //db del
        pool.query('DELETE FROM series WHERE id_serie = ?', [req.params.id_serie], (error) => {
            if (error) return res.json({success: false, error: error});
            return res.json({success: true});
        });
    }
});

router.put('/update_tvshow',(req, res) => {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        //db update
        pool.query('UPDATE series SET nombre = ? WHERE id_serie = ?', [req.body.nombre, req.body.id_serie], (error) => {
            if (error) return res.json({success: false, error: error});
            return res.json({success:true});
        });
    }
});
export = router;