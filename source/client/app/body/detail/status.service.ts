import { Injectable, EventEmitter }                 from '@angular/core';
import { Http, Headers, RequestOptions, Response }  from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import * as Rx                                      from "rxjs/Rx";

@Injectable()
export class StatusService {
    constructor(private http : Http){  }

    private handleError(error: any){
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    get_status(id_tvshow : number, season: number){
        return this.http.get('/get_status/'+id_tvshow+'/'+season)
                        .map(res => res.json())
                        .catch(this.handleError);
    }
    update_status(status){
        return this.http.put('/put_status',status)
                        .map(res => res.json())
                        .catch(this.handleError);
    }
    add_status(status){
        return this.http.post('/add_status',status)
                        .map(res => res.json())
                        .catch(this.handleError);
    }
}