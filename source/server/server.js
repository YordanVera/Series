var express     = require('express');
var fs          = require('fs');
var request     = require('request');
var cheerio     = require('cheerio');
var google      = require('google');
var _           = require('lodash');
var app         = express();
var mysql       = require('mysql');
var API_TMDB    = {
    username        : 'Mr.Kira',
    password        : '24kira55',
    key             : 'c77869e1ec5fe57499e7e9c25ce4c7da',
    request_token   : null
};
var connection  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '24kira55',
    database : 'etv'
});
//helper for query
var optionsQuery = function(url, qs, method, headers, body, json) {
    return {
        method  : (typeof method === 'undefined') ? 'GET':method,
        url     : (typeof url === 'undefined') ? '':url,
        qs      : (typeof qs === 'undefined') ? '':qs,
        headers : (typeof headers === 'undefined') ?  {'content-type': 'application/json'} : headers,
        body    : (typeof body === 'undefined') ? {} : body,
        json    : (typeof json === 'undefined') ? true : false 
    }
};
var lista_series = null;
connection.connect();
connection.query('SELECT id_serie, nombre FROM series', function(err, rows, fields) {
    if (err) throw err;
    lista_series = _.cloneDeep(rows);
});
connection.end();

var create_Request_Token = function () {
    //var _output = null;
    console.log('obteniendo token');
    request(optionsQuery(
        'https://api.themoviedb.org/3/authentication/token/new',
        { api_key: API_TMDB.key }), function (error, response, body) {
        if (error) throw new Error(error);
        API_TMDB.request_token = body.request_token;
        validate_Request_Token();
        //console.log(body);
        //_output = _.cloneDeep(body);
        //return _output;
    });
};
var validate_Request_Token = function () {
    //var _output = null;
    console.log('validando token');
    request(optionsQuery(
        'https://api.themoviedb.org/3/authentication/token/validate_with_login',
        {   request_token   : API_TMDB.request_token,
            password        : API_TMDB.password,
            username        : API_TMDB.username,
            api_key         : API_TMDB.key }), function (error, response, body) {
        if (error) throw new Error(error);
        create_Session();
        //console.log(body);
        //_output = _.cloneDeep(body);
    });
    //return _output;
};
var create_Session = function () {
    //var _output = null;
    console.log('creando sesión');
    request(optionsQuery(
        'https://api.themoviedb.org/3/authentication/session/new',
         {  request_token   : API_TMDB.request_token,
            api_key         : API_TMDB.key }), function (error, response, body) {
        if (error) throw new Error(error);
        //_output = _.cloneDeep(body);
        console.log('Sesión creada');
    });
    //return _output;
};

var connect_TMDB = function () {
    create_Request_Token();
};

//connect_TMDB();

var listGroupR = ['dimension', 'avs', 'immerse'];

