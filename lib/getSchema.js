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
    var keyRef = {};

    for(var fieldName in jsonSchema){

        var field = jsonSchema[fieldName];

        if( field.length > 3){  //#TODO 필드값 말고 체크할 기준을 찾아서 수정할 것. 2014-10-13

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

            if(field[2] !== undefined){
                console.error('키 값이 정의되었습니다.[%s][%s]',field[2],field[0]);
                keyRef[field[0]] = 1;
            }
        }

    }

    var resultSchema = new mongoose.Schema(outputSchemaDef,{_id: false});

    // Key 값을 넣어주기 위한 //
//    if(keyRef.length > 0){
        resultSchema.index(keyRef,{unique:true});
//    }

    return resultSchema;
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
        }else {
            //다 잘 받아온겨
            console.info('설정파일을 잘 읽었고, 읽은 정보를 가지고 스키마를 만듦니다.');
            var json_string = JSON.parse(configString);

            return makeSchema(json_string[VAT_NO].schema);

        }
    }
};

module.exports = modelHelper;
