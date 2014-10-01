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
var express = require('express');
var router = express.Router();

//Main Functions,
var main = require('../lib/execRequests');


/* GET home page. */
// 아래 url은 http://localhost:3000/api/ 임.

// 뭔가 의미 없는 Function,
router.get('/', function(req, res) {
    res.send('[GET] without KEY 퐁퐁퐁');
});

//가져오는 요청처리  SELECT
router.get('/:KEY', function(req, res) {

    console.log('ROUTER [GET] KEY['+req.params.KEY+']');

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.get({VATKEY:req.params.KEY},function(err,data){
            if(err){
                res.send('ERROR');
            }else{
                res.json(data);
            }
        });
    }
});

//업데이트 요청 처리  UPDATE
router.put('/:KEY', function(req, res) {
    res.send('[PUT]UPDATE 퐁퐁퐁['+req.params.KEY+']');
});

//생성 요청 처리  INSERT
router.post('/:KEY', function(req, res) {

    console.log('ROUTER [POST]/CREATE KEY['+req.params.KEY+']');

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.post({VATKEY:req.params.KEY},function(err,data){
            if(err){
                res.send('ERROR from Main function,');
            }else{
                res.json(data);
            }
        });
    }

});

//삭제 요청 처리  DELETE
router.delete('/:KEY', function(req, res) {
    res.send('[DELETE]DELETE 퐁퐁퐁['+req.params.KEY+']');
});


module.exports = router;