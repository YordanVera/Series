import { Injectable, EventEmitter }                 from '@angular/core';
import { Http, Headers, RequestOptions, Response }  from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import * as Rx                                      from "rxjs/Rx";

@Injectable()
export class TorrentService {
    constructor(private http : Http){  }

    private handleError(error: any){
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    get_Torrents(TVShow_name : string, season : number, episode: number){
        return this.http.get('/get_torrents/'+TVShow_name+'/'+season+'/'+episode)
                        .map(res => res.json())
                        .catch(this.handleError);
    }

}