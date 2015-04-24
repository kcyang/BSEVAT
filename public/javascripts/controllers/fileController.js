/**
 * [Angularjs]
 * V101 화면을 읽어올 때 실행됨.
 * 화면상의 컨트롤은 모두 여기서 진행됨.
 * 여기는 Client side 만 들어 있음.
 * 서버와 연관된 액션은 Service 를 호출하여 사용함.
 */
'use strict';
/* global angular */
angular.module('fileCtrl',[])
    .controller('fileController',function($scope,$log,$window,VATService,$location,$route,ngDialog){

        //1. 개요
        //여기서 해당 Page 의 값을 가져와서, ng-model 에 집어 넣는다.
        //해당 값이 없다면, 없다는 메시지를 보여주면 된다.
        //ng 서비스를 호출해서, RestFul API 를 호출하고, 결과 값은 JSON 으로 받아서 넣는다.

        //2. 초기 로딩 시 할 일들.

        //메시지를 보여주기 위한 화면 효과!!
        $scope.alert_class = {
            Warning : 'alert alert-warning pulse',
            Ok : 'alert alert-success pulse',
            Error : 'alert alert-danger shake',
            Info : 'alert alert-info pulse'
        };

        $scope.fileReportCheck = {
            V101 : true,
            V104 : true,
            V105 : true,
            V109 : true,
            V110 : true,
            V106 : true,
            V141 : true,
            V153 : true,
            V164 : true,
            V112 : true,
            V149 : true,
            V174 : true
        };
        //2-1.
        //화면상의 메시지 - 초기에는 안내 메시지를 전달 한다.
        $scope.status = 'Info';
        $scope.alertmessage = '신고하실 각 부속서류를 먼저 확인하시고 신고파일을 내려받으세요!';

        //### 다른 영역에서 발생한 이벤트를 등록하는 곳,
        //### 다른 곳에서 'eventName' 으로 발생한 이벤트에서 broadcast or emit 한 이벤트를
        //### 여기서 잡아서 처리해 줄 수 있다.
        $scope.$on('changeKey',function(/*event,key*/){
            //VAT / 상위 값들이 바뀌었을 때 //
            // 값에 자료를 다시 불러와야 함.
            $log.info('값이 바뀌었습니다.');
            $route.reload();
        });

        $scope.setVAT = function(viewKey){
            $log.log(viewKey);
//            $scope.setVATKey(viewKey);
        };
/*
        VATService.getCompany($scope.VATROOTKEY[0],function(err,data){

            if(err) {
                $log.error(data);
            }else{
                //화면 ng-model 에 값 Setting.
                if(data === 'null'){
                }else{
                    $scope.mg.TAX_STD_BUS_NAME_1 = data[0]['BSE_Business Type'];
                    $scope.mg.TAX_STD_BUS_ITEM_1 = data[0]['BSE_Business Class'];
                    $scope.mg.TAX_STD_BUS_CODE_1 = data[0]['BSE_Bussiness Code'];
                }
            }

        });
*/
        //#저장하기 버튼을 눌렀을 때 실행되는 function. #T*ODO @2014-10-14 저장기능 구현. DONE
        $scope.saveDocument = function(){
            $log.info($scope.fileReportCheck);
            /*
            VATService.update($scope.constants.VATNO,$scope.mg,function(err,data){

                if(err) {
                    $log.error(data);

                    $scope.status = 'Error';
                    $scope.alertmessage = '저장하지 못했습니다. 관리자에게 문의하세요!';
                    return;
                }
                $log.info('총 %s 건이 저장되었습니다',data);
                $scope.status = 'Ok';
                $scope.alertmessage = '성공적으로 저장되었습니다.!';
            });
*/

            var KEYS = $scope.fileReportCheck;

            var key_parameter = [];

            for(var key in KEYS){
                if(KEYS.hasOwnProperty(key)){
                    key_parameter.push(key);
                }
            }
            $log.info(key_parameter);

            var parameter_for_file = {};
            parameter_for_file.KEY = $scope.VATROOTKEY[0];
            parameter_for_file.PARAM = key_parameter;

            VATService.makefile(parameter_for_file,function(err,data){

                if(err) {
                    $log.error(data);

                    $scope.status = 'Error';
                    $scope.alertmessage = '저장하지 못했습니다. 관리자에게 문의하세요!';
                    return;
                }
                /**
                 * Excel File 을 저장하는 곳, type 을 Excel 로 지정하여 저장합니다.
                 *
                 */
                saveAs(new Blob([data],{type:"application/x-www-form-urlencoded;charset=euc-kr"}), parameter_for_file.KEY.VATCP+".101");

                $scope.status = 'Ok';
                $scope.alertmessage = '성공적으로 파일 을 저장 했습니다.!';

            });

        };

    });