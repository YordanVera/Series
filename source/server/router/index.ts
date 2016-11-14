import * as express         from 'express';
import { tmdb_services }    from '../tmdb/tmdb_services';
import { tvshow_routes }    from './routes/tvshow';
import { torrent_routes }   from './routes/torrent';
import { subs_routes }      from './routes/subs';
export class RouterETV {
    constructor(app, tmdb_services){
        new tvshow_routes(app, tmdb_services);
        new torrent_routes(app);
        new subs_routes(app);
    }
}