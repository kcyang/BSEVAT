/**
 * Model Helper 를 호출하는 곳.
 * KEY 값을 받아서, 해당 모델 값을 셋팅하는 Module 의 Object 를 Return 해준다.
 */


'use strict';

module.exports = function(VATKEY){
    return require('./'+VATKEY);
};

/*
exports.getVATModel = function(VATKEY,callback){

    if(VATKEY === null || typeof VATKEY === 'undefined'){
        console.error('Invalid parameter ['+VATKEY+']');
        callback(true,'Invalid parameter ['+VATKEY+']');
    }else{
        console.info('Call VAT Number ['+VATKEY+']');
        callback(false,require('./'+VATKEY));
    }
};
*/