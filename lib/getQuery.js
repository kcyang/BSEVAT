'use strict';

//config file을 읽어오기 위한 것
var query_config = require('../lib/getConfig.js');

//object validation check 를 위한 값 선언.
//var JsonObjectConstructor = {}.constructor; //#1002 --REMOVE

//결과 값 전송을 위한 json object 선언.
var message = {
    error : 'false',
    msg : ''
};

//json object 에 값을 넣기 위한 function.
function setMessage(error,desc){
    message.error = error;
    message.msg = desc;
}

//callback function 만들기.
exports.query = function(VAT_NO,/*CONFIG,*/callback){

    console.info('[INFO] getQuery.js Function Start!!');

    if(VAT_NO === null || typeof VAT_NO === 'undefined' || typeof VAT_NO !== 'string'){

        setMessage(true,'[ERROR] Parameter VAT_NO is invalid ['+VAT_NO+']');
        console.error(message.msg);
        callback(message.error,message);

    }/*  #1002 --REMOVE
    else if(CONFIG === null || typeof CONFIG === 'undefined' || CONFIG.constructor !== JsonObjectConstructor){

        setMessage(true,'[ERROR] Parameter CONFIG is invalid ['+CONFIG+']');
        console.error(message.msg);
        callback(message.error,message);

    }*/
    else{ //Parameter is OK!!

        var company_name = serverConfig.servers.nav.company;
        var vat_table_name = serverConfig.servers.nav.vat_table;

        query_config.toml(VAT_NO,function(err,config_string){

            if(err){ //err일 때,

                console.error('Can\'t load config file['+err+']');
                callback(true,config_string);

            }else{   //성공적으로 config 파일을 잘 읽어오면,

                if(typeof config_string === 'undefined'){
                    // 받은 결과값이 이상한겨.
                    console.error('Config result has something wrong!!');
                    callback(true,'Wrong Object from getConfig.js');
                }else{
                    //다 잘 받아온겨
                    console.info('Successfully fetch the config file information!!');

                    var json_string = JSON.parse(config_string);

                    //console.info('Entries >>> '+json_string.V164.Entries);

                    var entries = json_string[VAT_NO].Entries;
                    var conditions = json_string[VAT_NO].Condition;

                    var entries_string = '';

                    for(var i in entries){
                        if(i !== '0') {
                            entries_string += ',\n';
                        }
                        entries_string += '[';
                        entries_string += entries[i];
                        entries_string += ']';
                    }

                    var condition_string = '';
                    for(var condition_array in conditions){

                        var key_value = conditions[condition_array];

                        if(condition_array !== '0'){
                            condition_string += ' AND ';
                        }

                        condition_string += '[';
                        condition_string += key_value.key;
                        condition_string += ']';


                        //조건이 여러개인 경우
                        if(key_value.value.length > 1){
                            condition_string += ' IN ( ';
                            for(var val_i in key_value.value){
                                if(val_i !== '0'){
                                    condition_string += ',';
                                }
                                if(key_value.value_type === 'String') {
                                    condition_string += '\"';
                                }

                                condition_string += key_value.value[val_i];

                                if(key_value.value_type === 'String') {
                                    condition_string += '\"';
                                }
                            }
                            condition_string += ' )';
                        }else{//조건이 하나인 경우
                            condition_string += ' = ';

                            if(key_value.value_type === 'String') {
                                condition_string += '\"';
                            }
                            condition_string += key_value.value;

                            if(key_value.value_type === 'String') {
                                condition_string += '\"';
                            }
                        }
                    }
    //                console.log('조건문에 대한 결과 >>'+condition_string);

                    var query_string = '';

                    query_string += 'SELECT ';
                    query_string += entries_string;
                    query_string += ' FROM [';
                    query_string += company_name +'$';
                    query_string += vat_table_name +'] ';
                    query_string += ' WHERE ';
                    query_string += condition_string;
    //                console.log('결과 쿼리 >>'+query_string);
                    callback(false,query_string);
                }

                console.log('[INFO] getQuery.js Function End!!');

            }
        });
    }
};