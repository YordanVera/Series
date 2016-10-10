/// <reference path="../typings/index.d.ts" />
import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";

export class ServerApp {
    private _app : express.Express;

    constructor(){
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.use(express.static(path.resolve('.')+'/build/client'));
    }

    public setRoutes(){
        this._app.get('/*', this._indexRender);
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