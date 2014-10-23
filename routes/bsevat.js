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

// 뭔가 의미 없는 Function,
router.get('/', function(req, res) {
    res.send('[GET] 넌 지금 삽질한 거야..');
});

//가져오는 요청처리  SELECT
router.get('/:KEY', function(req, res) {

//    console.log('ROUTER [GET] KEY['+req.params.KEY+']');
    console.error('ROUTER [GET] KEY['+req.query.VATKEY+']');

    if(req.params.KEY === null) {

        res.json('ERROR');

    }else{

        main.get({KEY:req.params.KEY,VATKEY:req.query.VATKEY},function(err,data){
            if(err){
                res.send('ERROR');
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
/*
                //res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader("Content-Disposition", "attachment;");
                var fileStream = fs.createReadStream(excelpath);
                fileStream.pipe(res);
*/
                console.log('엑셀은 여기에서 다운로드 됩니다...>>>> '+excelpath);

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

//삭제 요청 처리  DELETE
router.delete('/:KEY', function(req, res) {
    res.send('[DELETE]DELETE 퐁퐁퐁['+req.params.KEY+']');
});


module.exports = router;