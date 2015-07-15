/**
 * MSSQL 에서 값을 가져오는 Function. Stream 방식이 첫번 째 이고,
 * 하나 더는 한꺼번에 가져오는 방식이다. <-- dedicated
 */
'use strict';
var mssql = require('mssql');
var query_string = require('../lib/getQuery.js');

/**
*  Configuration 정보를 config 값에서 적어서 넣어 놓는다.
*  MSSQL 접속은 여기서만 하기 때문에, 여기서만 정의한다.
* */
var config = {
    user: serverConfig.servers.nav.user,
    password: serverConfig.servers.nav.password,
    server: serverConfig.servers.nav.ip,
    database: serverConfig.servers.nav.instance,

    options: {
        encrypt: false
    }
};

/**
 * Node 는 기본적으로 Stream 방식을 쓰도록 권장한다.
 * 모든 동작방식은 비동기를 기본으로 하므로,
 * 데이터 값은, Stream 으로 동작하도록 한다.
* */
var STREAM_STATUS = {
    START : '0',
    ERROR : '1',
    ON : '2',
    DONE : '3'
};

exports.list = function(callback){

    var connection = new mssql.Connection(config,function(err){
        if(err){
            console.error('QUERY ERROR');
            callback(true,err.code);
        }else{
            var request = new mssql.Request(connection);
            var query_str = 'select [BSE_Company Code] AS CODE, [BSE_Company Name] AS NAME from ['
                + global.companyname + '$B_VAT Company]';
            request.query(query_str,function(err,recordset){
                if(err) {
                    console.error('Query Error ...>>> %s',err.code);
                    callback(err.code);
                }else{
                    callback(recordset);
                }
            });
        }
    });
};

/**
 * 부가세 회사 정보를 가져오는 부분,
 * @param callback
 */
exports.getCompany = function(COMPANY_NAME,callback){

    var connection = new mssql.Connection(config,function(err){
        if(err){
            console.error('QUERY ERROR');
            callback(true,err.code);
        }else{
            var request = new mssql.Request(connection);
            var query_str = 'select * from ['
                + global.companyname + '$B_VAT Company] WHERE [BSE_Company Code] = \''+COMPANY_NAME+'\'';
/*            //for testing.
            var query_str = 'select * from ['
                + global.companyname + '$B_VAT Company] WHERE [BSE_Company Code] = \'BSE\'';
            //for testing end.
*/
            request.query(query_str,function(err,recordset){
                if(err) {
                    console.error('Query Error ...>>> %s',err.code);
                    callback(true,err.code);
                }else{
                    callback(false,recordset);
                }
            });
        }
    });
};


/**
 * exports function define,
 * 설정파일을 그때 그때 읽긴 하는데.. JSON 으로 바꿀까 생각중. #TODO
 * */
exports.exec = function(VAT_NO,VATROOTKEY,callback){

    query_string.query(VAT_NO,VATROOTKEY,function(err,query_string){
        if(err) {
            console.error('오류가 발생..'+query_string);
        }else {

            var connection = new mssql.Connection(config,function(err){

                if(err){
                    //error 종류에 따른 메시지 로깅을 넣을 것... (문제점 파악을 위함)
                    console.error('QUERY ERROR');
                    callback(true,err.code);

                }else{

                    var request = new mssql.Request(connection);

                    //stream mode on/off;
                    request.stream = true;

                    request.query(query_string);

                    //Emitted once for each recordset in a query
                    request.on('recordset',function(columns){
//                        console.log('RecordSet 을 가져왔습니다.'+columns);
                    });

                    // Emitted for each row in a recordset
                    request.on('row',function(row){
                        //console.log('한 줄을 가져왔습니다.'+JSON.stringify(row));
                        callback(false,STREAM_STATUS.ON,row);
                    });

                    // May be emitted multiple times
                    request.on('error',function(err){
                        console.error('에러가 났네요'+ err);
                        callback(false,STREAM_STATUS.ERROR,err);
                    });

                    // Always emitted as the last one
                    request.on('done',function(returnValue){
//                        console.log('끝!'+returnValue);
                        callback(false,STREAM_STATUS.DONE,returnValue);
                    });

                }
            });

        }
    });
};
