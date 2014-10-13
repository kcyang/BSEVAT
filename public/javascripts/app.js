/**
 * This is for angular application
 * 여기는 Angular 모듈을 등록하는 곳임.
 * 만들어 놓은 모듈을 모두 여기서 등록해야 함.
 * FRONT 의 Main 정의는 이곳에서 진행된다.
 *
 */
'use strict';
var INIT_YEAR = 2014;  // #TODO
/* global angular */
angular.module('BSEVATApp',
    [
        'ngRoute',
        'ngDialog',
        'appRoutes',
        'VATMainCtrl',
        'V117Ctrl',
        'dialogCtrl',
        'VATService'
    ])
    .run(function($rootScope,$log){

        //초기에 실행할 초기 이벤트나 값 초기화 셋업 등등을 실행한다.
        //VAT 모든 영역에서 사용할 VAT Key를 셋업한다.
        $rootScope.VATROOTKEY = [{
            YEAR:'',
            VATQT:'',
            VATTYPE:'',
            VATNO:''
        }];

        //키값을 셋하는 펑션 // 값이 변하면, 모든 놈들에게 바뀌었다고 때린다.
        $rootScope.setKey = function(key){

            if(typeof key === 'undefined' || key === null) {return;}

            for (var keyitem in key){
                $log.info('키값들>>>'+keyitem);
                if(key.hasOwnProperty(keyitem)){
                    $rootScope.VATROOTKEY[0][keyitem] = key[keyitem];
                }
            }
            $rootScope.$broadcast('changeKey',$rootScope.VATROOTKEY[0]);
        };

        //부가세번호만 셋하는 Function, 마찬가지로 바뀐 값에 대해서 Broadcasting 한다.
        $rootScope.setVATKey = function(VATNO){
            $rootScope.VATROOTKEY[0].VATNO = VATNO;
            $rootScope.$broadcast('changeKey',$rootScope.VATROOTKEY[0]);
        };

        //어차피 rootScope 면 언제든 값을 가져올 수는 있지만,
        //용도에 맞게 getter 를 셋업해 놓은 것이다.
        $rootScope.getKey = function(){
            return $rootScope.VATROOTKEY[0];
        };

    })
    .controller('VATMainController',['$rootScope','$scope',function($rootScope,$scope){

        //세부/하부 화면과 별도로 글로벌하게 컨트롤 할 것들에 대한 정의.

        //년도/분기/신고형태에 따라서 초기화를 해준다.
        //나중에 이 부분은 config 파일에서 읽어서 초기화하도록 변경할 것. @TODO
        var today = new Date();

        var curr_year = today.getFullYear();
        var curr_month = today.getMonth()+1;

        var year_options = [];
        var vatqt_options = [
            {name: '1기 예정', value: '11'},
            {name: '1기 확정', value: '12'},
            {name: '2기 예정', value: '21'},
            {name: '2기 확정', value: '22'}
        ];
        var vattype_options = [
            {name: '정기신고', value: '01'},
            {name: '기한후신고', value: '02'},
            {name: '수정신고', value: '03'}
        ];
        var selectedYear = {};
        var selectedVatqt = {};

        for(var i = 0 ; i < 6 ; i++){
            var year_item = {};
            year_item.name = INIT_YEAR+i;
            year_item.value = INIT_YEAR+i;
            if(year_item.name === curr_year) {selectedYear = year_item;}
            year_options.push(year_item);
        }

        if(curr_month > 1 && curr_month < 4){
            selectedVatqt = vatqt_options[0];
        }else if(curr_month > 3 && curr_month < 7){
            selectedVatqt = vatqt_options[1];
        }else if(curr_month > 6 && curr_month < 10){
            selectedVatqt = vatqt_options[2];
        }else if(curr_month > 9 && curr_month <= 12){
            selectedVatqt = vatqt_options[3];
        }

        //프로그램 내부의 값에 넣어주기.
        $scope.years = year_options;
        $scope.vatqts = vatqt_options;
        $scope.vattypes = vattype_options;

        //화면에 셋업하기.
        $scope.YEAR = selectedYear;
        $scope.VATQT = selectedVatqt;
        $scope.VATTYPE = vattype_options[0];

        //키값을 업데이트 // 화면상에 업데이트.
        $scope.updateVATKey = function(){
            $scope.vatmessage = $scope.YEAR.name + '년 '+ $scope.VATQT.name+ ' '+$scope.VATTYPE.name;
            $scope.setKey({YEAR: $scope.YEAR.value, VATQT: $scope.VATQT.value , VATTYPE: $scope.VATTYPE.value});
        };
        $scope.updateVATKey();
    }]);