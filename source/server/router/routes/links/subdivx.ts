import * as _           from 'lodash';
import * as request     from 'request';
import * as cheerio     from 'cheerio';
import * as Rx          from 'rxjs/Rx';

export class subdivx {
    constructor(){}
    public search(links, TVShow_name: string, season: number, episode: number){
        let subject = new Rx.Subject();
        let query = this.create_query(TVShow_name, season, episode);
        request(query, (error, response, html)=>{
            if(!error){
                var $ = cheerio.load(html, {normalizeWhitespace: false, xmlMode: false, decodeEntities: true});
                subject.next('búsqueda en subdivx');
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
        return 'http://www.subdivx.com/index.php?buscar='+TVShow_name+'+'+cap+'&accion=5&masdesc=&subtitulos=1&realiza_b=1';
    }
}