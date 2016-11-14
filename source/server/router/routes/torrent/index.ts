import * as express         from "express";
import * as _               from 'lodash';
import * as request         from 'request';
import * as cheerio         from 'cheerio';
import * as Rx              from 'rxjs/Rx';

export class torrent_routes {
    private _app            : express.Express;

    constructor(app){
        this._app           = app;
        this.setRoutes();
    }
    public setRoutes(){
        this.get_torrents();
    }
    private get_torrents(){
        this._app.get('/get_torrents/:TVShow_name/:season/:episode',(req, res)=>{
            if(!req.body){
                return res.sendStatus(400);
            }else{
                var google = require('google');
                google.resultPerPage=10;
                let _self = this;
                let _res = res;
                var query = '';
                if(req.params.episode>9){
                    query = req.params.TVShow_name+'.S0'+req.params.season+'E'+req.params.episode+' 720p site:extratorrent.cc';
                }else{
                    query = req.params.TVShow_name+'.S0'+req.params.season+'E0'+req.params.episode+' 720p site:extratorrent.cc';
                }
                google(query, function(err, res){
                    if(err){
                        console.log(err);
                    }else{
                        let result = _self.select_links(res.links,req.params.TVShow_name,req.params.season,req.params.episode);
                        result = _self.groups_release(result);
                        result = _self.delete_duplicate(result);
                        result = _self.torrent_link(result);
                        var sub = _self.get_info_torrents(result)
                        sub.subscribe(
                            data => {
                                return _res.json({success:true, result:data});
                            }
                        );
                    }
                });
                
            }
        });
    }
    // [*] primero: se asegura que los links correspondan exclusivamente al capítulo
    protected select_links(links:any, TVShow_name: string, season:number, episode:number){
        let _links = [];
        let TVShow_name_split = _.split(TVShow_name, ' ');
        let name = '';
        let i = 0;
        while(i<(TVShow_name_split.length-1)){
            name+=TVShow_name_split[i];
            i++;
        }
        _.forEach(links, (element)=>{
            if(element.title.indexOf(name) !== -1){
                var query = '';
                if(episode>9){
                    query = 'S0'+season+'E'+episode;
                }else{
                    query = 'S0'+season+'E0'+episode;
                }
                if(element.title.indexOf(query) !== -1){
                    if(element.href.indexOf('search') === -1){
                        _links.push(element);
                    }
                }
            }
        });
        return _links;
    }
    // [*] segundo: obtener grupos de los links
    protected groups_release(links){
        let _links = links;
        let _group_list = [
            'dimension',
            'avs',
            'sva',
            'hevc',
            'batv',
            'ctrlhd',
            'd-zon3',
            'ntb',
            'don',
            'form',
            'xander',
            'killers',
            'lol',
            'river',
            'fum',
            'fleet',
            'shaanig',
            'bajskorv'];
        _.forEach(_links, (element, index)=>{
            _.forEach(_group_list, (group)=>{
                let title : string = _.lowerCase(element.title);
                let grupo : string = group;
                if(title.indexOf(grupo) !== -1){
                    _links[index]["group"] = grupo;
                }
            });
        });
        return _links;
    }
    protected delete_duplicate(links){
        let _links = links;
        let _finale_links = [];
        _.forEach(_links, (element, index)=>{
            if(_finale_links.length===0){
                _finale_links.push(element);
            }else{
                var link_splited = _.split(element.href, '/'); 
                var link_id = link_splited[4];
                var counter = 0;
                _.forEach(_finale_links, (e, i)=>{
                    var finale_link = _.split(e.href, '/'); 
                    var finale_link_id = finale_link[4];
                    if(finale_link_id === link_id){
                        counter++;
                    }
                });
                if(counter===0){
                    _finale_links.push(element);
                }
            }
        });
        return _finale_links;
    }
    // [*] tercer: obtener links de los .torrent
    protected torrent_link(links){
        let _links = [];        
        _.forEach(links, (element, index)=>{
            let e = element;
            var link_splited = _.split(element.href, '/'); 
            if(link_splited[3] === 'torrent_download' || link_splited[3] === 'torrent' || link_splited[3] === 'torrent_files'){
                e["torrent"] = link_splited[0]+'//'+link_splited[2]+'/download/'+link_splited[4]+'/'+link_splited[5];
            }
            _links.push(e);
        });
        return _links;
    } 
    //cuarto: obtener data en relación a seeders y leechers 
    protected get_info_torrents(links){
        let _links = [];
        let subject = new Rx.Subject();
        var cont = 0;
        var tam = links.length;
  
        _.forEachRight(links, (element, index)=>{
            let _link = _.replace(element.torrent, '/download/','/torrent/');
            var e = element;
            request(_link, (error, response, html)=>{
                if(!error){
                    var $ = cheerio.load(html);
                    var err = $('h1.error').text();
                    if(err.length===0){
                        var info_torrent = {};
                        $('td.tabledata0').filter(function(i){
                            if(i===4){ //línea 4 de la página
                                var data = $(this).text();
                                data = _.lowerCase(data);
                                data = _.replace(data, ' update', '');
                                var info = _.split(data, ' ');
                                info_torrent["seeds"] = info[1];
                                info_torrent["leechers"] = info[3];
                            }
                            return true;
                        });
                        $('td.tabledata0').filter(function(i){
                            if(i===5){ //línea 5 de la página
                                if($(this).text().indexOf('MB') !== -1 || $(this).text().indexOf('GB') !== -1){
                                    info_torrent["size"] = $(this).text();
                                }
                            }
                            if(i===6){
                                if($(this).text().indexOf('MB') !== -1 || $(this).text().indexOf('GB') !== -1){
                                    info_torrent["size"] = $(this).text();
                                }
                            }
                            return true;
                        });
                        e["info_torrent"] = info_torrent;
                        _links.push(e);
                        if(cont === tam-1){
                            subject.next(_links);
                        }
                        cont++;
                    }else{
                        if(cont === tam-1){
                            subject.next(_links);
                        }
                        cont++;
                    }
                }
            });
        });
        return subject;
    }
}