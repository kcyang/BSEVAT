'use strict';
var mongoose = require('mongoose');
//config file 을 읽어오기 위한 것
var query_config = require('../lib/getConfig.js');

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

exports.makeMSchema = function(VAT_NO,callback){
    console.info('[INFO] createSchema.js Function Start!!');

    query_config.toml(VAT_NO,function(err,config_string){

        if(err){ //err일 때,
            console.error('Can\'t load config file['+err+']');
            callback(true,config_string);
        }else {   //성공적으로 config 파일을 잘 읽어오면,
            if(typeof config_string === 'undefined'){
                // 받은 결과값이 이상한겨.
                console.error('Config result has something wrong!!');
                callback(true,'Wrong Object from getConfig.js');

            }else {
                //다 잘 받아온겨
                console.info('Successfully fetch the config file information!!');

                var json_string = JSON.parse(config_string);

                callback(false,makeSchema(json_string[VAT_NO].schema));

            }
        }

    });
};

