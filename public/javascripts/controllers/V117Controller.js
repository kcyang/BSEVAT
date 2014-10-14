/**
 * [Angularjs]
 * V117 화면을 읽어올 때 실행됨.
 * 화면상의 컨트롤은 모두 여기서 진행됨.
 * 여기는 Client side 만 들어 있음.
 * 서버와 연관된 액션은 Service 를 호출하여 사용함.
 */
'use strict';
/* global angular */

angular.module('V117Ctrl',[]).controller('V117Controller',function($scope,$log,VATService,$location,$route,ngDialog){

    //# 상수정의.
    $scope.constants = {
        'VATNO' : 'V117',  //이 화면의 VAT 번호.
        'EMPTY' : 'true'
    };

    $scope.progressValue = 0;
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

    //2-1.
    //화면상의 메시지 - 초기에는 안내 메시지를 전달 한다.
    $scope.status = 'Info';
    $scope.alertmessage = '금액과 발행 건수등을 검토하시고 저장버튼을 눌러주세요!';


    //최상위 Global 에 현재 VAT 값을 셋팅해 놓는다.(불필요할 때 삭제할 것) @TODO
    $scope.setVATKey($scope.constants.VATNO);  // 이 값이 바뀌어서,


    //### 다른 영역에서 발생한 이벤트를 등록하는 곳,
    //### 다른 곳에서 'eventName' 으로 발생한 이벤트에서 broadcast or emit 한 이벤트를
    //### 여기서 잡아서 처리해 줄 수 있다.
    $scope.$on('changeKey',function(event,key){
        //VAT / 상위 값들이 바뀌었을 때 //
        // 값에 자료를 다시 불러와야 함.
        $log.info('값이 바뀌었습니다.');
        //$location.path('/V117');  //#TODO 반응이 없는건지.. 살펴볼 것.
        $route.reload();
    });

    //2-2.
    //처음 화면 실행 시, 데이터를 가져 온다.

    VATService.get($scope.VATROOTKEY[0],function(err,data){

        if(err) {
            $log.error(data);
            $scope.status = 'Error';
            $scope.alertmessage = '작성하고자 하시는 자료가 만들어 지지 않았습니다. 자료 불러오기를 눌러서 생성해 주세요.!';
        }else{
            //화면 ng-model 에 값 Setting.

            if(data === 'null'){
                $scope.status = 'Warning';
                $scope.alertmessage = '해당 자료가 없습니다. 자료 불러오기를 눌러서 새로 생성하시거나, 다른 기수를 조회하세요.';
            }else{
                $scope.status = 'Ok';
                $scope.alertmessage = '성공적으로 데이터를 가져왔습니다.! 자료를 검토하시고 저장버튼을 눌러주세요.';
                $scope.constants.EMPTY = 'false';

                var keys = [];
                for(var key in data) { if(data.hasOwnProperty(key)){keys.push(key);} }

                for(var result_key in keys){
                    if(keys.hasOwnProperty(result_key)){
                        $scope[keys[result_key]] = data[keys[result_key]];
                    }
                }
                $scope.calc(); //재계산
            }
            //#TODO 화면에 뿌리기. 화면에 뿌리기. 배열로 통으로 던져주도록.
        }

    });

    //2-3.
    //화면상의 계산식을 정의하는 곳. >> 자동화를 해야 하는데.. 고민 중임.
    //화면의 자동계산 되는 로직은 아래에 정의된 데로 실행된다.

    $scope.calc = function(){
        $scope.CARD_TOTAL_AMOUNT = $scope.TAX_CARD_AMOUNT + $scope.NOTAX_CARD_AMOUNT;
        $scope.CASH_TOTAL_AMOUNT = $scope.TAX_CASH_AMOUNT + $scope.NOTAX_CASH_AMOUNT;
        $scope.TAX_TOTAL_AMOUNT = $scope.TAX_CARD_AMOUNT + $scope.TAX_CASH_AMOUNT;
        $scope.NOTAX_TOTAL_AMOUNT = $scope.NOTAX_CARD_AMOUNT + $scope.NOTAX_CASH_AMOUNT;
        $scope.TOTAL_AMOUNT = $scope.CARD_TOTAL_AMOUNT + $scope.CASH_TOTAL_AMOUNT;
    };

    //3. 화면 이벤트 발생 시,
    // 데이터가 없을 때, 데이터를 불러와서 새로운 값을 넣고, 다시 불러오는 Module.
    // 웹 화면에서 이벤트가 발생했을 때, 할 일을 아래에 정의한다.

    //#자료불러오기 버튼을 눌렀을 때 실행되는 function.
    $scope.createDocument = function(){

        if($scope.constants.EMPTY === 'false'){
            //Dialog 띄우기.
            ngDialog.open({
                template:'../../views/modalDialog.html',
                controller:'dialogController',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });

        }else{

            //서버로, 새로 데이터를 생성하는 요청을 보내는 곳.
            VATService.create($scope.constants.VATNO,$scope.VATROOTKEY,function(err,data){
                if(err) {
                    $log.error(data);
                }else{
                    $scope.status = 'Ok';
                    $scope.alertmessage = '성공적으로 생성되었습니다.!';
                    $scope.constants.EMPTY = 'false';

                    var keys = [];
                    for(var key in data) { if(data.hasOwnProperty(key)){keys.push(key);} }

                    for(var result_key in keys){
                        if(keys.hasOwnProperty(result_key)){
                            $scope[keys[result_key]] = data[keys[result_key]];
                        }
                    }

                    $scope.calc(); //재계산
                    $scope.progressValue = 100;
                    ngDialog.close('ngdialog1');

                }

            });
        }

    };

    //#저장하기 버튼을 눌렀을 때 실행되는 function. #TODO @2014-10-14 저장기능 구현.
    $scope.saveDocument = function(){

        VATService.update($scope.constants.VATNO,function(err,data){

            if(err) {
                $log.error(data);

                $scope.status = 'Error';
                $scope.alertmessage = '저장하지 못했습니다. 관리자에게 문의하세요!';
                return;
            }

            $scope.status = 'Ok';
            $scope.alertmessage = '성공적으로 저장되었습니다.!';
        });

    };

    //#다시 작성하기 버튼을 눌렀을 때 실행되는 function. #T*ODO @2014-10-14 다시 불러오기 기능 구현. DONE
    $scope.getDocument = function(){

        //Dialog 띄우기.
        ngDialog.open({
            template:'../../views/reopenDialog.html',
            controller:'dialogController',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            scope: $scope
        });

    };

});