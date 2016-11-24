import * as express         from "express";
import * as _               from 'lodash';
import * as request         from 'request';
import * as cheerio         from 'cheerio';
import * as Rx              from 'rxjs/Rx';
import { extratorrent }     from './extratorrent';
import { thepiratebay }     from './thepiratebay'; 

export class links_routes {
    private _app            : express.Express;
    private extratorrent    : extratorrent;
    private thepiratebay    : thepiratebay;

    constructor(app){
        this._app           = app;
        this.extratorrent   = new extratorrent();
        this.thepiratebay   = new thepiratebay();
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
                var _result = [];
                //search in extratorrent
                this.extratorrent
                    .search(TVShow_name, season, episode)
                    .flatMap(data => {
                        //resultado de extratorrent se almacena en _result
                        _.forEach(data, (e)=>{
                            _result.push(e);
                        });
                        //llamada a búsqueda en thepiratebay
                        return this.thepiratebay.search(TVShow_name, season, episode);
                    })
                    .subscribe(data => {
                        //resultado de thepiratebay se añade a los de extratorrent
                        _.forEach(data, (e)=>{
                            _result.push(e);
                        });
                        console.log(_result);
                        return res.json({success: true});
                });
            }
        });
    }
}