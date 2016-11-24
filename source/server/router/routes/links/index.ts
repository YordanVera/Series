import * as express         from "express";
import * as _               from 'lodash';
import * as request         from 'request';
import * as cheerio         from 'cheerio';
import * as Rx              from 'rxjs/Rx';
import { extratorrent }     from './extratorrent';

export class links_routes {
    private _app            : express.Express;
    private extratorrent    : extratorrent;

    constructor(app){
        this._app           = app;
        this.extratorrent   = new extratorrent();
        this.setRoutes();
    }
    public setRoutes(){
        this.get_links();
    }
    private get_links(){
        this._app.get('/get_links/:TVShow_name/:season/:episode', (req, res)=>{
            if(!req.params){
                res.sendStatus(400);
            }else{
                let TVShow_name = req.params.TVShow_name;
                let season = req.params.season;
                let episode = req.params.episode;
                //search in extratorrent
                this.extratorrent
                    .search(TVShow_name, season, episode)
                    .subscribe(data => {
                        console.log(data);
                        return res.json({success: true});
                    });
            }
        });
    }
}