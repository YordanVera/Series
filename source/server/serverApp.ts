import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as Router from "./router";
import { tmdb_services } from './tmdb/tmdb_services';

export class ServerApp {
    private _app            : express.Express;
    private tmdb_service    : any;

    constructor(){
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.use(express.static(path.join(__dirname,'..','client')));
        this.Routes();
        this.tmdb_service = new tmdb_services;
    }
    public subTMDB(){
        // var subject = this.tmdbService.getSubject();
        // var subscription = subject.subscribe(
        //     x => console.log('onNext: ' + x),
        //     e => console.log('onError: ' + e.message),
        //     () => console.log('onCompleted'));
        //     this.tmdbService.getToken();
    }
    public setRoutes(){
        //this._app.get('/*', this._indexRender);
    }

    private Routes()  {
        this._app.use(Router);
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
