import * as express from "express";

let route = express.Router();
route.get('/tvshows', (req, res) => {
    console.log('test');
    res.json({success : true});
});

export = route;