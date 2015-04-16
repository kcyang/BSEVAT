/**
 * 서버와 통신 하거나, 다른 시스템과 통신을 위한 기능을 정의한다.
 *
 * $http 웹서비스 호출을 위한 모듈
 * $log 클라이언트 콘솔에 찍어주기 위한 객체임.
 *
 */
'use strict';
/* global angular */
angular.module('VATService', []).factory('VATService', ['$http','$log', function($http,$log) {

    return {

        // call to get
        get : function(VATROOTKEY,callback) {

            var KEY = VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+VATROOTKEY.VATNO+VATROOTKEY.VATCP;

            $log.info('GET>>> 요청 값 [%s]',KEY);
            $log.info('GET>>> /api/%s',VATROOTKEY.VATNO);

            $http({method: 'GET', url: '/api/'+VATROOTKEY.VATNO, params: {VATKEY: KEY}}).
                success(function(data,status/*,headers,config*/){
                    $log.info('[GET] 성공적으로 URL 로 부터 결과를 받았습니다.[%s][%s]',status,data);
                    if(data === 'ERROR'){
                        callback(true,data);
                    }else{
                        callback(false,data);
                    }
            }).
                error(function(data,status/*,headers,config*/){
                    $log.error('통신 에러가 났습니다.[%s]',status);
                    callback(true,data);

            });
        },

        getCompany : function(callback) {


            $http({method: 'GET', url: '/api/'}).
                success(function(data,status/*,headers,config*/){
                    $log.info('[GET] 성공적으로 URL 로 부터 결과를 받았습니다.[%s]',status);
                    if(data === 'ERROR'){
                        callback(true,data);
                    }else{
                        callback(false,data);
                    }
                }).
                error(function(data,status/*,headers,config*/){
                    $log.error('통신 에러가 났습니다.[%s]',status);
                    callback(true,data);

                });
        },

        getList : function(callback) {

            $http({method: 'GET', url: '/api/list/XXXX'}).
                success(function(data,status/*,headers,config*/){
                    $log.info('[GET] 성공적으로 URL 로 부터 결과를 받았습니다.[%s]',status);
                    if(data === 'ERROR'){
                        callback(true,data);
                    }else{
                        callback(false,data);
                    }
                }).
                error(function(data,status/*,headers,config*/){
                    $log.error('통신 에러가 났습니다.[%s]',status);
                    callback(true,data);

                });
        },

        // 엑셀 다운로드 기능.
        excel : function(VATROOTKEY,callback) {
            /**
             * 엑셀을 서버로부터 받아올 때, responseType 을 꼭 'blob' 로 지정해야 한다.
             * 이는 3일간의 삽질의 결과임.
             * 그렇지 않으면, 다른 형태로 Encoding 된 결과물을 받아보게 된다.
             * Internet Explorer / Chrome 에서 동작 확인완료.
             */

            $http({method: 'GET', url: '/api/XLS/'+VATROOTKEY.VATNO, responseType: 'blob', params: VATROOTKEY}).
                success(function(data/*,status*/){
/*
                    var element = angular.element('<a/>');
                    element.attr({
                        href: 'data:attachment/vnd.ms-excel,'+ data,
                        target: '_blank',
                        download: VATROOTKEY.VATNO+'.xlsx'
                    })[0].click();
*/
                    $log.info('[GET] URL 로 부터 결과를 받았습니다.');

                    if(data === 'ERROR'){
                        callback(true,data);
                    }else{
                        callback(false,data);
                    }
                }).
                error(function(data,status){
                    $log.error('통신 에러가 났습니다.[%s]',status);
                    callback(true,data);
                });
        },
        /**
         * 신규 데이터를 생성하는 Call
         * @param KEY 조회 값?
         * @param VATROOTKEY 입력하기 위한 키값.
         * @param callback 콜백 함수
         */
        create : function(KEY,VATROOTKEY,callback) {
$log.info('VAT ROOT KEY >>> '+VATROOTKEY);
            $http({method: 'POST', url: '/api/'+KEY, data: VATROOTKEY}).
                success(function(data/*,status,headers,config*/){
                    $log.info('성공적으로 URL 로 부터 결과를 받았습니다.');
                    $log.info(data);
                    callback(false,data);

                }).
                error(function(data/*,status,headers,config*/){
                    $log.error('통신 에러가 났습니다.[HTTP]');
                    $log.error(data);
                    callback(true,data);

                });

        },

        // call to POST and create a new geek
        update : function(KEY,mg,callback) {

            $http({method: 'PUT', url: '/api/'+KEY, data: mg}).
                success(function(data/*,status,headers,config*/){
                    $log.info('성공적으로 URL로 부터 결과를 받았습니다.');
                    $log.info(data);

                    if(data === '0'){
                        callback(true,data);
                    }else{
                        callback(false,data);
                    }

                }).
                error(function(data/*,status,headers,config*/){
                    $log.error('통신 에러가 났습니다.[HTTP]');
                    $log.error(data);
                    callback(true,data);

                });

        }

    };

}]);