/**
 * Created by KC on 2014-09-17.
 * This is for angular routes.
 * 여기서 클라이언트에서 올라오는 요청 URL 은 아래 내용을 참고하여 보이게 됨.
 * 여기서 해당 화면별로 하나씩 추가를 하면 됨.
 *
 */
'use strict';
/* global angular */
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider

    // home page
    .when('/', {
        templateUrl: 'views/vathome.html',
        controller: 'BSEVATController'
    })
    // V104 - 매출처 세금계산서 합계표
    .when('/V104', {
        templateUrl: 'views/V104.html',
        controller: 'V104Controller'
    })
    // V117
    .when('/V117', {
        templateUrl: 'views/V117.html',
        controller: 'V117Controller'
    });
/**
 * 여기 아래로 하나씩 추가할 것.
 * /
    // V117
    .when('/VXXX', {
        templateUrl: 'views/VXXX.html',
        controller: 'VXXXController'
    });
*/
    $locationProvider.html5Mode(true);

}]);