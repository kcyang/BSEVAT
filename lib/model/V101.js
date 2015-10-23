'use strict';
/**
 * 각 화면에 따른 값을 셋업하는 곳, NAV 에서 가져와서 Mongo 에 넣은 값을
 * 여기서 꺼내서 합산 하거나 계산하여, 결과 값을 넣어준 후에, 해당 모델을
 * 리턴해 준다.
 * 여기 로직을 Config 에서 읽어서 자동화 할 수 있는 방안을 생각해 봐야 됨.(#TODO)
 */

/**
 * 비동기로 진행되는 Function 을 순서대로 또는 동시에 진행해야 하는 경우,
 * 사용할 Async 모듈을 Require 로 불러들임.
 *
 * @type {async|exports}
 */
var async = require('async');

/**
 * 계산된 결과를 담아 놓는 JSON Array Object.
 * 왜 이런 형태로 해야만 하는지 검토해야 됨. (#TODO)
 *
 */
var CALC = {
    "GS_TAX_INVOICED_AMT": "0",
    "GS_TAX_INVOICED_TAX": "0",
    "GS_VEND_TAX_INV_AMT": "0",
    "GS_VEND_TAX_INV_TAX": "0",
    "GS_CR_CASH_AMT": "0",
    "GS_CR_CASH_TAX": "0",
    "GS_ETC_AMT": "0",
    "GS_ETC_TAX": "0",
    "GS_ZR_TAX_INV_AMT": "0",
    "GS_ZR_TAX_INV_TAX": "0",
    "GS_ZR_ETC_AMT": "0",
    "GS_ZR_ETC_TAX": "0",
    "GS_PREARG_SIN_AMT": "0",
    "GS_PREARG_SIN_TAX": "0",
    "GS_BADDEPT_AMT": "0",
    "GS_BADDEPT_TAX": "0",
    "GS_STD_AMT": "0",
    "GS_STD_TAX": "0",
    "PR_TAX_INV_GEN_AMT": "0",
    "PR_TAX_INV_GEN_TAX": "0",
    "PR_TAX_INV_FIXED_AMT": "0",
    "PR_TAX_INV_FIXED_TAX": "0",
    "PR_TAX_INV_MIN_AMT": "0",
    "PR_TAX_INV_MIN_TAX": "0",
    "PR_TAX_INVOICED_AMT": "0",
    "PR_TAX_INVOICED_TAX": "0",
    "PR_TAX_ETC_AMT": "0",
    "PR_TAX_ETC_TAX": "0",
    "PR_TAX_TOT_AMT": "0",
    "PR_TAX_TOT_TAX": "0",
    "PR_TAX_BADGONJE_TOT_AMT" : "0",
    "PR_TAX_BADGONJE_TOT_TAX" : "0",
    "PR_TAX_CALC_AMT": "0",
    "PR_TAX_CALC_TAX": "0",
    "NAPBU_TAX": "0",
    "REDU_ETC_TAX": "0",
    "REDU_CREDIT_AMT": "0",
    "REDU_CREDIT_TAX": "0",
    "REDU_TOT_AMT": "0",
    "REDU_TOT_TAX": "0",
    "REFUND_AMT": "0",
    "REFUND_TAX": "0",
    "NOTICED_AMT": "0",
    "NOTICED_TAX": "0",
    "REPORTED_DAE_TAXED_TAX": "0",
    "REPORTED_SPE_TAXED_TAX": "0",
    "ADD_TAX_TOT_AMT": "0",
    "ADD_TAX_TOT_TAX": "0",
    "RED_ADD_NAPBU_TAX": "0",
    "TOTAL_NAPBU_TAX": "0",
    "TAX_STD_BUS_AMT_1": "0",
    "TAX_STD_BUS_AMT_2": "0",
    "TAX_STD_BUS_AMT_3": "0",
    "TAX_STD_BUS_AMT_4": "0",
    "TAX_STD_BUS_AMT_5": "0",
    "BADSINGO_SALES_GS_TAX_AMT": "0",
    "BADSINGO_SALES_GS_TAX_TAX": "0",
    "BADSINGO_SALES_GS_ETC_AMT": "0",
    "BADSINGO_SALES_GS_ETC_TAX": "0",
    "BADSINGO_SALES_ZR_AMT": "0",
    "BADSINGO_SALES_ZR_TAX": "0",
    "BADSINGO_SALES_ZR_ECT_AMT": "0",
    "BADSINGO_SALES_ZR_ECT_TAX": "0",
    "BADSINGO_SALES_ZR_TOT_AMT": "0",
    "BADSINGO_SALES_ZR_TOT_TAX": "0",
    "BADSINGO_PURCH_TAX_AMT": "0",
    "BADSINGO_PURCH_TAX_TAX": "0",
    "BADSINGO_PURCH_ETC_AMT": "0",
    "BADSINGO_PURCH_ETC_TAX": "0",
    "BADSINGO_PURCH_TOT_AMT": "0",
    "BADSINGO_PURCH_TOT_TAX": "0",
    "ETCGONJE_CRD_GEN_AMT": "0",
    "ETCGONJE_CRD_GEN_TAX": "0",
    "ETCGONJE_CRD_FIXED_AMT": "0",
    "ETCGONJE_CRD_FIXED_TAX": "0",
    "ETCGONJE_EJ_PURCH_AMT": "0",
    "ETCGONJE_EJ_PURCH_TAX": "0",
    "ETCGONJE_RECY_PURCH_AMT": "0",
    "ETCGONJE_RECY_PURCH_TAX": "0",
    "ETCGONJE_GJBUS_PURCH_TAX": "0",
    "ETCGONJE_INV_PURCH_TAX": "0",
    "ETCGONJE_BDS_PURCH_TAX": "0",
    "ETCGONJE_FOREIGN_PURCH_TAX": "0",
    "ETCGONJE_TOTAL_AMT": "0",
    "ETCGONJE_TOTAL_TAX": "0",
    "BADGONJE_BAD_AMT": "0",
    "BADGONJE_BAD_TAX": "0",
    "BADGONJE_GEN_NOTAX_AMT": "0",
    "BADGONJE_GEN_NOTAX_TAX": "0",
    "BADGONJE_DAESON_AMT": "0",
    "BADGONJE_DAESON_TAX": "0",
    "BADGONJE_TOTAL_AMT": "0",
    "BADGONJE_TOTAL_TAX": "0",
    "ETCKG_ELECSINGO_TAX": "0",
    "ETCKG_ELECBALGUP_TAX": "0",
    "ETCKG_TAXI_TAX": "0",
    "ETCKG_CASH_TAX": "0",
    "ETCKG_ETC_TAX": "0",
    "ETCKG_TOTAL_TAX": "0",
    "GS_NOBUS_AMT": "0",
    "GS_NOBUS_TAX": "0",
    "GS_TAXINV_DELYBAL_AMT": "0",
    "GS_TAXINV_DELYBAL_TAX": "0",
    "GS_TAXINV_DELYSUC_AMT": "0",
    "GS_TAXINV_DELYSUC_TAX": "0",
    "GS_TAXINV_NOBALGUP_AMT": "0",
    "GS_TAXINV_NOBALGUP_TAX": "0",
    "GS_ETAX_DELYBAL_AMT": "0",
    "GS_ETAX_DELYBAL_TAX": "0",
    "GS_ETAX_NOSEND_AMT": "0",
    "GS_ETAX_NOSEND_TAX": "0",
    "GS_TAXHAP_BADSEND_AMT": "0",
    "GS_TAXHAP_BADSEND_TAX": "0",
    "GS_TAXHAP_DELYSNED_AMT": "0",
    "GS_TAXHAP_DELYSNED_TAX": "0",
    "GS_BADSINGO_NOSIN_GEN_AMT": "0",
    "GS_BADSINGO_NOSIN_GEN_TAX": "0",
    "GS_BADSINGO_NOSIN_BAD_AMT": "0",
    "GS_BADSINGO_NOSIN_BAD_TAX": "0",
    "GS_BADSINGO_GSCG_GEN_AMT": "0",
    "GS_BADSINGO_GSCG_GEN_TAX": "0",
    "GS_BADSINGO_GSCG_BAD_AMT": "0",
    "GS_BADSINGO_GSCG_BAD_TAX": "0",
    "GS_BADNAPBU_AMT": "0",
    "GS_BADNAPBU_TAX": "0",
    "GS_ZEROGSSTDBADSINGO_AMT": "0",
    "GS_ZEROGSSTDBADSINGO_TAX": "0",
    "GS_CASHSALEBAD_AMT": "0",
    "GS_CASHSALEBAD_TAX": "0",
    "GS_BUDONGRENTBAD_AMT": "0",
    "GS_BUDONGRENTBAD_TAX": "0",
    "GS_PURCHSPECIAL_KONTO_AMT": "0",
    "GS_PURCHSPECIAL_KONTO_TAX": "0",
    "GS_PURCHSPECIAL_DELYKONTO_AMT": "0",
    "GS_PURCHSPECIAL_DELYKONTO_TAX": "0",
    "GS_TOTAL_TAX": "0",
    "TAXFREE_BUS_AMT_1": "0",
    "TAXFREE_BUS_AMT_2": "0",
    "TAXFREE_BUS_AMT_3": "0",
    "TAXFREE_BUS_TOTAL_AMT": "0",
    "INVOICE_GYOBU_AMT": "0",
    "INVOICE_SUCHI_AMT": "0",
    "TAX_STD_BUS_NAME_2" : "",
    "TAX_STD_BUS_ITEM_2" : "",
    "TAX_STD_BUS_CODE_2" : ""
};

