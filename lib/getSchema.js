'use strict';
var path = require('path');
//TOML 형식의 데이터를 읽기위한 모듈로딩..
var toml = require('toml');
var mongoose = require('mongoose');
//파일을 읽기위한 FileSystem 모듈로딩 (기본 Node 모듈임)
var fs  = require('fs');

function getConfig(filename){
    var toml_file = path.join(__dirname,'../config/'+filename+'.toml');
    console.log('file directory'+toml_file);

    try{
        var data = fs.readFileSync(toml_file,'utf8');
        var parsed = toml.parse(data);
        return JSON.stringify(parsed);
    }catch(e){
        throw e;
    }
}

var typeMappings  ={
    "String":String,
    "Number":Number,
    "Boolean":Boolean,
    "ObjectId":mongoose.Schema.ObjectId,
    "Date":Date
    //....etc
};

function makeSchema(jsonSchema){

    var outputSchemaDef = {};

    for(var fieldName in jsonSchema){

        var field = jsonSchema[fieldName];

        if( field.length > 2){

            var outputSchemaDefSub = {};

            for(var sub_filedName in field){

                var sub_fieldType = field[sub_filedName];

                if(typeMappings[sub_fieldType[1]]){
                    outputSchemaDefSub[sub_fieldType[0]] = typeMappings[sub_fieldType[1]];
                }else{
                    console.error("invalid type specified:", sub_fieldType);
                }
            }

            var sub_schema = new mongoose.Schema(outputSchemaDefSub);
            outputSchemaDef['SUB'] = [sub_schema];

        }else{
            var fieldType = field[1];

            if(typeMappings[fieldType]){
                outputSchemaDef[field[0]] = typeMappings[fieldType];
            }else{
                console.error("invalid type specified:", fieldType);
            }
        }

    }
    return new mongoose.Schema(outputSchemaDef);
}

var modelHelper = function(VAT_NO){

    var configString = getConfig(VAT_NO);

    if(configString == null){ //err일 때,
        console.error('Can\'t load config file['+VAT_NO+']');
        return null;
        //callback(true,config_string);
    }else {   //성공적으로 config 파일을 잘 읽어오면,
        if(typeof configString === 'undefined'){
            // 받은 결과값이 이상한겨.
            console.error('Config result has something wrong!!');
            return null;
            //callback(true,'Wrong Object from getConfig.js');

        }else {
            //다 잘 받아온겨
            console.info('설정파일을 잘 읽었고, 읽은 정보를 가지고 스키마를 만듦니다.');
            var json_string = JSON.parse(configString);

            return makeSchema(json_string[VAT_NO].schema);

        }
    }
};

module.exports = modelHelper;
