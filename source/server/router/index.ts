import * as express         from 'express';
import { tmdb_services }    from '../tmdb/tmdb_services';
import { tvshow_routes }    from './routes/tvshow';
import { links_routes }     from './routes/links';
import { status_routes }    from './routes/status';

export class RouterETV {
    constructor(app, tmdb_services){
        new tvshow_routes(app, tmdb_services);
        new links_routes(app);
        new status_routes(app);
    }
}