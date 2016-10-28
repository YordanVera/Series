import * as express from "express";
import { tmdb_services } from '../tmdb/tmdb_services';
import { tvshow_routes } from './routes/tvshow';

export class RouterETV {
    constructor(app, tmdb_services){
        new tvshow_routes(app, tmdb_services);        
    }
}