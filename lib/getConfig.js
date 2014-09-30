/*
 * 
 * user/repo
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

'use strict';
//TOML 형식의 데이터를 읽기위한 모듈로딩..
var toml = require('toml');
var path = require('path');
//파일을 읽기위한 FileSystem 모듈로딩 (기본 Node 모듈임)
var fs  = require('fs');

//Stream 으로 파일을 읽기 위한 모듈로딩
var concat = require('concat-stream');

exports.toml = function(filename,callback){
//file system 에서 스트림을 생성하고, 해당 파일을 utf8로 읽어서 읽은 내용을 data변수에
//집어넣어준다.
    console.log('[INFO] getConfig.js Function Start!!!');
//    var toml_file = '../config/'+filename+'.toml';
    var toml_file = path.join(__dirname,'../config/'+filename+'.toml');
    console.log('file directory'+toml_file);

    fs.createReadStream(toml_file, 'utf8').pipe(concat(function (data) {
        //toml 모듈로 읽은 데이터를 파싱하고 결과물을 JSON 개체인 parsed 로 받는다.
        try {
            var parsed = toml.parse(data);
            console.log('parsed!!!!!');
            callback(false,JSON.stringify(parsed));
        }catch(e){
            console.error("PARSING ERROR LINE: "+e.line);
            console.error("PARSING ERROR COLUMN :"+e.column);
            console.error("PARSING ERROR INFO :"+ e);
            callback(true, e.message);
        }
        //데이터를 활용한다.
    }));
    console.log('[INFO] getConfig.js Function End!!!');
};
