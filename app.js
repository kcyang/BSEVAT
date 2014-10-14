/**
 * 서버를 정의하는 곳. Express.js 의 각종 설정 값들을 이곳에서 정의한다.
 * BACKEND 를 정의한다. FRONT 쪽과 헤깔리지 않도록 유의해야 한다.
 * 아래에 정의된 URL 셋팅등은 모두 nodejs 의 것을 따르고 FRONT 의 Angularjs 와 다르다.
 */
'use strict';
//서버 설정파일 읽어놓기. Global 변수 .
global.serverConfig = require('./config/Server');
global.models = require('./models');
var mongoose = require('mongoose');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//CORS 모듈 로딩.
var cors = require('cors');

//generator 가 생성한 샘플 routes,
var routes = require('./routes/index');

//bsevat 라우트 파일 정의.
var bse_routes = require('./routes/bsevat');

var app = express();

//#TODO Mongoose 관련 내용은 추 후 또 정리
mongoose.connect('mongodb://localhost/test');

//CORS 기능 셋업. (로컬에서 XHR - Cross Http Requests 가능하게)
//이는 로컬에서 AngularJS client 에서 express restful api 를 호출이 가능하게 하기 위함이다.
app.use(cors());


app.set('views',path.join(__dirname,'/public/views'));
app.set('view engine','jade');

//기타 기본 express 기능 셋업.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));

//generator 가 만들어준 기본 routes
app.use('/', routes);

//VAT RestFul URL 기본 Base URL 정의.
app.use('/api', bse_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//Monitoring


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('ERROR['+err.message+']');
/*
        res.render('error', {
            message: err.message,
            error: err
        });
*/
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('ERROR['+err.message+']');
/*
    res.render('error', {
        message: err.message,
        error: {}
    });
*/
});


module.exports = app;
