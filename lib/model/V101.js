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
    "INVOICE_SUCHI_AMT": "0"
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
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+VATROOTKEY.VATNO
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

        if(VATROOTKEY.VATQT === '11'){
            report_from_date = new Date(VATROOTKEY.YEAR,1,1);
            report_to_date = new Date(VATROOTKEY.YEAR,3,31);
        }else if(VATROOTKEY.VATQT === '12'){
            report_from_date = new Date(VATROOTKEY.YEAR,4,1);
            report_to_date = new Date(VATROOTKEY.YEAR,6,30);
            missing_from_date = new Date(VATROOTKEY.YEAR,1,1);
            missing_to_date = new Date(VATROOTKEY.YEAR,3,31);
        }else if(VATROOTKEY.VATQT === '21'){
            report_from_date = new Date(VATROOTKEY.YEAR,7,1);
            report_to_date = new Date(VATROOTKEY.YEAR,9,30);
        }else if(VATROOTKEY.VATQT === '22'){
            report_from_date = new Date(VATROOTKEY.YEAR,10,1);
            report_to_date = new Date(VATROOTKEY.YEAR,12,31);
            missing_from_date = new Date(VATROOTKEY.YEAR,7,1);
            missing_to_date = new Date(VATROOTKEY.YEAR,9,30);
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
                                "BSE_VAT Total Report": 1,      //1: Yes
                                "BSE_VAT Category Code" : 'S010',
                                "BSE_Buyer Issued" : 0,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                "BSE_VAT Total Report": 1,      //1: Yes
                                "BSE_VAT Category Code" : 'S010',
                                "BSE_Buyer Issued" : 1,  //1: Yes
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                },
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                },
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                "BSE_VAT Total Report": 1,      //1: Yes
                                "BSE_VAT Category Code" : 'S020',
                                "BSE_Buyer Issued" : 0,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                },
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                "BSE_VAT Total Report": 1, //1: Yes
                                "BSE_VAT Category Code" : {
                                    $in : ['P010','P020','P030','P040']
                                },
                                "BSE_Buyer Issued" : 0,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                "BSE_VAT Total Report": 1, //1: Yes
                                "BSE_VAT Category Code" : {
                                    $in : ['P051','P052','P053','P054','P281','P282',
                                        'P283','P284','P301','P302','P303','P304']
                                },
                                "BSE_Buyer Issued" : 0,  //0: No
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                "BSE_VAT Total Report": 1, //1: Yes
                                "BSE_VAT Category Code" : {
                                    $in : ['P010','P020','P030','P040','P051','P052','P053','P054','P281',
                                        'P282','P283','P284','P301','P302','P303','P304']
                                },
                                "BSE_Buyer Issued" : 1,  //1: Yes
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                "BSE_Non-VAT Total Report": 1, //1: Yes
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                "BSE_Non-VAT Total Report": 1, //1: Yes
                                "BSE_VAT Date":{
                                    $gte : report_from_date,
                                    $lte : report_to_date
                                }
                            })
                            .group({
                                _id: "",
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Total Amount"
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
                                    "BSE_VAT Total Report": 1,      //1: Yes
                                    "BSE_VAT Category Code": 'S010',
                                    "BSE_Buyer Issued": 0,  //0: No
                                    "BSE_VAT Missing": 1, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                                    "BSE_VAT Missing": 1, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                                    "BSE_VAT Total Report": 1,      //1: Yes
                                    "BSE_VAT Category Code": 'S020',
                                    "BSE_Buyer Issued": 0,  //0: No
                                    "BSE_VAT Missing": 1, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                                    "BSE_VAT Missing": 1, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                                    "BSE_VAT Missing": 1, //1: Yes
                                    "BSE_VAT Total Report": 1, //1: Yes
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                                    },
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: missing_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                                    "BSE_VAT Total Report": 1, //1:Yes
                                    "BSE_ETAX Complete issue": 2, //2: Delays
                                    "BSE_VAT Date": {
                                        $gte: missing_from_date,
                                        $lte: report_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                                    "BSE_VAT Total Report": 1, //1:Yes
                                    "BSE_ETAX Complete issue": 2, //2: Delays
                                    "BSE_VAT Date": {
                                        $gte: report_from_date,
                                        $lte: report_to_date
                                    }
                                })
                                .group({
                                    _id: "",
                                    TotAmount: {  //공급가액
                                        $sum: "$BSE_Editable Tot Total Amount"
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
                }
            ],

            function(err){

                if(err){ console.error('mongo aggregate error occurred'); }

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
