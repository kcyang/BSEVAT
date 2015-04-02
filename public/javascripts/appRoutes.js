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
        // V101 - 일반 과세자 부가가치세 신고서
        .when('/V101', {
            templateUrl: 'views/V101.html',
            controller: 'V101Controller'
        })
        // V101 - 일반 과세자 부가가치세 신고서
        .when('/V101_2', {
            templateUrl: 'views/V101_2.html',
            controller: 'V101Controller'
        })
        // V153 - 공제받지 못할 매입세액
        .when('/V153', {
            templateUrl: 'views/V153.html',
            controller: 'V153Controller'
        })
        // V104 - 매출처 세금계산서 합계표
        .when('/V104', {
            templateUrl: 'views/V104.html',
            controller: 'V104Controller'
        })
        // V104-1 - 매출처 계산서 합계표
        .when('/V104-1', {
            templateUrl: 'views/V104-1.html',
            controller: 'V104-1Controller'
        })
        // V105 - 매입처 세금계산서 합계표
        .when('/V105', {
            templateUrl: 'views/V105.html',
            controller: 'V105Controller'
        })
        // V105-1 - 매입처 계산서 합계표
        .when('/V105-1', {
            templateUrl: 'views/V105-1.html',
            controller: 'V105-1Controller'
        })
        // V106 - 영세율첨부서류명세서
        .when('/V106', {
            templateUrl: 'views/V106.html',
            controller: 'V106Controller'
        })
        // V112 - 대손세액공제(변제)신고서
        .when('/V112', {
            templateUrl: 'views/V112.html',
            controller: 'V112Controller'
        })
        // V141 - 수출실적명세서
        .when('/V141', {
            templateUrl: 'views/V141.html',
            controller: 'V141Controller'
        })
        // V149 - 건물등감가상각자산취득명세서
        .when('/V149', {
            templateUrl: 'views/V149.html',
            controller: 'V149Controller'
        })
        // V164 - 신용카드매출전표등수취명세서
        .when('/V164', {
            templateUrl: 'views/V164.html',
            controller: 'V164Controller'
        })
        // V174 - 내국신용장.구매확인서 전자발급명세서
        .when('/V174', {
            templateUrl: 'views/V174.html',
            controller: 'V174Controller'
        })
        // V177 - 영세율매출명세서
        .when('/V177', {
            templateUrl: 'views/V177.html',
            controller: 'V177Controller'
        })
        // V117
        .when('/V117', {
            templateUrl: 'views/V117.html',
            controller: 'V117Controller'
        });
    $locationProvider.html5Mode(true);

}]);