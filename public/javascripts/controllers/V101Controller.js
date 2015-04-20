/**
 * [Angularjs]
 * V101 화면을 읽어올 때 실행됨.
 * 화면상의 컨트롤은 모두 여기서 진행됨.
 * 여기는 Client side 만 들어 있음.
 * 서버와 연관된 액션은 Service 를 호출하여 사용함.
 */
'use strict';
/* global angular */
angular.module('V101Ctrl',[])
    .controller('V101Controller',function($scope,$log,$window,VATService,$location,$route,$q,ngDialog){

        //# 상수정의.
        $scope.constants = {
            'VATNO' : 'V101',  //이 화면의 VAT 번호.
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
        $scope.$on('changeKey',function(/*event,key*/){
            //VAT / 상위 값들이 바뀌었을 때 //
            // 값에 자료를 다시 불러와야 함.
            $log.info('값이 바뀌었습니다.');
            $route.reload();
        });


        //2-2.
        //화면상의 계산식을 정의하는 곳. >> 자동화를 해야 하는데.. 고민 중임.
        //화면의 자동계산 되는 로직은 아래에 정의된 데로 실행된다.

        $scope.calc = function(){

            /**
             * 첫번째 페이지 계산
             *
             */
            //매출세액 - 예정신고 누락분
            $scope.mg.GS_PREARG_SIN_AMT = Number($scope.mg.BADSINGO_SALES_ZR_TOT_AMT); // 7
            $scope.mg.GS_PREARG_SIN_TAX = Number($scope.mg.BADSINGO_SALES_ZR_TOT_TAX); // 7

            //과세표준및매출금액 금액 합계
            $scope.mg.GS_STD_AMT = Number($scope.mg.GS_TAX_INVOICED_AMT) + Number($scope.mg.GS_VEND_TAX_INV_AMT)
            + Number($scope.mg.GS_CR_CASH_AMT) + Number($scope.mg.GS_ETC_AMT) + Number($scope.mg.GS_ZR_TAX_INV_AMT)
            + Number($scope.mg.GS_ZR_ETC_AMT) + Number($scope.mg.GS_PREARG_SIN_AMT) + Number($scope.mg.GS_BADDEPT_AMT);

            //과세표준및매출금액 세액 합계
            $scope.mg.GS_STD_TAX = Number($scope.mg.GS_TAX_INVOICED_TAX) + Number($scope.mg.GS_VEND_TAX_INV_TAX)
            + Number($scope.mg.GS_CR_CASH_TAX) + Number($scope.mg.GS_ETC_TAX) + Number($scope.mg.GS_ZR_TAX_INV_TAX)
            + Number($scope.mg.GS_ZR_ETC_TAX) + Number($scope.mg.GS_PREARG_SIN_TAX) + Number($scope.mg.GS_BADDEPT_TAX);

            //매입세액 - 예정신고 누락분
            $scope.mg.PR_TAX_INV_MIN_AMT = Number($scope.mg.BADSINGO_PURCH_TOT_AMT); //12
            $scope.mg.PR_TAX_INV_MIN_TAX = Number($scope.mg.BADSINGO_PURCH_TOT_TAX); //12

            //그밖의 경감공제 세액
            $scope.mg.REDU_ETC_TAX = Number($scope.mg.ETCKG_TOTAL_TAX);

            //경감공제세액 합계
            $scope.mg.REDU_TOT_AMT = Number($scope.mg.REDU_CREDIT_AMT);
            $scope.mg.REDU_TOT_TAX = Number($scope.mg.REDU_ETC_TAX) + Number($scope.mg.REDU_CREDIT_TAX);

            //가산세액계
            $scope.mg.ADD_TAX_TOT_TAX = Number($scope.mg.GS_TOTAL_TAX);

            //과세표준 명세 - 기본 금액
            $scope.mg.TAX_STD_BUS_AMT_1 = $scope.mg.GS_STD_AMT;

            //과세표준 명세 - 합계
            $scope.mg.TAX_STD_BUS_AMT_5 = Number($scope.mg.TAX_STD_BUS_AMT_1) + Number($scope.mg.TAX_STD_BUS_AMT_2)
            + Number($scope.mg.TAX_STD_BUS_AMT_3) + Number($scope.mg.TAX_STD_BUS_AMT_4);

            /**
             * 두번째 페이지 계산.
             */
            //예정신고누락분 - 매출 합계
            $scope.mg.BADSINGO_SALES_ZR_TOT_AMT = Number($scope.mg.BADSINGO_SALES_GS_TAX_AMT) + Number($scope.mg.BADSINGO_SALES_GS_ETC_AMT)
            + Number($scope.mg.BADSINGO_SALES_ZR_AMT) + Number($scope.mg.BADSINGO_SALES_ZR_ECT_AMT);
            $scope.mg.BADSINGO_SALES_ZR_TOT_TAX = Number($scope.mg.BADSINGO_SALES_GS_TAX_TAX) + Number($scope.mg.BADSINGO_SALES_GS_ETC_TAX)
            + Number($scope.mg.BADSINGO_SALES_ZR_TAX) + Number($scope.mg.BADSINGO_SALES_ZR_ECT_TAX);

            //예정신고누락분 - 매입 합계
            $scope.mg.BADSINGO_PURCH_TOT_AMT = Number($scope.mg.BADSINGO_PURCH_TAX_AMT) + Number($scope.mg.BADSINGO_PURCH_ETC_AMT);
            $scope.mg.BADSINGO_PURCH_TOT_TAX = Number($scope.mg.BADSINGO_PURCH_TAX_TAX) + Number($scope.mg.BADSINGO_PURCH_ETC_TAX);

            //그밖의 공제매입세액 합계
            $scope.mg.ETCGONJE_TOTAL_AMT = Number($scope.mg.ETCGONJE_CRD_GEN_AMT) + Number($scope.mg.ETCGONJE_CRD_FIXED_AMT)
            + Number($scope.mg.ETCGONJE_EJ_PURCH_AMT) + Number($scope.mg.ETCGONJE_RECY_PURCH_AMT);
            $scope.mg.ETCGONJE_TOTAL_TAX = Number($scope.mg.ETCGONJE_CRD_GEN_TAX) + Number($scope.mg.ETCGONJE_CRD_FIXED_TAX)
            + Number($scope.mg.ETCGONJE_EJ_PURCH_TAX) + Number($scope.mg.ETCGONJE_RECY_PURCH_TAX)
            + Number($scope.mg.ETCGONJE_GJBUS_PURCH_TAX) + Number($scope.mg.ETCGONJE_INV_PURCH_TAX)
            + Number($scope.mg.ETCGONJE_BDS_PURCH_TAX) + Number($scope.mg.ETCGONJE_FOREIGN_PURCH_TAX);

            //공제받지못할매입 합계
            $scope.mg.BADGONJE_TOTAL_AMT = Number($scope.mg.BADGONJE_BAD_AMT) + Number($scope.mg.BADGONJE_GEN_NOTAX_AMT)
            + Number($scope.mg.BADGONJE_DAESON_AMT);
            $scope.mg.BADGONJE_TOTAL_TAX = Number($scope.mg.BADGONJE_BAD_TAX) + Number($scope.mg.BADGONJE_GEN_NOTAX_TAX)
            + Number($scope.mg.BADGONJE_DAESON_TAX);

            //기타경감공제세액 - 합계
            $scope.mg.ETCKG_TOTAL_TAX = Number($scope.mg.ETCKG_ELECSINGO_TAX) + Number($scope.mg.ETCKG_ELECBALGUP_TAX)
            + Number($scope.mg.ETCKG_TAXI_TAX) + Number($scope.mg.ETCKG_CASH_TAX) + Number($scope.mg.ETCKG_ETC_TAX);

            //가산세 명세 - 합계
            $scope.mg.GS_TOTAL_TAX = Number($scope.mg.GS_NOBUS_TAX) + Number($scope.mg.GS_TAXINV_DELYBAL_TAX) +Number($scope.mg.GS_TAXINV_DELYSUC_TAX)
            +Number($scope.mg.GS_TAXINV_NOBALGUP_TAX) +Number($scope.mg.GS_ETAX_DELYBAL_TAX) +Number($scope.mg.GS_ETAX_NOSEND_TAX)
            +Number($scope.mg.GS_TAXHAP_BADSEND_TAX) +Number($scope.mg.GS_TAXHAP_DELYSNED_TAX) +Number($scope.mg.GS_BADSINGO_NOSIN_GEN_TAX)
            +Number($scope.mg.GS_BADSINGO_NOSIN_BAD_TAX) +Number($scope.mg.GS_BADSINGO_GSCG_GEN_TAX) +Number($scope.mg.GS_BADSINGO_GSCG_BAD_TAX)
            +Number($scope.mg.GS_BADNAPBU_TAX) + Number($scope.mg.GS_ZEROGSSTDBADSINGO_TAX) + Number($scope.mg.GS_CASHSALEBAD_TAX)
            +Number($scope.mg.GS_BUDONGRENTBAD_TAX) +Number($scope.mg.GS_PURCHSPECIAL_KONTO_TAX) +Number($scope.mg.GS_PURCHSPECIAL_DELYKONTO_TAX);

            //면세사업수입금액 - 합계
            $scope.mg.TAXFREE_BUS_TOTAL_AMT = Number($scope.mg.TAXFREE_BUS_AMT_1) + Number($scope.mg.TAXFREE_BUS_AMT_2)
            + Number($scope.mg.TAXFREE_BUS_AMT_3);

            //매입세액 - 공제받지 못할 매입세액
            $scope.mg.PR_TAX_BADGONJE_TOT_AMT = Number($scope.mg.BADGONJE_TOTAL_AMT);
            $scope.mg.PR_TAX_BADGONJE_TOT_TAX = Number($scope.mg.BADGONJE_TOTAL_TAX);

            //매입세액 - 그 밖의 공제매입세액
            $scope.mg.PR_TAX_ETC_AMT = Number($scope.mg.ETCGONJE_TOTAL_AMT); //14
            $scope.mg.PR_TAX_ETC_TAX = Number($scope.mg.ETCGONJE_TOTAL_TAX); //14

            //매입세액 - 합계
            $scope.mg.PR_TAX_TOT_AMT = Number($scope.mg.PR_TAX_INV_GEN_AMT) + Number($scope.mg.PR_TAX_INV_FIXED_AMT)
            + Number($scope.mg.PR_TAX_INV_MIN_AMT) + Number($scope.mg.PR_TAX_INVOICED_AMT) + Number($scope.mg.PR_TAX_ETC_AMT);
            $scope.mg.PR_TAX_TOT_TAX = Number($scope.mg.PR_TAX_INV_GEN_TAX) + Number($scope.mg.PR_TAX_INV_FIXED_TAX)
            + Number($scope.mg.PR_TAX_INV_MIN_TAX) + Number($scope.mg.PR_TAX_INVOICED_TAX) + Number($scope.mg.PR_TAX_ETC_TAX);

            //매입세액 - 차감계
            $scope.mg.PR_TAX_CALC_AMT = Number($scope.mg.PR_TAX_TOT_AMT) - Number($scope.mg.PR_TAX_BADGONJE_TOT_AMT);
            $scope.mg.PR_TAX_CALC_TAX = Number($scope.mg.PR_TAX_TOT_TAX) - Number($scope.mg.PR_TAX_BADGONJE_TOT_TAX);

            //납부세액
            $scope.mg.NAPBU_TAX = Number($scope.mg.GS_STD_TAX) - Number($scope.mg.PR_TAX_CALC_TAX);

            //차감 . 가감하여 납부할 세액(환급받을 세액)
            $scope.mg.RED_ADD_NAPBU_TAX = Number($scope.mg.NAPBU_TAX) - Number($scope.mg.REDU_TOT_TAX)
            - Number($scope.mg.REFUND_TAX) - Number($scope.mg.NOTICED_TAX) - Number($scope.mg.REPORTED_DAE_TAXED_TAX)
            - Number($scope.mg.REPORTED_SPE_TAXED_TAX) + Number($scope.mg.ADD_TAX_TOT_TAX);

            //총괄 납부 사업자가 납부할 세액
            $scope.mg.TOTAL_NAPBU_TAX = $scope.mg.RED_ADD_NAPBU_TAX;

        };
        $scope.setVAT = function(viewKey){
            $log.log(viewKey);
            $scope.setVATKey(viewKey);
        };


        //2-3.
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

                    $scope.mg = data;
                    $scope.calc(); //재계산
                }
            }

        });


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
                $log.info($scope.VATROOTKEY);
                VATService.create($scope.constants.VATNO,$scope.VATROOTKEY,function(err,data){
                    if(err) {
                        $log.error(data);
                    }else{
                        $scope.mg = data;
                        $scope.status = 'Ok';
                        $scope.alertmessage = '성공적으로 생성되었습니다.!';
                        $scope.constants.EMPTY = 'false';

                        $scope.calc(); //재계산
                        $scope.progressValue = 100;
                        ngDialog.closeAll();
                    }

                });
            }

        };

        //#저장하기 버튼을 눌렀을 때 실행되는 function. #T*ODO @2014-10-14 저장기능 구현. DONE
        $scope.saveDocument = function(){

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

        };
        /**
         * 데이터를 삭제하는 기능, RAW 데이터가 아니라, 조회된 데이터 자체를 삭제함.
         *
         */
        $scope.deleteDocument = function(){
            VATService.delete($scope.VATROOTKEY[0],function(err,data){

                if(err) {

                    $log.error(data);
                    $scope.status = 'Error';
                    $scope.alertmessage = '정상적으로 삭제되지 않았습니다. 관리자에게 연락주세요!';

                }else{
                    //화면 ng-model 에 값 Setting.

                    if(data === 'null'){
                        $scope.status = 'Warning';
                        $scope.alertmessage = '해당 자료가 없습니다.';
                    }else{
                        $scope.status = 'Ok';
                        $scope.alertmessage = '성공적으로 데이터를 하였습니다.! 다시 자료를 가져오세요.';
                        $scope.constants.EMPTY = 'false';
                    }
                }
                $route.reload();
            });
        };
/*
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
*/
        $scope.getExcel = function(){

            //먼저 데이터를 자동으로 저장하고, 진행할 것.
            VATService.update($scope.constants.VATNO,$scope.mg,function(err,data){

                if(err) {
                    $log.error(data);

                    $scope.status = 'Error';
                    $scope.alertmessage = '저장하지 못했습니다. 관리자에게 문의하세요!';
                    return;
                }

                VATService.excel($scope.VATROOTKEY[0],function(err,data){

                    if(err) {
                        $log.error(data);

                        $scope.status = 'Error';
                        $scope.alertmessage = 'Excel 을 저장하지 못했습니다. 관리자에게 문의하세요!';
                        return;
                    }

                    /**
                     * Excel File 을 저장하는 곳, type 을 Excel 로 지정하여 저장합니다.
                     *
                     */
                    saveAs(new Blob([data],{type:"application/vnd.ms-excel;charset=euc-kr"}), "일반과세자 부가가치세신고서.xlsx");

                    $scope.status = 'Ok';
                    $scope.alertmessage = '성공적으로 Excel 을 저장 했습니다.!';

                });

            });


        };



    });