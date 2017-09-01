//https://ansuchan.com/nodejs-web-crawling-with-cheerio/

var express = require('express');
var router = express.Router();

//(s)crawlling
var cheerio = require('cheerio');  
var request = require('request');
//(e)crawlling

var url = 'http://www.naver.com';  

/* GET users listing. */
router.get('/', function(req, res, next) {
    
    request(url, function(error, response, html){  
        if (error) {console.log(error) };
        var $ = cheerio.load(html);
   
        var parseDt = "";
        $('#news_cast').each(function(){
           parseDt = $(this).text(); 
            

        });
        
        //res.send(parseDt);
        res.send($('#news_cast').html());
        
    });

  
});


module.exports = router;
