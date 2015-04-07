/**
 * This is for angular application
 * 여기는 Angular 모듈을 등록하는 곳임.
 * 만들어 놓은 모듈을 모두 여기서 등록해야 함.
 * FRONT 의 Main 정의는 이곳에서 진행된다.
 *
 */
'use strict';

var INIT_YEAR = 2014;
/* global angular */
angular.module('BSEVATApp',
    [
        'ngRoute',
        'ngDialog',
        'appRoutes',
        'angular-loading-bar',
        'VATMainCtrl',
        'V101Ctrl',
        'V117Ctrl',
        'V104Ctrl',
        'V153Ctrl',
        'V104-1Ctrl',
        'V105Ctrl',
        'V105-1Ctrl',
        'V106Ctrl',
        'V112Ctrl',
        'V141Ctrl',
        'V149Ctrl',
        'V164Ctrl',
        'V174Ctrl',
        'V177Ctrl',
        'dialogCtrl',
        'VATService',
        'ui.utils.masks'
    ])
    .run(function($rootScope,$log,VATService){

        //초기에 실행할 초기 이벤트나 값 초기화 셋업 등등을 실행한다.
        //VAT 모든 영역에서 사용할 VAT Key를 셋업한다.
        $rootScope.VATROOTKEY = [{
            YEAR:'',
            VATQT:'',
            VATTYPE:'',
            VATNO:'',
            VATCOMPANY:''
        }];
        $rootScope.VATCompany = [];
        /**
         * 회사 정보를 담아두는 JSON 선언,
         * @type {{}}
         */
        $rootScope.COMPANY = {};

        /**
         * 서버에서 기본 회사 정보를 가져옴.
         */
        VATService.getCompany(function(err,data){
            if(err) {
                $log.error(data);
            }else{
                $rootScope.COMPANY = data;
            }
        });

        /**
         * VAT Company 를 Navision 으로 부터 가져오는 부분,
         * #TODO 가져오는 부분은 되었으니까, 화면마다 넣는 걸 해야됨.2015-04-03
         */
        VATService.getList(function(err,data){
            if(err) throw err;

            for (var i in data){
                var company_ = {};
                if(data.hasOwnProperty(i)){
                    company_['value'] = data[i].CODE;
                    company_['name'] = data[i].NAME;
                    $rootScope.VATCompany.push(company_);
                }
            }
        });

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
    .controller('VATMainController',['$rootScope','$scope','$log',function($rootScope,$scope,$log){

        //세부/하부 화면과 별도로 글로벌하게 컨트롤 할 것들에 대한 정의.

        //년도/분기/신고형태에 따라서 초기화를 해준다.
        //나중에 이 부분은 config 파일에서 읽어서 초기화하도록 변경할 것. @TODO
        var today = new Date();

        var curr_year = today.getFullYear();
        var curr_month = today.getMonth()+1;

        var year_options = [];
        var company_options = $rootScope.VATCompany;

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

        /**
         * 연도를 자동 생성하는 곳.
         * 초기 셋업 연도를 기준으로 6년간 셋업하도록 설정.
         */
        for(var i = 0 ; i < 6 ; i++){
            var year_item = {};
            year_item.name = INIT_YEAR+i;
            year_item.value = INIT_YEAR+i;
            year_options.push(year_item);
        }

        if(curr_month >= 1 && curr_month < 4){
            //현재 월이, 1월에서 3월까지면, 전년도 신고임.
            var tmp_preyear = {};
            tmp_preyear.name = curr_year-1;
            tmp_preyear.value = curr_year-1;
            selectedYear = tmp_preyear;
        }else{
            //나머지는 현재 년도를 선택하도록 한다.
            selectedYear = year_item;
        }

        /**
         * 현재 날짜를 보고, 신고대상 분기를 디폴트로 선택하게 하는 곳.
         * 항상, 신고하는 달의 이전 분기를 선택하도록 하였음.
         */
        if(curr_month >= 1 && curr_month < 4){
            selectedVatqt = vatqt_options[3];
        }else if(curr_month > 3 && curr_month < 7){
            selectedVatqt = vatqt_options[0];
        }else if(curr_month > 6 && curr_month < 10){
            selectedVatqt = vatqt_options[1];
        }else if(curr_month > 9 && curr_month <= 12){
            selectedVatqt = vatqt_options[2];
        }


        //프로그램 내부의 값에 넣어주기.
        $scope.years = year_options;
        $scope.vatqts = vatqt_options;
        $scope.vattypes = vattype_options;
        $scope.vatcps = company_options;

        //화면에 셋업하기.
        $scope.YEAR = selectedYear;
        $scope.VATQT = selectedVatqt;
        $scope.VATTYPE = vattype_options[0];
        $scope.VATCP = company_options[1];

        //키값을 업데이트 // 화면상에 업데이트.
        $scope.updateVATKey = function(){
            //$scope.vatmessage = $scope.YEAR.name + '년 '+ $scope.VATQT.name+ ' '+$scope.VATTYPE.name;
//            $scope.setKey({YEAR: $scope.YEAR.value, VATQT: $scope.VATQT.value , VATTYPE: '', VATCP: $scope.VATCP });
        };
        $scope.updateVATKey();
    }]);