/**
 * Server 로 요청이 왔을 때,최초 Page를 설정한다.
 * 여기는 /app.js 에서 정의된 routes 정의 File 이다.
 * node 쪽으로 http request 가 들어오면, express 앱이 routes 설정을 읽어서,
 * 어떤 요청이냐에 따라, 결과를 보내준다.
 * 메인 / 요청인 경우, 아래 정의된 html 파일을 response 에 실어 보낸다.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'../public/index.html'));
});

module.exports = router;
