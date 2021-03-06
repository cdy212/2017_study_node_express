var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var bbs = require('./routes/api/bbs'); // extends the javascript file path

var mobile_main = require('./routes/mobile/main'); //20170922 모바일


// view engine setup
var ECT = require('ect'); //add ect
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' }); //add ect
var app = express();

// view engine setup
app.engine('ect', ectRenderer.render); //modified ect
app.set('view engine', 'ect'); //modified ect

var mysql = require('mysql');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', index);
app.use('/users', users);

app.use('/api/bbs', bbs);
app.use('/mobile/main', mobile_main);//20170922 모바일


/*
//TODO : 환경설정 파일로 읽어 들이기 - 귀찮다.
var dbConnection = mysql.createConnection({   
host: 'chleedb.cpv7fosc6pfp.us-west-2.rds.amazonaws.com', 
    user: 'chlee',   
     port: 3306,
    password: 'data1234',   
    database: 'test' ,
                   });


//커넥션 테스트 작업 : 지워도 됨
dbConnection.query('select 1', [111],function (err, rows, fields) {
    console.log(err);
    if(err){
      console.log(err);
      return ;
    }
    console.log("connection test===============");
    console.log(rows);
    console.log("connection test===============");
});
*/

/** Packing the Response-JSON-Data */
var formatter = require('./routes/formatter');
global.jsonCapsule = formatter.jsonCapsule; // json formatter
global.jsonpCapsule = formatter.jsonpCapsule; // jsonp formatter



/** mssql connection*/
//global config
global._db_ajis  ={
    user: 'cdy',
    password: 'lee21137',
    server: 'localhost', 
    database: 'ajis',
}

global._db_crewing  ={
    user: 'cdy',
    password: 'lee21137',
    server: 'localhost',
    database: 'crewing',
}

global._db_ajisIntra = {
    user: 'cdy',
    password: 'lee21137',
    server: 'localhost', 
    database: 'ajisIntra',
}

/** mysql connection pool */
global.dbpool = mysql.createPool({ 
host: 'chleedb.cpv7fosc6pfp.us-west-2.rds.amazonaws.com', 
    user: 'chlee',   
     port: 3306,
    password: 'data1234',   
    database: 'test' ,
    connectionLimit: 100,
    connectTimeout: 30000
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
