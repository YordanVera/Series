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
var lista_series = null;
connection.connect();
connection.query('SELECT id_serie, nombre FROM series', function(err, rows, fields) {
    if (err) throw err;
    lista_series = _.cloneDeep(rows);
});

connection.end();

var create_Request_Token = function () {
    var _output = null;
    var optionsAPI = { method: 'GET',
        url: 'https://api.themoviedb.org/3/authentication/token/new',
        qs: { api_key: API_TMDB.key },
        headers: { 'content-type': 'application/json' },
        body: {},
        json: true };
    console.log('obteniendo token');
    request(optionsAPI, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(body);
        _output = _.cloneDeep(body);
        return _output;
    });
};
var validate_Request_Token = function () {
    var _output = null;
    var optionsValidate = { method: 'GET',
        url: 'https://api.themoviedb.org/3/authentication/token/validate_with_login',
        qs:
        { request_token : API_TMDB.request_token,
            password    : API_TMDB.password,
            username    : API_TMDB.username,
            api_key     : API_TMDB.key },
        headers: { 'content-type': 'application/json' },
        body: {},
        json: true };
    console.log('validando token');

    request(optionsValidate, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(body);
        _output = _.cloneDeep(body);
    });
    return _output;
};
var create_Session = function () {
    var _output = null;
    console.log('creando sesión');
    var options = { method: 'GET',
        url: 'https://api.themoviedb.org/3/authentication/session/new',
        qs:
        {   request_token   : API_TMDB.request_token,
            api_key         : API_TMDB.key },
        headers: { 'content-type': 'application/json' },
        body: {},
        json: true };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        _output = _.cloneDeep(body);
    });
    return _output;
};

var connect_TMDB = function () {
    if(create_Request_Token().success){
        API_TMDB.request_token = body.request_token;
        if(validate_Request_Token().success){
            if(create_Session().success){
            console.log('Sesión creada. OK')
          }
      }
  }
};

connect_TMDB();

var setData = function (nombre) {
    var dataOutput = {
        titulo_serie    : '',
        num_temporada   : '',
        num_capitulo    : '',
        resolution      : '',
        tv_specific     : '',
        codec           : '',
        grupo_release   : '',
        grupo_torrent   : ''
    };
    //obtener titulo

    var dataInput = _.split(nombre,'.');
    //obtener temporada

    return dataOutput;
};
var listGroupR = ['dimension', 'avs', 'immerse'];
var generarTemporadas = function (serie) {
    var _listaTemp = null;

    return _listaTemp;
};
app.get('/lista', function (req, res) {
    google.resultPerPage = 10;
    var nextCounter = 0;
    var _link = null;
    google('blindspot S02E01 720p site:extratorrent.cc', function (err, res) {
        if(err) console.log('error: '+err);
        _link = res.links[0]; //primer link test
        console.log("google torrent : "+_link.title);
        console.log('link: '+_link.href);
        busquedaSub(_link);
        //for(var i=0; i< res.links.length; i++){
        //    var link = res.links[i];
        //    console.log("google : "+link.title + ' [ ' + link.href + ' ]');
        //    //console.log(setData(link.title));
        //    //console.log(link.description+'\n');
        //}
        //if(nextCounter<2){
        //    nextCounter +=1;
        //    if(res.next) res.next();
        //}
        var _linketcc = _.replace(_link.href,'/torrent/','/download/');
        console.log('.torrent :'+_linketcc);
    });

    //obtener grupo del video release
    request(_link, function (error, response, html) {
        if(!error){
            var $ = cheerio.load(html);
            var title, release, rating;
            var json = {title : "", release : "", rating: ""};
            var _linketcc = _.replace(_link.href,'/torrent/','download');
            console.log('.torrent :'+_linketcc);

        }
    });
    var busquedaSub = function (_link) {
        google('blindspot S02E01 720p site:subdivx.com', function (err, res) {
            if(err) console.log('error: '+err);
            var _linkSub = res.links[0]; //primero test
            console.log('google sub:'+_linkSub.title);
            console.log('link sub:'+_linkSub.href);
            request(_linkSub.href, function (error, response, html) {
                if(!error){
                    var $ = cheerio.load(html);
                    $('#contenedor_izq').filter(function () {
                        var data = $(this);
                        $('#buscador_detalle_sub').filter(function () {
                            var data_in = $(this);
                            var _linkSubDownload = data_in.children();
                        });
                    });
                }
            });
        });
    };
    res.send('ok');
});

app.listen('3000');
console.log('Server port: 3000');

exports = module.exports = app;
