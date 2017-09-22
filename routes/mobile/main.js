var http = require('http');
var mssql = require('mssql');
var express = require('express');
var bodyPaser = require('body-parser');

var router = express.Router();

var app = express();
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended: true}));

router.get('/', function (req, res) {

	res.render('mobile/main.ect',{title:"AJIS Mobile"});

});

//http://localhost:8080/mobile/main/img_view
router.get('/img_view', function (req, res) {
	res.render('mobile/img_view.ect',{title:"AJIS Mobile"});

});


module.exports = router;


