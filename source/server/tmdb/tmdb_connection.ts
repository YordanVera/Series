/// <reference path="../../typings/index.d.ts"/>
import { tmdb_session } from './tmdn_session';
import { config_tmdb } from '../config/config_tmdb';
import * as request from 'request';
import * as Rx from "rxjs/Rx";

export class tmdb_connection   {
    private url_request_token   : 'https://api.themoviedb.org/3/authentication/token/new';
    private url_validate_token  : 'https://api.themoviedb.org/3/authentication/token/validate_with_login';
    private url_create_session  : 'https://api.themoviedb.org/3/authentication/session/new';
    private session             : tmdb_session;
    private status              : string = 'disconnected';
    private subject             : any;
    public  public_subject      : any;

    constructor(){
        this.subject = new Rx.Subject();
        this.public_subject = new Rx.Subject();
        if(this.status === 'disconnected') this.connect_tmdb();
    }
    public getSession(): {success:boolean,data:tmdb_session,subject:any}{
        if(this.status === 'connected')
            return {success: true, data: this.session, subject: null};
        else    
            return {success: false, data: null,subject: this.public_subject};        
    }
    public getStatus(){
        return this.status;
    }
    private connect_tmdb(){
        this.session = new tmdb_session;
        this.status = 'connecting';
        this.subject.subscribe(
            x   => {
                if(typeof this.session.token !== 'undefined' && this.session.token_validated !== true){
                    this.Validate_Token();
                } 
                if(this.session.token_validated === true && typeof this.session.session_id === 'undefined'){
                     this.Create_session();
                }
            },
            e   =>  {
                //error handle
                console.log(e);
            },
            ()  => {
                this.status = 'connected';
                this.public_subject.next(this.session);
            }
        );
        this.Create_Request_Token();
    }
    private Create_Request_Token (){
            request(this.Create_query(
                'https://api.themoviedb.org/3/authentication/token/new',
                {api_key: config_tmdb.key}
            ), (error, response, body)=> {
                if(error){ 
                    throw new Error(error);
                }
                this.session.token = body.request_token;
                this.session.token_validated = false;
                this.subject.next(this.session.token);
            });
    }
    private Validate_Token(){
            request(this.Create_query(
                'https://api.themoviedb.org/3/authentication/token/validate_with_login',
                {   request_token   : this.session.token,
                    password        : config_tmdb.password,
                    username        : config_tmdb.username,
                    api_key         : config_tmdb.key },
            ), (error, response, body)=> {
                if(error){ 
                    throw new Error(error);
                }
                this.session.token_validated = true;
                this.subject.next();
            });
    }
    private Create_session(){
        request(this.Create_query(
                'https://api.themoviedb.org/3/authentication/session/new',
                {   request_token   : this.session.token,
                    api_key         : config_tmdb.key },
            ), (error, response, body)=> {
                if(error){ 
                    throw new Error(error);
                }
                this.session.session_id = body.session_id;
                this.subject.complete();
                this.subject.unsubscribe();
            });
    }
    public Create_query(url: string, qs: any, method?: string, headers?: any, body?: any, json?: boolean){
        return {
            method  : (typeof method === 'undefined') ? 'GET':method,
            url     : (typeof url === 'undefined') ? '':url,
            qs      : (typeof qs === 'undefined') ? '':qs,
            headers : (typeof headers === 'undefined') ?  {'content-type': 'application/json'} : headers,
            body    : (typeof body === 'undefined') ? {} : body,
            json    : (typeof json === 'undefined') ? true : false 
        }
    }
}