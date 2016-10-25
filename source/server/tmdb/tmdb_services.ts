import { tmdb_connection } from './tmdb_connection';
import { tmdb_session } from './tmdn_session';

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
                    session.subject.unsubscribe();
                }
            );
        }
    }
    //api
    private getTvshow() {
        //if connection_established
        //  call function
        //else 
        //  do connection
    }

}