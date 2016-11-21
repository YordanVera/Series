import { Injectable, EventEmitter }                 from '@angular/core';
import { Http, Headers, RequestOptions, Response }  from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { TVShow, dataTVShow }                       from './tvshow';
import * as Rx                                      from "rxjs/Rx";

@Injectable()
export class CoverService {
    private TVShowUrl = '/list_tvshows';
    constructor(private http : Http){  }

    getAll_TVShows (){
        return this.http.get(this.TVShowUrl)
                         .map(this.extractData) 
                         .catch(this.handleError);
    }
    private extractData(res: Response){
        let body = res.json();
        return body.result || {};
    }

    private handleError(error: any){
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    new_TVShow(TVShow_name : string){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/add_tvshow',{"TVShow_name":TVShow_name},options)
                        .map(res => res.json())
                        .catch(this.handleError);
    }
    get_TVShow_Detail(TVShow_name : string){
        return this.http.get('/get_tvshow_data/'+TVShow_name)
                        .map(res => res.json())
                        .catch(this.handleError);
    }
    get_TVShow_Full_Detail(id : number){
        return this.http.get('/get_tvshow_full_data/'+id)
                        .map(res => res.json())
                        .catch(this.handleError);
    }
    get_Season_Detail(id : number, season_number : number){
        return this.http.get('/get_season_detail/'+id+'/'+season_number)
                        .map(res => res.json())
                        .catch(this.handleError);
    }
}