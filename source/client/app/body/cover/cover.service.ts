import { Injectable }                               from '@angular/core';
import { Http, Headers, RequestOptions, Response }  from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { TVShow, dataTVShow }                       from './tvshow';

@Injectable()
export class CoverService {
    private TVShowUrl = '/list_tvshows';

    constructor(private http : Http){}

    getTV_Shows (): Observable<TVShow[]>{
        return this.http.get(this.TVShowUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
    private extractData(res: Response){
        let body = res.json();
        console.log(body.result);
        return body.result || {};
    }

    private handleError(error: any){
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    newTV_Show(TVShow_name : string){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.post('/add_tvshow',{"TVShow_name":TVShow_name},options).subscribe(
            data => {
                console.log(data._body);
               //this.getTV_Shows();
            }
        );
    }
}