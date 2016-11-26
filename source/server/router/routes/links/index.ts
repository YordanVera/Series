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
                this.extratorrent.search(TVShow_name, season, episode)
                    .flatMap(
                        data => {
                            //resultado de extratorrent se almacena en _result
                            if(data !== 'no data'){
                                _.forEach(data, (e)=>{
                                    _result.push(e);
                                });
                            }
                            //llamada a búsqueda en thepiratebay
                            return this.thepiratebay.search(TVShow_name, season, episode);
                        })
                    .flatMap(
                        data => {
                            if(data !== 'no data'){
                                _.forEach(data, (e)=>{
                                    _result.push(e);
                                });
                            }
                            //se obtiene grupo realease por cada link
                            _result = this.groups_release(_result);
                            //se obtienen las resoluciones por cada link 
                            _result = this.get_resolution(_result);
                            //se genera la búsqueda de subtítulos, pasando el conjunto de links
                            return this.subdivx.search(_result, TVShow_name, season, episode);
                        })
                    .subscribe(data => {                    
                        if(_result.length>0){
                            _result = this.format_links(_result);
                            _result = _.orderBy(_result, ['group'], ['asc']);
                            //realizar matching entre enlaces y subtítulos
                            let final_result = this.match_links_subs(_result, data);
                            return res.json({success: true, result: final_result});
                        }else{
                            return res.json({success: false, error: 'no data'});
                        }

                    }, error => {
                        return res.json({success: false, error: error});
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
    protected format_links(links){
        let _links = [];
        _.forEachRight(links, (element, index)=>{
                    if(_links.length===0){
                      _links.push({
                        group:element.group,
                        data:[
                            element
                        ]
                      });

                    }else{
                      let pos = _.findIndex(_links, {'group':element.group});
                      if(pos>-1){
                        _links[pos].data.push(element);
                      }else{
                        _links.push({
                        group:element.group,
                        data:[
                          element
                        ]
                      });
                      }
                    }
                });
        return _links;
    }
    protected match_links_subs(list_links, list_subs){
        let links = list_links;
        _.forEach(links, (element, index)=>{
            element['subs']=[];
            _.forEach(element.data, (elm, idx)=>{
                if(elm.res === '1080' && typeof elm.group !== 'undefined'){
                    _.forEach(list_subs, (e,i)=>{
                        let idx_group = _.findIndex(e.groups, (group)=>{
                            return group === element.group;
                        });
                        if(e.res_1080 && idx_group>-1){
                            let idx_sub = _.findIndex(element.subs, {link:e.link});
                            if(idx_sub<0){
                                element.subs.push(e);
                            }
                        }
                    });
                }else if(elm.res === '1080' && typeof elm.group === 'undefined'){
                    _.forEach(list_subs, (e,i)=>{
                        if(e.res_1080 && e.groups.length === 0){
                            let idx_sub = _.findIndex(element.subs, {link:e.link});
                            if(idx_sub<0){
                                element.subs.push(e);
                            }
                        }
                    });
                }else if(elm.res === '720' && typeof elm.group !== 'undefined'){
                    _.forEach(list_subs, (e,i)=>{
                        let idx_group = _.findIndex(e.groups, (group)=>{
                            return group === element.group;
                        });
                        if(e.res_720 && idx_group>-1){
                            let idx_sub = _.findIndex(element.subs, {link:e.link});
                            if(idx_sub<0){
                                element.subs.push(e);
                            }
                        }
                    });
                }else if(elm.res === '720' && typeof elm.group === 'undefined'){
                    _.forEach(list_subs, (e,i)=>{
                        if(e.res_720 && e.groups.length === 0){
                            let idx_sub = _.findIndex(element.subs, {link:e.link});
                            if(idx_sub<0){
                                element.subs.push(e);
                            }
                        }
                    });
                }else if(typeof elm.res === 'undefined' && typeof elm.group !== 'undefined'){
                    _.forEach(list_subs, (e,i)=>{
                        let idx_group = _.findIndex(e.groups, (group)=>{
                            return group === element.group;
                        });
                        if(idx_group>-1){
                            let idx_sub = _.findIndex(element.subs, {link:e.link});
                            if(idx_sub<0){
                                element.subs.push(e);
                            }
                        }
                    });
                }else if(typeof elm.res === 'undefined' && typeof elm.group === 'undefined'){
                    _.forEach(list_subs, (e,i)=>{
                        if(e.groups.length===0){
                            let idx_sub = _.findIndex(element.subs, {link:e.link});
                            if(idx_sub<0){
                                element.subs.push(e);
                            }
                        }
                    });
                }
            });

        });
        return links;
    }
}