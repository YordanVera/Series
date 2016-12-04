import * as _           from 'lodash';
import * as request     from 'request';
import * as cheerio     from 'cheerio';
import * as Rx          from 'rxjs/Rx';

export class extratorrent {
    constructor(){}
    public search(TVShow_name: string, season: number, episode: number){
        let subject = new Rx.Subject();
        let query = this.create_query(TVShow_name, season, episode);
        let links = [];

        request(query, (error, response, html)=>{
            if(!error){
                var $ = cheerio.load(html, {normalizeWhitespace: false, xmlMode: false, decodeEntities: true});
                var _self = this;
                //tabla con resultados
                $('table .tl').filter(function(idx,element){
                    $(this).filter(function(i,e){
                        //se comprueba que hayan resultados, sino no hay data
                        if(e.children.length>2){
                            //contenido de la tabla
                            _.forEach(e.children, (elem, index)=>{
                                //solo tr (filas) 
                                if(elem.name === 'tr'){ 
                                    let _torrent = elem.children[0].children[0].attribs;
                                    let _magnet = elem.children[0].children[1].attribs;
                                    var _name = elem.children[2].children[3].attribs;
                                    let _added = elem.children[3].children[0];
                                    let _size = elem.children[4].children[0];
                                    let _seeders = elem.children[5].children[0];
                                    let _leechers = elem.children[6].children[0];
                                    if(_.values(_name)[0] === 'c_tor'){ //caso especial
                                        _name = elem.children[2].children[2].attribs;
                                    }
                                    var name = '';
                                    var link = '';
                                    if(typeof _name !== 'undefined'){
                                        name = _.values(_name)[1].toString();
                                        name = name.substring(5); //cut 'view '
                                        name = name.substring(0,name.length-8); // cut ' torrent' 
                                        link = 'http://extratorrent.cc'+name;
                                    }else{
                                        _name = elem.children[2].children[2].attribs;
                                        if(_name.class === 'c_tor'){
                                            _name = elem.children[2].children[0].attribs;
                                        }
                                        name = _.values(_name)[1].toString();
                                        name = name.substring(5); //cut 'view ' 
                                        name = name.substring(0,name.length-8); // cut ' torrent' 
                                        link = 'http://extratorrent.cc'+name;
                                    }
                                    // console.log(name);
                                    links.push({
                                        'name'      :name,
                                        'torrent'   :'http://extratorrent.cc'+_.values(_torrent)[0],
                                        'link'      : link,
                                        'magnetLink'    :_.values(_magnet)[0],
                                        'added'     :_.values(_added)[0],
                                        'size'      :_.values(_size)[0],
                                        'seeders'   :_.values(_seeders)[0],
                                        'leechers'  :_.values(_leechers)[0],
                                        'site'      : 'ExtraTorrent'
                                    });
                                }
                                if(index === (e.children.length-1)){
                                    let res_links = _self.delete_duplicate(links);
                                    subject.next(res_links);
                                }
                            });
                        }else{
                            subject.next('no data');
                        }
                        return true;
                    });
                    return true;
                });
            }else{
                subject.error(error);
            }
        });
        return subject;
    } 
    protected create_query(TVShow_name: string, season: number, episode: number){
        let cap = '';
        if(season<=9 && episode<=9){
            cap = 'S0'+season+'E0'+episode;
        }else if(season<=9 && episode>9){
            cap = 'S0'+season+'E'+episode;
        }
        else if(season>9 && episode<=9){
            cap = 'S'+season+'E0'+episode;
        }
        else if(season>9 && episode>9){
            cap = 'S'+season+'E'+episode;
        }
        return 'http://extratorrent.cc/search/?search='+TVShow_name+'+'+cap+'&s_cat=8&pp=&srt=seeds&order=desc';
    }
    protected delete_duplicate(links){
        let _links = links;
        let _finale_links = [];
        _.forEach(_links, (element, index)=>{
            if(_finale_links.length===0){
                _finale_links.push(element);
            }else{
                var link_splited = _.split(element.link, '/'); 
                var link_id = link_splited[4];
                var counter = 0;
                _.forEach(_finale_links, (e, i)=>{
                    var finale_link = _.split(e.link, '/'); 
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
}