/**
 * VAT 번호를 받아서, 값을 셋업 하는 곳.
 * 각 형태마다 다른 결과값을 요구 할 것임.
 * @param VATNO
 * @param VATROOTKEY
 * @param callback
 */
exports.setValue = function(VATNO,VATROOTKEY,callback){


    // * Parameter Validation Check!

    if(VATNO === 'undefined' || VATNO === null){

        console.error('ERROR VATNO undefined');
        callback(true,'ERROR VATNO undefined');

    }else if(VATROOTKEY === null || typeof VATROOTKEY === 'undefined'){

        console.error('ERROR VATROOTKEY undefined');
        callback(true,'ERROR VATROOTKEY undefined');

    }else{

        var keyRef = {
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+VATROOTKEY.VATNO+VATROOTKEY.VATCP
        };
        var keyRefV112 = {
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+'V112'+VATROOTKEY.VATCP
        };
        var keyRefV164 = {
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+'V164'+VATROOTKEY.VATCP
        };
        var keyRefV153 = {
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+'V153'+VATROOTKEY.VATCP
        };
        var keyRefV120 = {
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+'V120'+VATROOTKEY.VATCP
        };
    /**
     *{name: '1기 예정', value: '11'},
     *{name: '1기 확정', value: '12'}, !!예정 누락분 포함.
     *{name: '2기 예정', value: '21'},
     *{name: '2기 확정', value: '22'}  !!예정 누락분 포함.
     * 부가세 신고에서는 누락분 포함관련 모듈을 넣어줘야 됨.
     * #TODO 이부분은 모듈로 빼서 최적화 할 것.!!
     */
        var confirm_period = false;

        if(VATROOTKEY.VATQT === '12' || VATROOTKEY.VATQT === '22'){
            confirm_period = true;
        }
        var report_from_date = null;
        var report_to_date = null;
        var missing_from_date = null;
        var missing_to_date = null;

        /**
         * new Date (년 , 월 , 일)
         * 월은 0 부터 시작한다. (즉, 1월은 0 임)
         */
        if(VATROOTKEY.VATQT === '11'){
            report_from_date = new Date(VATROOTKEY.YEAR,0,1);
            report_to_date = new Date(VATROOTKEY.YEAR,2,31);
        }else if(VATROOTKEY.VATQT === '12'){
            report_from_date = new Date(VATROOTKEY.YEAR,3,1);
            report_to_date = new Date(VATROOTKEY.YEAR,5,30);
            missing_from_date = new Date(VATROOTKEY.YEAR,0,1);
            missing_to_date = new Date(VATROOTKEY.YEAR,2,31);
        }else if(VATROOTKEY.VATQT === '21'){
            report_from_date = new Date(VATROOTKEY.YEAR,6,1);
            report_to_date = new Date(VATROOTKEY.YEAR,8,30);
        }else if(VATROOTKEY.VATQT === '22'){
            report_from_date = new Date(VATROOTKEY.YEAR,9,1);
            report_to_date = new Date(VATROOTKEY.YEAR,11,31);
            missing_from_date = new Date(VATROOTKEY.YEAR,6,1);
            missing_to_date = new Date(VATROOTKEY.YEAR,8,30);
        }

        // MSSQL 에서 가져온 Data 를 저장해 둔 raws collection 에서 결과값을 추출 할 것임.
        var MODEL = models(VATNO+'raws');

        //Mongoose Aggregate.#TODO Aggregate 부분을 좀 더 구조화 할 것.

        /**
         * Async Module 중에, Parallel 을 사용함.
         * 이 기능은, 나열된 Function 을 동시에 실행하되,
         * 모두 끝마치면, 마지막 Function 을 Call 하게 되어 있음.
         *
         * VAT Type :: 0:Purchase 1:Sales
         * Boolean  :: 0: No , 1:Yes
         *
         */
console.log('%s .. %s',report_from_date,report_to_date);
        async.parallel([

                /**
                 * 과세표준 및 매출세액 / 과세 / 세금계산서 발급분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 1, //1:Sales
                                "BSE_VAT Category Code" : 'S010',
                                "BSE_Buyer Issued" : 0/*,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('1.과세표준 및 매출세액 / 과세 / 세금계산서 발급분 매수[%d]',res[0].numCnt);
                                        CALC['GS_TAX_INVOICED_AMT'] = res[0].TotAmount;
                                        CALC['GS_TAX_INVOICED_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 과세표준 및 매출세액 / 과세 / 매입자 발행 세금계산서 발급분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 1, //1:Sales
                                "BSE_VAT Category Code" : 'S010',
                                "BSE_Buyer Issued" : 1/*,  //1: Yes
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('2.과세표준및매출세액/과세/매입자발행세금계산서발급분매수[%d]',res[0].numCnt);
                                        CALC['GS_VEND_TAX_INV_AMT'] = res[0].TotAmount;
                                        CALC['GS_VEND_TAX_INV_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 과세표준 및 매출세액 / 과세 / 신용카드현금영수증발행분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 1, //1:Sales
                                "BSE_VAT Category Code" :  {
                                    $in : ['S060','S070','S080','S090','S100','S110']
                                }/*,
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('3.과세표준 및 매출세액/과세/신용카드현금영수증발행분[%d]',res[0].numCnt);
                                        CALC['GS_CR_CASH_AMT'] = res[0].TotAmount;
                                        CALC['GS_CR_CASH_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },

                /**
                 * 과세표준 및 매출세액 / 과세 / 기타 발행분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 1, //1:Sales
                                "BSE_VAT Category Code" :  {
                                    $in : ['S040','S030']
                                }/*,
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('3.과세표준 및 매출세액/과세/기타발행분[%d]',res[0].numCnt);
                                        CALC['GS_ETC_AMT'] = res[0].TotAmount;
                                        CALC['GS_ETC_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 과세표준 및 매출세액 / 영세율 / 세금계산서 발급분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 1, //1:Sales
                                "BSE_VAT Category Code" : 'S020',
                                "BSE_Buyer Issued" : 0/*,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('1.과세표준 및 매출세액/영세율/세금계산서 발급분 매수[%d]',res[0].numCnt);
                                        CALC['GS_ZR_TAX_INV_AMT'] = res[0].TotAmount;
                                        CALC['GS_ZR_TAX_INV_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 과세표준 및 매출세액 / 영세율 / 기타 발행분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 1, //1:Sales
                                "BSE_VAT Category Code" :  {
                                    $in : ['S140','S130']
                                }/*,
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('3.과세표준 및 매출세액/영세율/기타발행분[%d]',res[0].numCnt);
                                        CALC['GS_ZR_ETC_AMT'] = res[0].TotAmount;
                                        CALC['GS_ZR_ETC_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 매입세액/세금계산서수취분/일반매입
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 0, //0:Purchase
                                "BSE_VAT Category Code" : {
                                    $in : ['P010','P020','P030','P040',
                                        'P060','P070','P080','P090','P100','P110',
                                        'P120','P130','P140']
                                },
                                "BSE_Buyer Issued" : 0/*,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('10.매입세액/세금계산서수취분/일반매입[%d]',res[0].numCnt);
                                        CALC['PR_TAX_INV_GEN_AMT'] = res[0].TotAmount;
                                        CALC['PR_TAX_INV_GEN_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 매입세액/세금계산서수취분/고정자산매입
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 0, //0:Purchase
                                "BSE_VAT Category Code" : {
                                    $in : ['P051','P271','P281','P291','P301','P311','P321','P331','P341',
                                        'P052','P272','P282','P292','P302','P312','P322','P332','P342',
                                        'P053','P273','P283','P293','P303','P313','P323','P333','P343',
                                        'P054','P274','P284','P294','P304','P314','P324','P334','P344',
                                        'P351','P361','P371','P381','P391','P401','P411','P352','P362',
                                        'P372','P382','P392','P402','P412','P353','P363','P373','P383',
                                        'P393','P403','P413','P354','P364','P374','P384','P394','P404',
                                        'P414']
                                },
                                "BSE_Buyer Issued" : 0/*,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('11.매입세액/세금계산서수취분/고정자산매입[%d]',res[0].numCnt);
                                        CALC['PR_TAX_INV_FIXED_AMT'] = res[0].TotAmount;
                                        CALC['PR_TAX_INV_FIXED_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 매입세액/매입자발행세금계산서
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 0, //0:Purchase
                                "BSE_VAT Category Code" : {
                                    $in : ['P010','P020','P030','P040','P051','P052','P053','P054','P281',
                                        'P282','P283','P284','P301','P302','P303','P304']
                                },
                                "BSE_Buyer Issued" : 1/*,  //1: Yes
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('13.매입세액/매입자발행세금계산서[%d]',res[0].numCnt);
                                        CALC['PR_TAX_INVOICED_AMT'] = res[0].TotAmount;
                                        CALC['PR_TAX_INVOICED_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 면세사업수익금액
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 1, //1:Sales
                                "BSE_VAT Category Code" : {
                                    $in : ['S050']
                                }/*,
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('78.면세사업수익금액[%d]',res[0].numCnt);
                                        CALC['TAXFREE_BUS_AMT_1'] = res[0].TotAmount;
                                        CALC['INVOICE_GYOBU_AMT'] = res[0].TotAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 계산서수취금액
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Type": 0, //0:Purchase
                                "BSE_VAT Category Code" : {
                                    $in : ['P150','P161','P162','P163','P164','P170','P171','P271','P272','P273','P274']
                                }/*,
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }*/
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('83.계산서수취금액[%d]',res[0].numCnt);
                                        CALC['INVOICE_SUCHI_AMT'] = res[0].TotAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 예정신고누락분 명세 매출 과세 세금계산서
                 * @param innerCallback
                 */
                function(innerCallback){
                    //확정 신고 일때에만 실행 할 것.
                    if(confirm_period === true) {
                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 1, //1:Sales
                                    "BSE_VAT Category Code": 'S010',
                                    "BSE_Buyer Issued": 0,  //0: No
                                    "BSE_VAT Missing": 1/*, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('예정신고누락분 명세 매출 과세 세금계산서[%d]', res[0].numCnt);
                                            CALC['BADSINGO_SALES_GS_TAX_AMT'] = res[0].TotAmount;
                                            CALC['BADSINGO_SALES_GS_TAX_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });

                        });
                    }else{
                        innerCallback(null, false);
                    }
                },
                /**
                 * 예정신고누락분 명세 매출 과세 기타
                 * @param innerCallback
                 */
                function(innerCallback){
                    //확정 신고 일때에만 실행 할 것.
                    if(confirm_period === true) {

                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 1, //1:Sales
                                    "BSE_VAT Category Code": {
                                        $in: ['S060', 'S070', 'S080', 'S090', 'S100', 'S110']
                                    },
                                    "BSE_VAT Missing": 1/*, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('예정신고누락분 명세 매출 과세 기타[%d]', res[0].numCnt);
                                            CALC['BADSINGO_SALES_GS_ETC_AMT'] = res[0].TotAmount;
                                            CALC['BADSINGO_SALES_GS_ETC_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });
                        });
                    }else{
                        innerCallback(null, false);
                    }
                },
                /**
                 * 예정신고누락분 명세 매출 영세율 세금계산서
                 * @param innerCallback
                 */
                function(innerCallback){
                    //확정 신고 일때에만 실행 할 것.
                    if(confirm_period === true) {

                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 1, //1:Sales
                                    "BSE_VAT Category Code": 'S020',
                                    "BSE_Buyer Issued": 0,  //0: No
                                    "BSE_VAT Missing": 1/*, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('예정신고누락분 명세 매출 영세율 세금계산서[%d]', res[0].numCnt);
                                            CALC['BADSINGO_SALES_ZR_AMT'] = res[0].TotAmount;
                                            CALC['BADSINGO_SALES_ZR_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });
                        });
                    }else{
                        innerCallback(null, false);
                    }
                },
                /**
                 * 예정신고누락분 명세 매출 영세율 기타
                 * @param innerCallback
                 */
                function(innerCallback){
                    //확정 신고 일때에만 실행 할 것.
                    if(confirm_period === true) {

                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 1, //1:Sales
                                    "BSE_VAT Category Code": {
                                        $in: ['S130', 'S140']
                                    },
                                    "BSE_VAT Missing": 1/*, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('예정신고누락분 명세 매출 영세율 기타[%d]', res[0].numCnt);
                                            CALC['BADSINGO_SALES_ZR_ECT_AMT'] = res[0].TotAmount;
                                            CALC['BADSINGO_SALES_ZR_ECT_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });
                        });
                    }else{
                        innerCallback(null, false);
                    }
                },
                /**
                 * 예정신고누락분 명세 매입 세금계산서
                 * @param innerCallback
                 */
                function(innerCallback){
                    //확정 신고 일때에만 실행 할 것.
                    if(confirm_period === true) {

                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 0, //0:Purchase
                                    "BSE_VAT Missing": 1/*, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('예정신고누락분 명세 매입 세금계산서[%d]', res[0].numCnt);
                                            CALC['BADSINGO_PURCH_TAX_AMT'] = res[0].TotAmount;
                                            CALC['BADSINGO_PURCH_TAX_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });
                        });
                    }else{
                        innerCallback(null, false);
                    }
                },
                /**
                 * 예정신고누락분 명세 매입 그밖의 공제
                 * @param innerCallback
                 */
                function(innerCallback){
                    //확정 신고 일때에만 실행 할 것.
                    if(confirm_period === true) {

                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 0, //0:Purchase
                                    "BSE_VAT Missing": 1, //1: Yes
                                    "BSE_VAT Category Code": {
                                        $in: ['P180', 'P190', 'P200', 'P211', 'P212', 'P213', 'P214', 'P220', 'P230', 'P240',
                                            'P251', 'P252', 'P253', 'P254', 'P261', 'P262', 'P291', 'P292', 'P293', 'P294', 'P311',
                                            'P312', 'P313', 'P314', 'P321', 'P322', 'P323', 'P324', 'P331', 'P332', 'P333', 'P334',
                                            'P341', 'P342', 'P343', 'P344']
                                    }/*,
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('예정신고누락분 명세 매입 그밖의 공제[%d]', res[0].numCnt);
                                            CALC['BADSINGO_PURCH_ETC_AMT'] = res[0].TotAmount;
                                            CALC['BADSINGO_PURCH_ETC_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });
                        });
                    }else{
                        innerCallback(null, false);
                    }
                },
                /**
                 * 가산세명세-전자세금계산서-지연전송
                 * @param innerCallback
                 */
                function(innerCallback){
                    //확정 신고 일때는 예정신고일 포함.
                    if(confirm_period === true) {
                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 1, //1:Sales
                                    "BSE_ETAX Complete issue": 2/*, //2: Delays
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: report_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('가산세명세-전자세금계산서-지연전송[%d]', res[0].numCnt);
                                            CALC['GS_ETAX_DELYBAL_AMT'] = res[0].TotAmount;
                                            CALC['GS_ETAX_DELYBAL_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });
                        });
                    }else{ //예정신고일 때에는 예정 기간만,
                        MODEL.find({}, function (err) {

                            MODEL.aggregate()
                                .match({
                                    "BSE_VAT Type": 1, //1:Sales
                                    "BSE_ETAX Complete issue": 2/*, //2: Delays
                                    "BSE_VAT Date": {
                                        $gte: report_from_date,
                                        $lte: report_to_date
                                    }*/
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Actual Amount"
                                    },
                                    VatAmount: {  //세액
                                        $sum: "$BSE_Editable Tot VAT Amount"
                                    },
                                    numCnt: {$sum: 1}  //매수
                                })
                                .exec(function (err, res) {

                                    if (err) {
                                        console.error('Aggregation ERROR ...' + err);
                                    } else {
                                        if (res.length !== 0) {
                                            console.error('가산세명세-전자세금계산서-지연전송[%d]', res[0].numCnt);
                                            CALC['GS_ETAX_DELYBAL_AMT'] = res[0].TotAmount;
                                            CALC['GS_ETAX_DELYBAL_TAX'] = res[0].VatAmount;
                                        }
                                    }
                                    innerCallback(null, false);
                                });
                        });
                    }
                },
                /**
                 * 대손세액공제금액
                 * @param innerCallback
                 */
                function(innerCallback){
                    var mongoModel = models('V112');

                    mongoModel.findOne({ VATKEY: keyRefV112.VATKEY }, function (err, result_document) {
                        if(err){
                            console.error('데이터를 가져오지 못했습니다. ',err);
                            innerCallback(null, true);
                        }
                        if(result_document){

                            CALC['GS_BADDEPT_AMT'] = result_document.BJ_REPAY_AMT_TOTAL - result_document.DS_REPAY_AMT_TOTAL;
                            CALC['GS_BADDEPT_TAX'] = result_document.BJ_REPAY_TAX_TOTAL - result_document.DS_REPAY_TAX_TOTAL;
                            //그밖의 공제매입세액-변제대손세액
                            CALC['ETCGONJE_BDS_PURCH_TAX'] = result_document.BJ_REPAY_TAX_TOTAL + result_document.BJ_REPAY_AMT_TOTAL;
                            //#공제받지못할매입-대손처분받은 세액/금액
                            CALC['BADGONJE_DAESON_AMT'] = result_document.DS_REPAY_AMT_TOTAL;
                            CALC['BADGONJE_DAESON_TAX'] = result_document.DS_REPAY_TAX_TOTAL;

                            if(isNaN(CALC['GS_BADDEPT_AMT'])) CALC['GS_BADDEPT_AMT'] = 0;
                            if(isNaN(CALC['GS_BADDEPT_TAX'])) CALC['GS_BADDEPT_TAX'] = 0;
                            if(isNaN(CALC['ETCGONJE_BDS_PURCH_TAX'])) CALC['ETCGONJE_BDS_PURCH_TAX'] = 0;
                            if(isNaN(CALC['BADGONJE_DAESON_AMT'])) CALC['BADGONJE_DAESON_AMT'] = 0;
                            if(isNaN(CALC['BADGONJE_DAESON_TAX'])) CALC['BADGONJE_DAESON_TAX'] = 0;
                        }
                        innerCallback(null, false);
                    });
                },
                /**
                 * 부동산 임대 공급가액 명세
                 * @param innerCallback
                 */
                    function(innerCallback){
                    var mongoModel = models('V120');

                    mongoModel.findOne({ VATKEY: keyRefV120.VATKEY }, function (err, result_document) {
                        if(err){
                            console.error('데이터를 가져오지 못했습니다. ',err);
                            innerCallback(null, true);
                        }
                        if(result_document){

                            CALC['GS_ETC_AMT'] = result_document.RE_IM_BO_TOT_AMT;
                            CALC['GS_ETC_TAX'] = result_document.RE_IM_BO_TOT_AMT * 0.01;
                            CALC['TAX_STD_BUS_AMT_2'] = result_document.RE_IM_BO_TOT_AMT;
                            CALC["TAX_STD_BUS_NAME_2"] = "부동산업";
                            CALC["TAX_STD_BUS_ITEM_2"] = "부동산업";
                            CALC["TAX_STD_BUS_CODE_2"] = "701201";

                            if(isNaN(CALC['GS_ETC_AMT'])) {
                                CALC['GS_ETC_AMT'] = 0;
                                CALC['GS_ETC_TAX'] = 0;
                                CALC["TAX_STD_BUS_NAME_2"] = "";
                                CALC["TAX_STD_BUS_ITEM_2"] = "";
                                CALC["TAX_STD_BUS_CODE_2"] = "";
                            }
                        }
                        innerCallback(null, false);
                    });
                },
                /**
                 * 신용카드매출전표등 수령합계표
                 * @param innerCallback
                 */
                    function(innerCallback){
                    var mongoModel = models('V164');

                    mongoModel.findOne({ VATKEY: keyRefV164.VATKEY }, function (err, result_document) {

                        if(err){
                            console.error('데이터를 가져오지 못했습니다. ',err);
                            innerCallback(null, true);
                        }
                        if(result_document){
                            //그밖의 공제매입세액-신용카드매출수량 일반매입
                            //CALC['ETCGONJE_CRD_GEN_AMT'] = result_document.GE_TOTAL_AMOUNT;
                            CALC['ETCGONJE_CRD_GEN_AMT'] = Number(result_document.GE_CASH_AMOUNT_TOTAL) + Number(result_document.GE_DRIVER_AMOUNT_TOTAL)
                            + Number(result_document.GE_BUSINESS_CARD_AMOUNT_TOTAL) + Number(result_document.GE_CARD_AMOUNT_TOTAL);

                            //CALC['ETCGONJE_CRD_GEN_TAX'] = result_document.GE_TOTAL_TAX;
                            CALC['ETCGONJE_CRD_GEN_TAX'] = Number(result_document.GE_CASH_TAX_TOTAL) + Number(result_document.GE_DRIVER_TAX_TOTAL)
                            + Number(result_document.GE_BUSINESS_CARD_TAX_TOTAL) + Number(result_document.GE_CARD_TAX_TOTAL);
                            //그밖의 공제매입세액-신용카드매출수량 고정자산매입
                            //CALC['ETCGONJE_CRD_FIXED_AMT'] = result_document.FA_TOTAL_AMOUNT;
                            CALC['ETCGONJE_CRD_FIXED_AMT'] = Number(result_document.FA_CASH_AMOUNT_TOTAL) + Number(result_document.FA_DRIVER_AMOUNT_TOTAL)
                            + Number(result_document.FA_BUSINESS_CARD_AMOUNT_TOTAL) + Number(result_document.FA_CARD_AMOUNT_TOTAL);
                            //CALC['ETCGONJE_CRD_FIXED_TAX'] = result_document.FA_TOTAL_TAX;
                            CALC['ETCGONJE_CRD_FIXED_TAX'] = Number(result_document.FA_CASH_TAX_TOTAL) + Number(result_document.FA_DRIVER_TAX_TOTAL)
                            + Number(result_document.FA_BUSINESS_CARD_TAX_TOTAL) + Number(result_document.FA_CARD_TAX_TOTAL);

                            if(isNaN(CALC['ETCGONJE_CRD_GEN_AMT'])) CALC['ETCGONJE_CRD_GEN_AMT'] = 0;
                            if(isNaN(CALC['ETCGONJE_CRD_GEN_TAX'])) CALC['ETCGONJE_CRD_GEN_TAX'] = 0;
                            if(isNaN(CALC['ETCGONJE_CRD_FIXED_AMT'])) CALC['ETCGONJE_CRD_FIXED_AMT'] = 0;
                            if(isNaN(CALC['ETCGONJE_CRD_FIXED_TAX'])) CALC['ETCGONJE_CRD_FIXED_TAX'] = 0;
                        }
                        innerCallback(null, false);
                    });
                },
                /**
                 * 공제받지못할 매입세액
                 * @param innerCallback
                 */
                    function(innerCallback){
                    var mongoModel = models('V153');

                    mongoModel.findOne({ VATKEY: keyRefV153.VATKEY }, function (err, result_document) {

                        if(err){
                            console.error('데이터를 가져오지 못했습니다. ',err);
                            innerCallback(null, true);
                        }
                        if(result_document){
                            //CALC['BADGONJE_BAD_AMT'] = result_document.PURCH_TAX_TOTAL_AMT;
                            CALC['BADGONJE_BAD_AMT'] = Number(result_document.PURCH_TAX_1_AMT) + Number(result_document.PURCH_TAX_2_AMT)+ Number(result_document.PURCH_TAX_3_AMT)
                            + Number(result_document.PURCH_TAX_4_AMT)+ Number(result_document.PURCH_TAX_5_AMT)+ Number(result_document.PURCH_TAX_6_AMT)+ Number(result_document.PURCH_TAX_7_AMT)
                            + Number(result_document.PURCH_TAX_8_AMT);
                            //CALC['BADGONJE_BAD_TAX'] = result_document.PURCH_TAX_TOTAL_TAX;
                            CALC['BADGONJE_BAD_TAX'] = Number(result_document.PURCH_TAX_1_TAX) + Number(result_document.PURCH_TAX_2_TAX)+ Number(result_document.PURCH_TAX_3_TAX)
                            + Number(result_document.PURCH_TAX_4_TAX)+ Number(result_document.PURCH_TAX_5_TAX)+ Number(result_document.PURCH_TAX_6_TAX)+ Number(result_document.PURCH_TAX_7_TAX)
                            + Number(result_document.PURCH_TAX_8_TAX);
                            //CALC['BADGONJE_GEN_NOTAX_TAX'] = result_document.PURCH_AN_TOTAL_BULTAX;
                            CALC['BADGONJE_GEN_NOTAX_TAX'] = Number(result_document.PURCH_AN_1_BULTAX) + Number(result_document.PURCH_AN_2_BULTAX)+ Number(result_document.PURCH_AN_3_BULTAX)
                            + Number(result_document.PURCH_AN_4_BULTAX)+ Number(result_document.PURCH_AN_5_BULTAX);
                            //CALC['BADGONJE_GEN_NOTAX_AMT'] = result_document.PURCH_AN_TOTAL_BULTAX * 10;
                            CALC['BADGONJE_GEN_NOTAX_AMT'] = (Number(result_document.PURCH_AN_1_BULTAX) + Number(result_document.PURCH_AN_2_BULTAX)+ Number(result_document.PURCH_AN_3_BULTAX)
                            + Number(result_document.PURCH_AN_4_BULTAX)+ Number(result_document.PURCH_AN_5_BULTAX))*10

                            if(isNaN(CALC['BADGONJE_BAD_AMT'])) CALC['BADGONJE_BAD_AMT'] = 0;
                            if(isNaN(CALC['BADGONJE_BAD_TAX'])) CALC['BADGONJE_BAD_TAX'] = 0;
                            if(isNaN(CALC['BADGONJE_GEN_NOTAX_TAX'])) CALC['BADGONJE_GEN_NOTAX_TAX'] = 0;
                            if(isNaN(CALC['BADGONJE_GEN_NOTAX_AMT'])) CALC['BADGONJE_GEN_NOTAX_AMT'] = 0;
                        }
                        innerCallback(null, false);

                    });
                }
            ],

            function(err){

                if(err){ console.error('mongo aggregate error occurred'); }

                //확정 신고 일때 전자신고세액공제 10,000 원
                if(confirm_period === true) {
                    CALC['ETCKG_ELECSINGO_TAX'] = 10000;
                }
                var ModelClass = models(VATNO);

                var mongoModel = new ModelClass();

                for(var key in CALC){
                    if(CALC.hasOwnProperty(key)){
                        mongoModel[key] = CALC[key];
                    }
                }

                //ROOTKEY 설정.
                mongoModel['VATKEY'] = keyRef.VATKEY;

                /**
                 * 결과 값을 Callback 으로 보냄.!!!
                 */
                callback(false,mongoModel);

            }
        );
    }
};
