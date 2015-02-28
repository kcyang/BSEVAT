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
exports.query = function(VAT_NO,VATROOTKEY,callback){

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
                    //여기 새로 Sub Query 를 위한 항목 추가. 20141111
                    var sub_condition = json_string[VAT_NO].Sub;

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
                    if (conditions !== undefined && conditions.length > 0) {
                        for (var condition_array in conditions) {

                            var key_value = conditions[condition_array];

//                            if (condition_array !== '0') {
                                condition_string += ' AND ';
//                            }

                            condition_string += '[';
                            condition_string += key_value.key;
                            condition_string += ']';


                            //조건이 여러개인 경우
//                        if(key_value.value.length > 1){
                            if (key_value.value.constructor.name === 'Array') {
                                condition_string += ' IN ( ';
                                for (var val_i in key_value.value) {
                                    if (val_i !== '0') {
                                        condition_string += ',';
                                    }
                                    if (key_value.value_type === 'String') {
                                        condition_string += '\'';
                                    }

                                    condition_string += key_value.value[val_i];

                                    if (key_value.value_type === 'String') {
                                        condition_string += '\'';
                                    }
                                }
                                condition_string += ' )';
                            } else {//조건이 하나인 경우
                                condition_string += ' = ';

                                if (key_value.value_type === 'String') {
                                    condition_string += '\'';
                                }
                                condition_string += key_value.value;

                                if (key_value.value_type === 'String') {
                                    condition_string += '\'';
                                }
                            }
                        }
                    }
                    /*
                     {name: '1기 예정', value: '11'},
                     {name: '1기 확정', value: '12'}, !!예정 누락분 포함.
                     {name: '2기 예정', value: '21'},
                     {name: '2기 확정', value: '22'}  !!예정 누락분 포함.
                     */
                    var date_string = '';
                    date_string += ' [BSE_VAT Date] BETWEEN \'';

                    if(VATROOTKEY.VATQT === '11'){
                        date_string += VATROOTKEY.YEAR+'-01-01\' AND \''+VATROOTKEY.YEAR+'-03-31\'';
                    }else if(VATROOTKEY.VATQT === '12'){
                        date_string += VATROOTKEY.YEAR+'-04-01\' AND \''+VATROOTKEY.YEAR+'-06-30\'';
                    }else if(VATROOTKEY.VATQT === '21'){
                        date_string += VATROOTKEY.YEAR+'-07-01\' AND \''+VATROOTKEY.YEAR+'-09-30\'';
                    }else if(VATROOTKEY.VATQT === '22'){
                        date_string += VATROOTKEY.YEAR+'-10-01\' AND \''+VATROOTKEY.YEAR+'-12-31\'';
                    }


                    var sub_string = '';
                    if (sub_condition !== undefined && sub_condition.length > 0) {

                        sub_string += ' AND ';
                        for(var sub_condition_array in sub_condition){
                            if(sub_condition.hasOwnProperty(sub_condition_array)){
                                var skey_value = sub_condition[sub_condition_array];
                                var queryString = skey_value.query;
                                sub_string += '[';
                                sub_string += skey_value.key;
                                sub_string += ']';

                                sub_string += ' IN ( ';
                                sub_string += queryString.replace('#Company',company_name);
                                sub_string += ' )';
                            }
                        }
                    }

                    if(VATROOTKEY === null || typeof VATROOTKEY === 'undefined'){
                        callback(true,'VATROOTKEY 가 넘어오지 못했거나 오류가 있습니다.');
                        return;
                    }


                    var query_string = '';

                    query_string += 'SELECT ';
                    query_string += entries_string;
                    query_string += ' FROM [';
                    query_string += company_name +'$';
                    query_string += vat_table_name +'] ';
                    query_string += ' WHERE ';
                    query_string += date_string+' ';
                    query_string += condition_string;
                    query_string += sub_string;

                    /**
                     *  예정신고 누락분 포함을 위한 쿼리 생성.
                     *  확정 신고시, 예정신고 분 포함.
                     *  #TODO 예정신고 누락분 중, 대상만 가져오도록 수정할 것.!!
                     */
                    if(VATROOTKEY.VATNO === 'V101' &&
                        (VATROOTKEY.VATQT === '12' || VATROOTKEY.VATQT === '22')) {

                        var sub_union = json_string[VAT_NO].UNION;

                        var union_query = '';

                        if (sub_union !== undefined && sub_union.length > 0) {
                            for(var union_condition_array in sub_union){
                                if(sub_union.hasOwnProperty(union_condition_array)){
                                    union_query = sub_union[union_condition_array].query;
                                }
                            }
                        }
                        var union_date = '';
                        union_date += ' [BSE_VAT Date] BETWEEN \'';
                        if(VATROOTKEY.VATQT === '12'){  //1기확정시, 1기예정 포함.
                            union_date += VATROOTKEY.YEAR+'-01-01\' AND \''+VATROOTKEY.YEAR+'-03-31\'';
                        }else if(VATROOTKEY.VATQT === '22'){  //2기확정시, 2기예정 포함.
                            union_date += VATROOTKEY.YEAR+'-07-01\' AND \''+VATROOTKEY.YEAR+'-09-30\'';
                        }

                        query_string += ' '+union_query;
                        query_string += ' FROM [';
                        query_string += company_name +'$';
                        query_string += vat_table_name +'] ';
                        query_string += ' WHERE ';
                        query_string += union_date;
                        query_string += condition_string;
                        query_string += sub_string;

                    }

                    console.log('결과 쿼리 >>'+query_string);

                    callback(false,query_string);
                }

                console.log('[INFO] getQuery.js Function End!!');

            }
        });
    }
};