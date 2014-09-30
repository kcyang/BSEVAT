/**
 * MSSQL 에서 값을 가져오는 Function. Stream 방식이 첫번 째 이고,
 * 하나 더는 한꺼번에 가져오는 방식이다.
 */
'use strict';

var mssql = require('mssql');

var config_string = require('../lib/getConfig.js');
var query_string = require('../lib/getQuery.js');

var config = {
    user: 'sa',
    password: 'bse0706!@#$',
    server: 'nav.bsecamp.net',
    database: 'VAT',

    options: {
        encrypt: false
    }
};

var STREAM_STATUS = {
    START : '0',
    ERROR : '1',
    ON : '2',
    DONE : '3'
};

exports.exec = function(VAT_NO,callback){

    config_string.toml('Server',function(err,json_string){
        if(err) {
            console.error('오류가 발생..'+json_string);
        }else {

            var result = JSON.parse(json_string);

            query_string.query(VAT_NO,result,function(err,query_string){
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
                                console.log('RecordSet 을 가져왔습니다.'+columns);
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
                                console.log('끝!'+returnValue);
                                callback(false,STREAM_STATUS.DONE,returnValue);
                            });

                        }
                    });

                }
            });

        }
    });

};


exports.execOne = function(VAT_NO,callback){

    config_string.toml('Server',function(err,json_string){
        if(err) {
            console.error('오류가 발생..'+json_string);
        }else {

            var result = JSON.parse(json_string);

            query_string.query(VAT_NO,result,function(err,query_string){
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

                             request.query(query_string,function(err,resultset){

                                 if(err){
                                     console.error('QUERY ERROR');
                                     callback(true,err.code);
                                 }else{
                                     console.log('Successfully fetched!!');
                                     callback(false,resultset);
                                 }

                             });
                        }
                    });

                }
            });

        }
    });

};

