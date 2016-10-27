import { tmdb_connection } from './tmdb_connection';
import { tmdb_session } from './tmdn_session';
import { config_tmdb } from '../config/config_tmdb';
import * as request from 'request';
import * as Rx from "rxjs/Rx";

export class tmdb_services {
    connection_established: boolean;
    private tmdb_connection : tmdb_connection;
    private _session        : tmdb_session;

    constructor(){
        this.tmdb_connection = new tmdb_connection;
        this.getSessionData();
    }
    private getSessionData(){
        var session = this.tmdb_connection.getSession();
        if(session.success){
            console.log('done !');
            this.connection_established = true;
            this._session = session.data;
        }else{
            session.subject.subscribe(
                x => {
                    this._session = x;
                    this.connection_established = true;
                    console.log('connection done !');
                    session.subject.unsubscribe();
                }
            );
        }
    }
    //api tmdb
    public getTVShowData(title : string) {
        var subject = new Rx.Subject();
        request(this.tmdb_connection.Create_query(
            'https://api.themoviedb.org/3/search/tv',
                {   query           : title,
                    language        : 'en-US',
                    api_key         : config_tmdb.key },
            ), (error, response, body)=> {
                if(error){ 
                    throw new Error(error);
                }
                subject.next(body);
                subject.complete();
                subject.unsubscribe();
            });
        return subject;
    }

}
