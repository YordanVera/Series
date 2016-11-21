import * as express         from "express";
import * as mysql           from 'mysql';
import * as _               from 'lodash';
import { config_db }        from '../../../config/config_db';

export class status_routes {
    private _app            : express.Express;
    private _pool           : any;

    constructor(app){
        this._app           = app;
        this._pool          = mysql.createPool(config_db);
        this.setRoutes();
    }
    public setRoutes(){
        this.get_status();
        this.put_status();
        this.add_status();
    }
    private get_status(){
        this._app.get('/get_status/:id_tvshow/:season', (req, res)=>{
            if(!req.params){
                return res.sendStatus(400);
            }else{
                this._pool.query('SELECT id_status, id_tvshow, downloaded, viewed, season, episode FROM status WHERE id_tvshow=? AND season=?',[req.params.id_tvshow, req.params.season], (error, rows)=>{
                    if(error){
                        return res.json({success: false, error: error});
                    }else{
                        return res.json({success: true, result: rows});
                    }
                });
            }
        });
    }
    private add_status(){
        this._app.post('/add_status', (req, res) => {
            if(!req.body)
                return res.sendStatus(400);
            else
                this._pool.query('INSERT INTO status (id_tvshow, downloaded, viewed, season, episode) VALUES (?,?,?,?,?)', [req.body.id_tvshow, req.body.downloaded, req.body.viewed, req.body.season, req.body.episode], (error, result) => {
                    if(error) {
                        return res.json({success: false, error: error});
                    }else{
                        return res.json({
                            success: true,
                            id_status: result.insertId
                        });
                    }
                });
        });
    }

    private put_status(){
        this._app.put('/put_status',(req, res) => {
            if(!req.body){
                return res.sendStatus(400);
            }else{
                this._pool.query('UPDATE status SET downloaded=?, viewed=? WHERE id_status = ?', [req.body.downloaded, req.body.viewed, req.body.id_status], (error) => {
                    if (error)
                        return res.json({success: false, error: error});
                    else
                        return res.json({success:true});
                });
            }
        });
    }
}
