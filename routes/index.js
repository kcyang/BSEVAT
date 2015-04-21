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
var mongoose = require('mongoose');

/**
 * 첫 VAT 시작될 때 Navision 상의 Company 를 Parameter 로 받는다.
 * 받은 Company Name 을, Global Company Name 으로 지정한다.
 * 이 이름으로 Mongo Instance 를 지정한다.
 */
router.get('/RUN', function(req, res) {
console.log('START VAT Application!!!!!');

    var company_name = req.query.COMPANY;
    global.companyname = company_name;
    var mongoURI = '';

    console.log('Company Name :: %s', global.companyname);

    /**
     * 기본 URI를 정의한다.
     * company 이름을 넣는 경우에는 자동으로, 그걸 넣고 없으면, Config 에 있는 instance 명을 넣는다.
     */
    if(company_name == null || company_name == ''){
        console.error('Company name has not been defined!');
        mongoURI = 'mongodb://'+serverConfig.servers.mongo.ip+'/'+serverConfig.servers.mongo.instance;
    }else{
        //Company 이름을 받으면, 숫자영문자를 제외한 모든 것을 삭제한다.
        company_name = company_name.replace(/[^a-z|^A-Z|^0-9]/gi,'');
        mongoURI = 'mongodb://'+serverConfig.servers.mongo.ip+'/'+company_name;
    }

    console.error('Mongo Connection State >> %s',mongoose.connection.readyState);

    /**
     * 현재 Connection 이 있는 경우, 그 Connection 을 끊고 새로 Connection 을 맺는다.
     */
    if(mongoose.connection.readyState === 1){
        mongoose.disconnect();
        mongoose.connect(mongoURI,{server: { poolSize: 3 }});
    }else{
        mongoose.connect(mongoURI,{server: { poolSize: 3 }});
    }


    res.sendFile(path.join(__dirname,'../public/index.html'));
});

module.exports = router;
