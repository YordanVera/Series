var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

    url = 'http://www.imdb.com/title/tt1229340/';

    request(url, function (error, response, html) {
        if(!error){
            
            var $ = cheerio.load(html);
            var title, release, rating;
            var json = {title : "", release : "", rating: ""};

            $('.title_bar_wrapper').filter(function(){
                var data = $(this);
                var divs = data.children().find("div");
                title = divs[9]['children'][1]['children'][0].data;
                json.title = title;
            });
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

            console.log('File successfully written! - Check your project directory for the output.json file');

        });
    });



    res.send('Check your console!');

});

app.listen('3000');
console.log('Server port: 3000');

exports = module.exports = app;