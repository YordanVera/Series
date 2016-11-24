import * as _           from 'lodash';
import * as request     from 'request';
import * as cheerio     from 'cheerio';
import * as Rx          from 'rxjs/Rx';
var PirateBay = require('thepiratebay');

export class thepiratebay {
    constructor(){}
    public search(TVShow_name: string, season: number, episode: number){
        let subject = new Rx.Subject();
        let query = this.create_query(TVShow_name, season, episode);
        PirateBay.search(query, {category: 208})
                .then(results => {
                    _.forEach(results, (e)=>{
                        e['site'] = 'The Pirate Bay';
                    });
                    subject.next(results);
                })
                .catch(err => console.log(err))
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
        return TVShow_name+' '+cap;
    }
    protected delete_duplicate(links){
        let _links = [];
        _.forEach(links, (element, index)=>{
            if(_links.length<1){
                _links.push(element);
            }else{
                let idx_element = _.findIndex(_links,{id:element.id});
                if(idx_element===-1){
                    _links.push(element);
                }
            }
        });
        return _links;
    }
};
