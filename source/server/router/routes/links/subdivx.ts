import * as _           from 'lodash';
import * as request     from 'request';
import * as cheerio     from 'cheerio';
import * as Rx          from 'rxjs/Rx';

export class subdivx {
    constructor(){}
    public search(links, TVShow_name: string, season: number, episode: number){
        let subject = new Rx.Subject();
        let url = this.create_url(TVShow_name, season, episode);
        request(url, (error, response, html)=>{
            if(!error){
                var $ = cheerio.load(html, {normalizeWhitespace: false, xmlMode: false, decodeEntities: true});
                var _self = this;
                var contenedor_izq = [];
                $('#contenedor_izq')
                .children('div')
                .filter(function(idx, element){
                    _.forEach(element.children, (element, index)=>{
                        if(element.name === 'div' && element.type === 'tag'){
                            contenedor_izq.push(element);
                        }
                    });
                    return true;
                });
                var _case = 0;
                var list_subtitles = [];
                var _subtitle = null;
                _.forEach(contenedor_izq, (element, index)=>{
                    switch (_case){
                        //inicia el subtitulo, y obtiene el link del subtitulo
                        case 0:{
                            _subtitle = {
                                href : null,
                                desc : null,
                                link : null
                            };
                            if(element.attribs.id === 'menu_titulo_buscador'){
                                if(element.children[0].attribs.class === 'titulo_menu_izq'){
                                    _subtitle.href = element.children[0].attribs.href;
                                    _case++;
                                }
                            }
                        }
                        //obtiene la descripción del subtitulo
                        case 1:{ 
                            if(element.attribs.id === 'buscador_detalle_sub'){
                                if(element.children[0].type==='text'){
                                    _subtitle.desc=element.children[0].data;
                                    _case++;
                                }
                            }
                        }
                        //obtiene el link de descarga del subtitulo y reinicia el _case
                        case 2:{
                            if(element.attribs.id === 'buscador_detalle_sub_datos'){
                                let last_child = element.children[element.children.length-1];
                                if(last_child.type === 'tag' && last_child.name === 'a'){
                                    _subtitle.link=last_child.attribs.href;
                                    _case=0;
                                    list_subtitles.push(_subtitle);
                                }
                            }
                        }
                    }
                });
                subject.next(list_subtitles);
            }
        });
        return subject;
    }
    protected create_url(TVShow_name: string, season: number, episode: number){
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
        return 'http://www.subdivx.com/index.php?buscar='+TVShow_name+'+'+cap+'&accion=5&masdesc=&subtitulos=1&realiza_b=1';
    }
}