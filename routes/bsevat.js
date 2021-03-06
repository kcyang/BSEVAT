/**
 * [Expressjs]
 * RestFul API 를 받아들이는 것에 대한 정의이다.
 * 각 요청은 /app.js (BACKEND) 에서 /api 로 요청이 들어오면,
 * 아래 정의된 모듈에 따라 응답하게 된다.
 * 즉, http://localhost:3000/api 로 요청이 들어오면
 * 아래 정의된 요청 형식에 따라 응답을 하게 되는데,
 * http 정의에 따라, GET / POST / PUT / DELETE 요청을 받고,
 * 결과값을 보내준다. 결과는 HTML/JSON/ETC. 가 가능하다.
 */
'use strict';

//var fs = require('fs');
var express = require('express');
var router = express.Router();

//Main Functions,
var main = require('../lib/execRequests');


/* GET home page. */
// 아래 url은 http://localhost:3000/api/ 임.

// 기본, 회사정보를 내려 보내 줌.
router.get('/', function(req, res) {
    res.json(companyConfig);
});

//가져오는 요청처리  SELECT
router.get('/:KEY', function(req, res) {

//    console.log('ROUTER [GET] KEY['+req.params.KEY+']');
//    console.error('ROUTER [GET] KEY['+req.query.VATKEY+']');

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.get({KEY:req.params.KEY,VATKEY:req.query.VATKEY},function(err,data){
            if(err) {
                res.send('값이 없습니다. ERROR');
            }
            res.json(data);
        });
    }
});


//가져오는 요청처리  SELECT
router.delete('/:KEY', function(req, res) {

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.delete({KEY:req.params.KEY,VATKEY:req.query.VATKEY},function(err,data){
            if(err) {
                res.send('값이 없습니다. ERROR');
            }
            res.json(data);
        });
    }
});



/**
 * 목록을 요청하는 부분,
 */
router.get('/list/:KEY', function(req, res) {
    console.error('ROUTER [GET] REQ Company List');

    main.list(function(data){
        res.json(data);
    });

});

/**
 * 회사의 정보를 가져오는 부분,
 */
router.get('/co/:KEY', function(req, res) {
    if(req.params.KEY === null) {
        res.json('ERROR');
    }else{
        main.getCompany(req.params.KEY ,function(err,data){
            if(err) {
                res.status(status).send(err);
            }else{
                res.json(data);
            }
        });
    }
});

/**
 * Excel 을 내려받게 해주는 Function,
 * Header 설정하고, XLS 로 내려가게 한다.
 *
 */
router.get('/XLS/:KEY', function(req, res) {

    console.error('ROUTER [post::EXCEL] KEY['+ req.params.KEY +']');

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{
        main.excel({VATKEY:req.params.KEY}, /*req.body,*/req.query,function(err,excelpath){
            if(err){
                res.send('ERROR');
            }else{

                var options = {
                    headers: {
                        'x-timestamp' : Date.now(),
                        'x-sent' : true
                    }
                };
                res.sendFile(excelpath, options, function(err){
                    if(err){
                        console.error('엑셀을 다운로드 하는 중에 에러 발생..',err);
                    }else{
                        console.info('엑셀파일이 내려갔어야 하는데..');
                    }
                });
/*
                res.download(excelpath,req.params.KEY+'.xlsx',function(err){
                    if(err){
                        console.error('엑셀을 다운로드 하는 중에 에러 발생..',err);
                    }else{
                        console.info('엑셀파일이 내려갔어야 하는데..');
                    }
                });
*/
            }
        });
    }
});

//업데이트 요청 처리  UPDATE
router.put('/:KEY', function(req, res) {

    console.error('ROUTER [PUT] KEY['+req.body+']');

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.put({KEY:req.params.KEY},req.body,function(err,data){
            if(err){
                res.send('ERROR');
            }else{
                res.json(data);
            }
        });
    }
});

//생성 요청 처리  INSERT
router.post('/:KEY', function(req, res) {

    console.error('POST 요청을 받았습니다. KEY 값은 [%s]',req.body[0].VATNO);

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.post({VATKEY:req.params.KEY},req.body[0],function(err,data){
            if(err){
                res.send('ERROR from Main function,');
            }else{
                res.json(data);
            }
        });
    }

});


//파일 생성 요청 처리  INSERT
router.post('/FILE/:KEY', function(req, res) {

    //console.error('[파일생성] POST 요청을 받았습니다. KEY 값은 [%s]',req.body[0].VATNO);
    console.log(req.body);

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.makefile(req.body,function(err,data){
            if(err){
                res.send('ERROR from Main function,');
            }else{
                var options = {
                    headers: {
                        'x-timestamp' : Date.now(),
                        'x-sent' : true
                    }
                };
                res.sendFile(data, options, function(err){
                    if(err){
                        console.error('엑셀을 다운로드 하는 중에 에러 발생..',err);
                    }else{
                        console.info('엑셀파일이 내려갔어야 하는데..');
                    }
                });
            }
        });
    }

});


//삭제 요청 처리  DELETE
router.delete('/:KEY', function(req, res) {
    res.send('[DELETE]DELETE 퐁퐁퐁['+req.params.KEY+']');
});


module.exports = router;