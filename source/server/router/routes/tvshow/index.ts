import * as express         from "express";
import * as mysql           from 'mysql';
import * as _               from 'lodash';
import * as request         from 'request';
import * as cheerio         from 'cheerio';
// import * as google          from 'google';
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
        this.get_torrents();
    }
    private list_tvshows(){
        this._app.get('/list_tvshows',(req, res)=>{
            if(!req.body)
                return res.sendStatus(400);
            else
                this._pool.query('SELECT id_serie, title FROM series', (error, rows, fields) => {
                    if (error)
                        return res.json({success: false, error: error});
                    else
                        //get data api
                        var data =[];
                        rows.forEach((tvshow, index, rows) => {
                            let subject = this._tmdb_services.getTVShowData(tvshow.title);
                            subject.subscribe(
                                (x:any) => {
                                    if(x.total_results === 1){
                                        data.push({
                                            id_serie    : rows[index].id_serie,
                                            title       : rows[index].title,
                                            data        : x.results[0]});
                                    }
                                    else{
                                        let tvshow = _.find(x.results, (o:any)=>{
                                            return (
                                                o.name === rows[index].title &&
                                                o.poster_path.length > 1 &&
                                                o.overview.length > 1
                                            );
                                        });
                                        data.push({
                                                    id_serie    : rows[index].id_serie,
                                                    title       : rows[index].title,
                                                    data        : tvshow});
                                    }
                                },
                                e   => {
                                    data.push({
                                        id_serie    : rows[index].id_serie,
                                        title       : rows[index].title,
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
                this._pool.query('INSERT INTO series (title) VALUES (?)', [req.body.TVShow_name], (error, result) => {
                    if (error) return res.json({success: false, error: error});
                    return res.json({
                        success: true,
                        id_serie: result.insertId
                    });
                });
        });
    }
    private del_tvshow(){
        this._app.delete('/del_tvshow/:id_serie',(req, res) => {
            if(!req.params)
                return res.sendStatus(400);
            else
                this._pool.query('DELETE FROM series WHERE id_serie = ?', [req.params.id_serie], (error) => {
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
                this._pool.query('UPDATE series SET title = ? WHERE id_serie = ?', [req.body.nombre, req.body.id_serie], (error) => {
                    if (error)
                        return res.json({success: false, error: error});
                    else
                        return res.json({success:true});
                });
            }
        });
    }
    private get_tvshow_data(){
        this._app.get('/get_tvshow_data/:title', (req, res)=>{
            if(!req.body)
                return res.sendStatus(400)
            else
                var subject : any = this._tmdb_services.getTVShowData(req.params.title);
                subject.subscribe(
                    x   => {
                        if(x.total_results === 1){
                            return res.json({success:true, result:x.results[0]});
                        }
                        else{
                            let tvshow = _.find(x.results, (o:any)=>{
                                            return (
                                                o.name === req.params.title &&
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
    private get_torrents(){
        this._app.get('/get_torrents/:TVShow_name/:season/:episode',(req, res)=>{
            if(!req.body){
                return res.sendStatus(400);
            }else{
                var google = require('google');
                google.resultPerPage=10;
                let _self = this;
                let _res = res;
                google(req.params.TVShow_name+'.S0'+req.params.season+'.E0'+req.params.episode+' 720p site:extratorrent.cc', function(err, res){
                    if(err){
                        console.log(err);
                    }else{
                        let result = _self.select_links(res.links,req.params.TVShow_name,req.params.season,req.params.episode);
                        result = _self.groups_release(result);
                        result = _self.delete_duplicate(result);
                        result = _self.torrent_link(result);
                        //_self.get_info_torrent(result[0].torrent);

                        _self.get_info_torrents(result);

                        return _res.json({success:true, result:result});
                    }
                });
                
            }
        });
    }
    // [*] primero: se asegura que los links correspondan exclusivamente al capítulo
    protected select_links(links:any, TVShow_name: string, season:number, episode:number){
        let _links = [];
        _.forEach(links, (element)=>{
            if(element.title.indexOf(TVShow_name) !== -1){
                if(element.title.indexOf('S0'+season+'E0'+episode) !== -1){
                //console.log(element.title);
                _links.push(element);
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
            e["torrent"] = link_splited[0]+'//'+link_splited[2]+'/download/'+link_splited[4]+'/'+link_splited[5];
            _links.push(e);
        });
        return _links;
    } 
    //cuarto: obtener data en relación a seeders y leechers
    protected get_info_torrents(links){
        let _links = [];
        _.forEach(links, (element)=>{
            let _link = _.replace(element.href, '/download/','/torrent/');
            console.log(_link);
            request(_link, (error, response, html)=>{
                if(!error){
                    var $ = cheerio.load(html);
                    $('td.tabledata0').filter(function(index){
                        if(index===4){
                            console.log($(this).text());
                        }
                        return true;
                    });
                }
            });
        });
    }
}
