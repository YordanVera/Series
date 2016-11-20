import * as express         from "express";
import * as _               from 'lodash';
import * as request         from 'request';
import * as cheerio         from 'cheerio';
import * as Rx              from 'rxjs/Rx';
var google = require('google');
export class links_routes {
    private _app            : express.Express;

    constructor(app){
        this._app           = app;
        this.setRoutes();
    }
    public setRoutes(){
        this.get_links();
    }
    private get_links(){
        this._app.get('/get_links/:TVShow_name/:season/:episode',(req, res)=>{
            if(!req.body){
                return res.sendStatus(400);
            }else{
                let TVShow_name = req.params.TVShow_name;
                let season = req.params.season;
                let episode = req.params.episode;
                
                let _self = this;
                let _res = res;
                var query = '';
                var nextCounter = 0
                if(season<=9 && episode<=9){
                    query = TVShow_name+' S0'+season+'E0'+episode+' site:extratorrent.cc';
                }else if(season<=9 && episode>9){
                    query = TVShow_name+' S0'+season+'E'+episode+' site:extratorrent.cc';
                }
                else if(season>9 && episode<=9){
                    query = TVShow_name+' S'+season+'E0'+episode+' site:extratorrent.cc';
                }
                else if(season>9 && episode>9){
                    query = TVShow_name+' S'+season+'E'+episode+' site:extratorrent.cc';
                }
                var links_result = [];
                var result = [];
                setTimeout(()=>{
                    google(query, function(err, res){
                        if(err){
                            console.log(err);
                        }else{
                            _.forEach(res.links, (e, i)=>{
                                links_result.push(e);
                            });
                            if (nextCounter < 2) {
                                nextCounter += 1
                                if (res.next) {
                                    setTimeout(()=>res.next(),1000);
                                }
                            }
                            else{
                                result = _self.select_links(links_result,TVShow_name,season,episode);
                                result = _self.groups_release(result);
                                result = _self.get_resolution(result);
                                result = _self.delete_duplicate(result);
                                result = _self.torrent_link(result);
                                if(result.length===0){
                                    return _res.json({success:false, result:'no data'});
                                }
                                else{
                                    _self.get_info_torrents(result).subscribe(
                                        data => {
                                            let _result = _self.format_links(data);
                                            _result = _.orderBy(_result, ['group'], ['asc']);
                                            _self.get_queries_for_subs(_result,TVShow_name,season,episode).subscribe(
                                                result => {
                                                    _self.get_subs_links(result).subscribe(
                                                        _data => {
                                                            _.forEach(_result, (element, index)=>{
                                                                element['subs']=[];
                                                                _.forEach(element.data, (e, i)=>{
                                                                    _.forIn(_data,(elm, idx)=>{
                                                                        if(elm.group===e.group && elm.res === e.res){
                                                                            element.subs = elm.links;
                                                                        }
                                                                    });
                                                                });
                                                            });
                                                            return _res.json({success:true, result:_result});
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            }
                        }
                    });
                },1000);
            }
        });
    }
    protected select_links(links:any, TVShow_name: string, season:number, episode:number){
        let _links = [];
        let _error_title =[
            'S0'+season+'E'+episode,
            'S0'+season+'E0'+episode,
            'S0'+season+'.E'+episode,
            'S0'+season+'.E0'+episode,
            'S0'+season+' E'+episode,
            'S0'+season+' E0'+episode,
            'S'+season+'E'+episode,
            'S'+season+'E0'+episode,
            'S'+season+'.E'+episode,
            'S'+season+'.E0'+episode,
            'S'+season+' E'+episode,
            'S'+season+' E0'+episode
        ];
        let _title = _.replace(TVShow_name, ' ','.');
        let _error = true;
        _.forEach(links, (element)=>{
            if(element.title.indexOf(TVShow_name) !== -1 || element.title.indexOf(_title) !== -1){
                _.forEach(_error_title, (e, i)=>{
                    if(element.title.indexOf(e) !== -1){
                        _error=false;
                    }
                });
                if(!_error){
                    if(element.title.indexOf('Page') === -1 && element.title.indexOf('Search') === -1){
                        _links.push(element);
                    }
                }else{
                     _error=true;
                }
            }
        });
        return _links;
    }
    protected groups_release(links){
        let _links = links;
        let _group_list = [
            'avs',
            'bajskorv',
            'batv',
            'ctrlhd',
            'd-zon3',
            'dimension',
            'fleet',
            'fum',
            'form',
            'hevc',
            'immerse',
            'killers',
            'lol',
            'ntb',
            'river',
            'shaanig',
            'sva',
            'xander'];
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
    protected get_resolution(links){
        let _links = [];
        _.forEach(links, (element, index)=>{
            if(element.href.indexOf('1080')!==-1){
                let e = element;
                e['res'] = '1080';
                _links.push(e);
            }else{
                if(element.href.indexOf('720')!==-1){
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
    protected torrent_link(links){
        let _links = [];        
        _.forEach(links, (element, index)=>{
            let e = element;
            var link_splited = _.split(element.href, '/'); 
            if(link_splited[3] === 'torrent_download' || link_splited[3] === 'torrent' || link_splited[3] === 'torrent_files' || link_splited[3] === 'torrent_trackers'){
                e["torrent"] = link_splited[0]+'//'+link_splited[2]+'/download/'+link_splited[4]+'/'+link_splited[5];
            }
            _links.push(e);
        });
        return _links;
    } 
    protected get_info_torrents(links){
        let _links = [];
        let subject = new Rx.Subject();
        var cont = 0;
        var tam = links.length;
 
        _.forEachRight(links, (element, index)=>{
            let _link = _.replace(element.torrent, '/download/','/torrent/');
            var e = element;
            var options = {
                url: _link,
                method: 'GET'
            };
            request(options, (error, response, html)=>{
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
                }else{
                    console.log('*******');
                    console.log(element);
                    console.log('error get_info_torrents: '+error);
                }
            });
        });
        return subject;
    }
    protected format_links(links){
        let _links = [];
        _.forEachRight(links, (element, index)=>{
                    if(_links.length===0){
                      _links.push({
                        group:element.group,
                        data:[
                          {
                          title:element.title,
                          description:element.description,
                          href:element.href,
                          group:element.group,
                          info_torrent:element.info_torrent,
                          link:element.link,
                          res:element.res,
                          torrent:element.torrent
                          }
                        ]
                      });
                    }else{
                      let pos = _.findIndex(_links, {'group':element.group});
                      if(pos>-1){
                        _links[pos].data.push({
                          title:element.title,
                          description:element.description,
                          href:element.href,
                          group:element.group,
                          info_torrent:element.info_torrent,
                          link:element.link,
                          res:element.res,
                          torrent:element.torrent
                        });
                      }else{
                        _links.push({
                        group:element.group,
                        data:[
                          {
                          title:element.title,
                          description:element.description,
                          href:element.href,
                          group:element.group,
                          info_torrent:element.info_torrent,
                          link:element.link,
                          res:element.res,
                          torrent:element.torrent
                          }
                        ]
                      });
                      }
                    }
                });
        return _links;
    }
    protected get_queries_for_subs(links, TVShow_name:string, season: number, episode: number){
        let subject = new Rx.Subject();
        let list_query = this.create_query(links,TVShow_name,season,episode);
        let _self = this;
        let cont = 0;
        _.forEach(list_query,(element,index)=>{
            
            setTimeout(()=>{
                google(element.query,function(err, res){
                    element['links']=[];
                    if(!err){
                        let _subs_links = _self.clean_subs_list(res.links,TVShow_name,season,episode);
                        element.links = _subs_links;
                        if(cont===list_query.length-1){
                            subject.next(list_query);
                        }
                        cont++;
                    }else{
                        if(cont===list_query.length-1){
                            subject.next(list_query);
                        }
                        cont++;
                    }
                });
            },1000);
        });
        return subject;
    }
    protected get_subs_links(list_query){
        let subject = new Rx.Subject();
        let _links = list_query;
        let _total_links_count = 0;
        let _counter = 0;
        _.forEach(_links, (element, index)=>{
            _total_links_count += element.links.length;
        });
        _.forEach(_links,(element,index)=>{
            if(element.links.length>0){
                _.forEach(element.links,(e, i)=>{
                    request(e.href, function(error, response, html){
                        if(!error){
                            var $ = cheerio.load(html, {
                                        normalizeWhitespace: false,
                                        xmlMode: false,
                                        decodeEntities: true
                                    });
                            let sub = {};
                            $('#detalle_datos').filter(function(){
                                e["sub_desc"] = $(this).find('font').text();
                                e["sub_link"] = $(this).find('a.link1').attr('href');
                                // e['sub'] = [];
                                // e.sub.push(sub);
                                return true;
                            });
                            if(_counter === _total_links_count-1){
                                subject.next(_links);
                            }
                            _counter++;
                        }else{
                            if(_counter === _total_links_count-1){
                                subject.next(_links);
                            }
                            _counter++;
                        }
                    });
                });
            }
        });
        return subject;
    }
    protected clean_subs_list(links, TVShow_name:string, season: number, episode: number){
        let _links = [];
        let _error_href = [
            'index.php',
            'X5X-subtitulos',
            'X46X-sub',
            '?pg'];
        let _error_title = [
            'Página',
            'pagina',
            'página'];
        _.forEachRight(links,(element, index)=>{
            //check _error_href
            if(element.href.length>23){
                let _isErrorHref : boolean = false;
                _.forEach(_error_href, (e, i)=>{
                    if(element.href.indexOf(e)!==-1){
                        _isErrorHref = true;
                    }
                });
                //check _error_title
            let _isErrorTitle : boolean = false;
                _.forEach(_error_title, (e, i)=>{
                    if(element.title.indexOf(e)!==-1){
                        _isErrorTitle = true;
                    }
                });
                //if double check true -> push
                if(!_isErrorHref && !_isErrorTitle){
                    _links.push(element);
                }
            }
        });
        _links = _.uniqBy(_links,'href');
        return _links
    }
    protected create_query(links, TVShow_name:string, season: number, episode: number){
        let query = '';
        let list_query = [];
        if(season<=9 && episode<=9){
            query = TVShow_name+' S0'+season+'E0'+episode;
        }else if(season<=9 && episode>9){
            query = TVShow_name+' S0'+season+'E'+episode;
        }
        else if(season>9 && episode<=9){
            query = TVShow_name+' S'+season+'E0'+episode;
        }
        else if(season>9 && episode>9){
            query = TVShow_name+' S'+season+'E'+episode;
        }
        _.forEachRight(links, (element, index)=>{
            if(typeof element.group !== 'undefined'){
                _.forEachRight(element.data, (e, i)=>{
                    if(typeof e.res !== 'undefined'){
                        let _query = query+' '+e.res+' '+element.group+' site:subdivx.com';
                        let index = _.findIndex(list_query,{'query':_query});
                        if(index===-1){
                            list_query.push({
                                query: _query,
                                res: e.res,
                                group: element.group
                            });
                        }
                    }else{
                        let _query = query+' '+element.group+' site:subdivx.com';
                        let index = _.findIndex(list_query,{'query':_query});
                        if(index===-1){
                            list_query.push({
                                query: _query,
                                group: element.group
                            });
                        }
                    }
                });
            }else{
                _.forEachRight(element.data, (e, i)=>{
                    if(typeof e.res !== 'undefined'){
                        let _query = query+' '+e.res+' site:subdivx.com';
                        let index = _.findIndex(list_query,{'query':_query});
                        if(index===-1){
                            list_query.push({
                                query: _query,
                                res: e.res
                            });
                        }
                    }else{
                        let _query = query+' site:subdivx.com';
                        let index = _.findIndex(list_query,{'query':_query});
                        if(index===-1){
                            list_query.push({
                                query: _query
                            });
                        }
                    }
                });
            }
        });
        return list_query;
    }
}