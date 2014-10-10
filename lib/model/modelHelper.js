/**
 * Model Helper 를 호출하는 곳.
 * KEY 값을 받아서, 해당 모델 값을 셋팅하는 Module 의 Object 를 Return 해준다.
 */


'use strict';

module.exports = function(VATKEY){
    return require('./'+VATKEY);
};