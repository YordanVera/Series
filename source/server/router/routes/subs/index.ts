import * as express         from "express";
import * as _               from 'lodash';
import * as request         from 'request';
import * as cheerio         from 'cheerio';
import * as Rx              from 'rxjs/Rx';

export class subs_routes {
    private _app            : express.Express;

    constructor(app){
        this._app           = app;
        this.setRoutes();
    }
    public setRoutes(){
        
    }
    
}