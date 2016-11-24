import * as express         from "express";
import * as _               from 'lodash';
import * as request         from 'request';
import * as cheerio         from 'cheerio';
import * as Rx              from 'rxjs/Rx';
import { extratorrent }     from './extratorrent';
import { thepiratebay }     from './thepiratebay'; 
import { subdivx }          from './subdivx';
import { _group_list }      from './groups';

export class links_routes {
    private _app            : express.Express;
    private extratorrent    : extratorrent;
    private thepiratebay    : thepiratebay;
    private subdivx         : subdivx;

    constructor(app){
        this._app           = app;
        this.extratorrent   = new extratorrent();
        this.thepiratebay   = new thepiratebay();
        this.subdivx        = new subdivx();
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
                    .flatMap(data => {
                        //se obtiene grupo realease por cada link
                        _result = this.groups_release(_result);
                        //se obtienen las resoluciones por cada link
                        _result = this.get_resolution(_result);
                        //se ordena
                        _result = _.orderBy(_result, ['group'], ['asc']);
                        //se genera la búsqueda de subtítulos, pasando el conjunto de links
                        return this.subdivx.search(_result, TVShow_name, season, episode);
                    })
                    .subscribe(data => {
                        //resultado de subdivx
                        console.log(data);
                        return res.json({success: true});
                });
            }
        });
    }
    protected groups_release(links){
        let _links = links;
        _.forEach(_links, (element, index)=>{
            _.forEach(_group_list, (group)=>{
                let name : string = _.lowerCase(element.name);
                let grupo : string = group;
                if(name.indexOf(grupo) !== -1){
                    _links[index]["group"] = grupo;
                }
            });
        });
        return _links;
    }
    protected get_resolution(links){
        let _links = [];
        _.forEach(links, (element, index)=>{
            if(element.name.indexOf('1080')!==-1){
                let e = element;
                e['res'] = '1080';
                _links.push(e);
            }else{
                if(element.name.indexOf('720')!==-1){
                    let e = element;
                    e['res'] = '720';
                    _links.push(e);
                }else{
                    _links.push(element);
                }
            }
        });
        return _links;
    }
}