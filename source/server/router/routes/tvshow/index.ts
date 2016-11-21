import * as express         from "express";
import * as mysql           from 'mysql';
import * as _               from 'lodash';
import { tmdb_services }    from '../../../tmdb/tmdb_services';
import { config_db }        from '../../../config/config_db';

export class tvshow_routes {
    private _app            : express.Express;
    private _tmdb_services  : tmdb_services;
    private _pool           : any;

    constructor(app, tmdb_services){
        this._app           = app;
        this._tmdb_services = tmdb_services;
        this._pool          = mysql.createPool(config_db);
        this.setRoutes();
    }
    public setRoutes(){
        this.list_tvshows();
        this.add_tvshow();
        this.del_tvshow();
        this.update_tvshow();
        this.get_tvshow_data();
        this.get_tvshow_full_data();
        this.get_season_detail();
    }
    private list_tvshows(){
        this._app.get('/list_tvshows',(req, res)=>{
            if(!req.body)
                return res.sendStatus(400);
            else
                this._pool.query('SELECT id_tvshow, name FROM tvshow', (error, rows, fields) => {
                    if (error)
                        return res.json({success: false, error: error});
                    else
                        //get data api
                        var data =[];
                        rows.forEach((tvshow, index, rows) => {
                            let subject = this._tmdb_services.getTVShowData(tvshow.name);
                            subject.subscribe(
                                (x:any) => {
                                    if(x.total_results === 1){
                                        data.push({
                                            id_tvshow    : rows[index].id_tvshow,
                                            name       : rows[index].name,
                                            data        : x.results[0]});
                                    }
                                    else{
                                        let tvshow = _.find(x.results, (o:any)=>{
                                            return (
                                                o.name === rows[index].name &&
                                                o.poster_path.length > 1 &&
                                                o.overview.length > 1
                                            );
                                        });
                                        data.push({
                                                    id_tvshow    : rows[index].id_tvshow,
                                                    name       : rows[index].name,
                                                    data        : tvshow});
                                    }
                                },
                                e   => {
                                    data.push({
                                        id_tvshow    : rows[index].id_tvshow,
                                        name       : rows[index].name,
                                        data        : e});
                                },
                                ()  => {
                                    if(data.length===rows.length){
                                        return res.json({success:true, result:data});
                                    }
                                });
                        });
                });
        });
    }
    private add_tvshow(){
        this._app.post('/add_tvshow', (req, res) => {
            if(!req.body)
                return res.sendStatus(400);
            else
                this._pool.query('INSERT INTO tvshow (name) VALUES (?)', [req.body.TVShow_name], (error, result) => {
                    if (error) return res.json({success: false, error: error});
                    return res.json({
                        success: true,
                        id_tvshow: result.insertId
                    });
                });
        });
    }
    private del_tvshow(){
        this._app.delete('/del_tvshow/:id_tvshow',(req, res) => {
            if(!req.params)
                return res.sendStatus(400);
            else
                this._pool.query('DELETE FROM tvshow WHERE id_tvshow = ?', [req.params.id_tvshow], (error) => {
                    if (error) return res.json({success: false, error: error});
                    return res.json({success: true});
                });
        });
    }
    private update_tvshow(){
        this._app.put('/update_tvshow',(req, res) => {
            if(!req.body){
                return res.sendStatus(400);
            }else{
                this._pool.query('UPDATE tvshow SET name = ? WHERE id_tvshow = ?', [req.body.nombre, req.body.id_tvshow], (error) => {
                    if (error)
                        return res.json({success: false, error: error});
                    else
                        return res.json({success:true});
                });
            }
        });
    }
    private get_tvshow_data(){
        this._app.get('/get_tvshow_data/:name', (req, res)=>{
            if(!req.body)
                return res.sendStatus(400)
            else
                var subject : any = this._tmdb_services.getTVShowData(req.params.name);
                subject.subscribe(
                    x   => {
                        if(x.total_results === 1){
                            return res.json({success:true, result:x.results[0]});
                        }
                        else{
                            let tvshow = _.find(x.results, (o:any)=>{
                                            return (
                                                o.name === req.params.name &&
                                                o.poster_path.length > 1 &&
                                                o.overview.length > 1
                                            );
                                        });
                             return res.json({success:true, result:tvshow});
                        }
                    },
                    e   => {
                        return res.json({success:false, err:e});
                    }
                );
        });
    }
    private get_tvshow_full_data(){
        this._app.get('/get_tvshow_full_data/:id',(req, res)=>{
            if(!req.body){
                return res.sendStatus(400);
            }else{
                this._tmdb_services.getTVShowFullData(req.params.id).subscribe(
                    data => {
                        return res.json({success:true, result:data});
                    }
                );
            }
        });
    }
    private get_season_detail(){
        this._app.get('/get_season_detail/:id/:season_number',(req, res)=>{
            if(!req.body){
                return res.sendStatus(400);
            }else{
                this._tmdb_services.getSeasonDetail(req.params.id, req.params.season_number).subscribe(
                    data => {
                        return res.json({success:true, result:data});
                    }
                );
            }
        });
    }
}
