import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import { tmdb_services } from './tmdb/tmdb_services';
import { RouterETV } from './router';

export class ServerApp {
    private _app            : express.Express;
    private tmdb_service    : any;
    private Router          : RouterETV;
    constructor(){
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.use(express.static(path.join(__dirname,'..','client')));
        this.tmdb_service = new tmdb_services;
        this.Router = new RouterETV(this._app, this.tmdb_service);
    }
    public startServer(){
        this._app.listen(5000, function(){
            console.log('running on port 5000...');
        });
    }
    private _indexRender(req: express.Request, res: express.Response){
        res.sendFile(path.resolve('.')+'/build/client', 'index.html');
    }
}
