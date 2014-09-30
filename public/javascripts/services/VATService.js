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

        // call to get all nerds
        get : function(KEY,callback) {

            $http({method: 'GET', url: '/api/'+KEY}).
                success(function(data,status,headers,config){
                    $log.info('성공적으로 URL로 부터 결과를 받았습니다.');
                    if(data === 'ERROR'){
                        callback(true,data);
                    }else{
                        callback(false,data);
                    }
            }).
                error(function(data,status,headers,config){
                    $log.error('통신 에러가 났습니다.[HTTP]');
                    callback(true,data);

            });
        },

        // call to POST and create a new geek
        create : function(KEY,callback) {

            $http({method: 'POST', url: '/api/'+KEY}).
                success(function(data,status,headers,config){
                    $log.info('성공적으로 URL로 부터 결과를 받았습니다.');
                    $log.info(data);
                    callback(false,data);

                }).
                error(function(data,status,headers,config){
                    $log.error('통신 에러가 났습니다.[HTTP]');
                    $log.error(data);
                    callback(true,data);

                });

        },

        // call to POST and create a new geek
        update : function(KEY,callback) {

            $http({method: 'PUT', url: '/api/'+KEY}).
                success(function(data,status,headers,config){
                    $log.info('성공적으로 URL로 부터 결과를 받았습니다.');
                    $log.info(data);
                    callback(false,data);

                }).
                error(function(data,status,headers,config){
                    $log.error('통신 에러가 났습니다.[HTTP]');
                    $log.error(data);
                    callback(true,data);

                });

        }

    };

}]);