app.get('/step1', function (req, res) {
    var seasons = null;
    var id_serie_TMDB = null;
    var lista_torrent_sub = [];
    request(optionsQuery(
        'https://api.themoviedb.org/3/search/tv',
        {   page    : '1',
            query   : lista_series[0].nombre,
            language: 'en-US',
            api_key : API_TMDB.key }), function (error, response, body) {
        if (error) throw new Error(error);

        if(body.results.length===1){
            //se obtiene la id de la serie;
            console.log('Buscando temporadas...');
            id_serie_TMDB=body.results[0].id;
            request(optionsQuery(
                'https://api.themoviedb.org/3/tv/'+id_serie_TMDB,
                { language: 'en-US',
                    api_key: API_TMDB.key }), function (error, response, body) {
                if (error) throw new Error(error);
                //obtener temporadas de la serie
                seasons = _.cloneDeep(body.seasons);
                //generar lista
                var numTemp = 0;
                var cap = 1;
                while(numTemp < seasons.length){
                    seasons[numTemp]['caps'] = [];
                    while(cap <= seasons[numTemp].episode_count){
                        var nombreCap = null;
                        if((numTemp+1)<10 && cap < 10){
                            nombreCap = 'S0'+(numTemp+1)+'E0'+cap;
                        }else if((numTemp+1)>=10 && cap < 10){
                            nombreCap = 'S'+(numTemp+1)+'E0'+cap;
                        }else if ((numTemp+1)< 10 && cap >=10){
                            nombreCap = 'S0'+(numTemp+1)+'E'+cap;
                        }else{
                            nombreCap = 'S'+(numTemp+1)+'E'+cap;
                        }
                        seasons[numTemp]['caps'].push({
                                nombre  : nombreCap+'.'+lista_series[0].nombre+'.720p',
                                torrent : '',
                                sub     : ''
                        });
                        cap++;
                    }
                    cap=0;
                    numTemp++;
                }
                numTemp=0;
            busquedaTorrents(seasons);
            });
        }
    });

    var busquedaTorrents = function (seasons) {
        console.log('buscando torrents ...');
        var temp = 0;
        var caps = 0;
        while(temp < seasons.length){
            while(caps < seasons[temp]['caps'].length){
                google.resultsPerPage = 25;
                google(seasons[temp]['caps'][caps].nombre+' site:extratorrent.cc', function (err, res) {
                    if(err) console.log('error: '+err);
                    var query = _.split(res.query,'.',1)[0];
                    var split_query = query.split('E');
                    var seasonPos = Number(split_query[0].slice(1))-(1);
                    var capPos = Number(split_query[1])-(1);
                    var _link = res.links[0]; //primer link test
                    //de links obtener link por cada grupo
                    seasons[seasonPos]['caps'][capPos]['torrent'] = _.replace(_link.href,'/torrent/','/download/');
                    console.log(seasons[seasonPos]['caps'][capPos]);
                });
                caps++;
            }
            temp++;
        }
    };
    var linksGroup = function (links, seasonPos, capPos) {

    };
    //var busquedaSubs = function (seasons) {
    //    console.log('buscando subtitulos ...');
    //    var tempPos = 0;
    //    var capsPos = 0;
    //    while(tempPos < seasons.length){
    //        while(capsPos < seasons[tempPos]['caps'].length){
    //            google(seasons[tempPos]['caps'][capsPos].nombre+' site:extratorrent.cc', function (err, res) {
    //                if(err) console.log('error: '+err);
    //
    //
    //
    //                var nombreCap = _.split(res.query,'.',1)[0];
    //                var nombres = nombreCap.split('E');
    //                var seasonPos = Number(nombres[0].slice(1))-(1);
    //                var capPos = Number(nombres[1])-(1);
    //                var _link = res.links[0]; //primer link test
    //                seasons[seasonPos]['caps'][capPos]['torrent'] = _.replace(_link.href,'/torrent/','/download/');
    //                console.log(seasons[seasonPos]['caps'][capPos]);
    //            });
    //            capsPos++;
    //        }
    //        tempPos++;
    //    }
    //};
    res.send('<h1>OK !</h1>');
});
var grupoRelease = function (link, nombre) {
    //buscar grupos conocidos
    var _link = _.lowerCase(link);
    var listaGrupos = [
        'dimension',
        'avs',
        'sva',
        'hevc',
        'batv',
        'ctrlhd',
        'd-zon3',
        'ntb',
        'don',
        'form',
        'xander',
        'killers',
        'lol',
        'river',
        'fum',
        'fleet',
        'shaanig',
        'bajskorv'
    ];
    var i = 0, index = null;
    while(i < listaGrupos.length){
        if(_link.indexOf(listaGrupos[i]) !== -1){
            index = i;
        }
        i++;
    }
    if(index !== null){
        return listaGrupos[index];
    }else{
        return null;
    }
};
var grupoRelease2 = function (link) {
    //detectar patron
    var link_splited = _.split(link,'.');

    console.log(link_splited);
    var grupo = _.split(link_splited[4],'-')[1];
    if(grupo.indexOf('(')!==-1){
        grupo = grupo.replace(/\(+.+\)/g, "");
    }else if(grupo.indexOf('[')!==-1){
        grupo = grupo.replace(/\[+.+]/g, "");
    }else if(grupo.indexOf('{')!==-1){
        grupo = grupo.replace(/\{+.+}/g, "");
    }
    return grupo.toLowerCase();
};
app.get('/g', function (req, res) {

    var test = grupoRelease('Blindspot.S01E01.720p.HDTV.X264-DIMENSION[EtHD]');
    var test2 = grupoRelease2('Blindspot.S01E01.720p.HDTV.X264-DIMENSION[EtHD]');
    if(test.localeCompare(test2) === 0){
        //se agrega el grupo
    }
    res.send('grupo : 1: '+test+' 2:'+test2);

});
//app.get('/lista', function (req, res) {
//    google.resultPerPage = 10;
//    var nextCounter = 0;
//    var _link = null;
//
//    var busquedaSub = function (_link) {
//        google('blindspot S02E01 720p site:subdivx.com', function (err, res) {
//            if(err) console.log('error: '+err);
//            var _linkSub = res.links[0]; //primero test
//            console.log('google sub:'+_linkSub.title);
//            console.log('link sub:'+_linkSub.href);
//            request(_linkSub.href, function (error, response, html) {
//                if(!error){
//                    var $ = cheerio.load(html);
//                    $('#contenedor_izq').filter(function () {
//                        var data = $(this);
//                        $('#buscador_detalle_sub').filter(function () {
//                            var data_in = $(this);
//                            var _linkSubDownload = data_in.children();
//                        });
//                    });
//                }
//            });
//        });
//    };
//    res.send('ok');
//});

app.listen('3000');
console.log('Server port: 3000');

exports = module.exports = app;
