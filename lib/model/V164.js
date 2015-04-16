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
    "TOTAL_COUNT" : 0,
    "TOTAL_AMOUNT" : 0,
    "TOTAL_TAX" : 0,
    "GE_TOTAL_COUNT" : 0,
    "GE_TOTAL_AMOUNT" : 0,
    "GE_TOTAL_TAX" : 0,
    "FA_TOTAL_COUNT" : 0,
    "FA_TOTAL_AMOUNT" : 0,
    "FA_TOTAL_TAX" : 0,
    "CASH_COUNT" : 0,
    "CASH_AMOUNT_TOTAL" : 0,
    "CASH_TAX_TOTAL" : 0,
    "DRIVER_COUNT" : 0,
    "DRIVER_AMOUNT_TOTAL" : 0,
    "DRIVER_TAX_TOTAL" : 0,
    "BUSINESS_CARD_COUNT" : 0,
    "BUSINESS_CARD_AMOUNT_TOTAL" : 0,
    "BUSINESS_CARD_TAX_TOTAL" : 0,
    "CARD_COUNT" : 0,
    "CARD_AMOUNT_TOTAL" : 0,
    "CARD_TAX_TOTAL" : 0,
    "FA_CASH_COUNT" : 0,
    "FA_CASH_AMOUNT_TOTAL" : 0,
    "FA_CASH_TAX_TOTAL" : 0,
    "FA_DRIVER_COUNT" : 0,
    "FA_DRIVER_AMOUNT_TOTAL" : 0,
    "FA_DRIVER_TAX_TOTAL" : 0,
    "FA_BUSINESS_CARD_COUNT" : 0,
    "FA_BUSINESS_CARD_AMOUNT_TOTAL" : 0,
    "FA_BUSINESS_CARD_TAX_TOTAL" : 0,
    "FA_CARD_COUNT" : 0,
    "FA_CARD_AMOUNT_TOTAL" : 0,
    "FA_CARD_TAX_TOTAL" : 0,
    "GE_CASH_COUNT" : 0,
    "GE_CASH_AMOUNT_TOTAL" : 0,
    "GE_CASH_TAX_TOTAL" : 0,
    "GE_DRIVER_COUNT" : 0,
    "GE_DRIVER_AMOUNT_TOTAL" : 0,
    "GE_DRIVER_TAX_TOTAL" : 0,
    "GE_BUSINESS_CARD_COUNT" : 0,
    "GE_BUSINESS_CARD_AMOUNT_TOTAL" : 0,
    "GE_BUSINESS_CARD_TAX_TOTAL" : 0,
    "GE_CARD_COUNT" : 0,
    "GE_CARD_AMOUNT_TOTAL" : 0,
    "GE_CARD_TAX_TOTAL" : 0
};
var SUB_ARR = {};
var CALC_SUB = [];

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

        // MSSQL 에서 가져온 Data 를 저장해 둔 raws collection 에서 결과값을 추출 할 것임.
        var MODEL = models(VATNO+'raws');

        //Mongoose Aggregate.#TODO Aggregate 부분을 좀 더 구조화 할 것.

        /**
         * Async Module 중에, Parallel 을 사용함.
         * 이 기능은, 나열된 Function 을 동시에 실행하되,
         * 모두 끝마치면, 마지막 Function 을 Call 하게 되어 있음.
         */
        async.parallel([

                /**
                 * 현금영수증 세액/공급가액.
                  * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        //현금영수증 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P220","P230","P240","P251","P252","P253","P254","P261","P262"]}
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
                                        console.error('현금영수증 발급분 매수[%d]',res[0].numCnt);
                                        CALC['GE_CASH_COUNT'] = res[0].numCnt;
                                        CALC['GE_CASH_AMOUNT_TOTAL'] = res[0].TotAmount;
                                        CALC['GE_CASH_TAX_TOTAL'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 기타신용카드 세액/공급가액
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        //기타신용카드 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P180","P190","P200","P211","P212","P213","P214"]}
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
                                        console.error('기타 신용카드 발급분 매수[%d]',res[0].numCnt);
                                        CALC['GE_CARD_COUNT'] = res[0].numCnt;
                                        CALC['GE_CARD_AMOUNT_TOTAL'] = res[0].TotAmount;
                                        CALC['GE_CARD_TAX_TOTAL'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 고정자산 현금영수증 세액/공급가액.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        //현금영수증 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P331","P332","P333","P334","P341","P342","P343","P344"]}
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
                                        console.error('고정자산 현금영수증 발급분 매수[%d]',res[0].numCnt);
                                        CALC['FA_CASH_COUNT'] = res[0].numCnt;
                                        CALC['FA_CASH_AMOUNT_TOTAL'] = res[0].TotAmount;
                                        CALC['FA_CASH_TAX_TOTAL'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 고정자산 기타신용카드 세액/공급가액
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        //기타신용카드 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P311","P312","P313","P314","P321","P322","P323","P324"]}
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
                                        console.error('고정자산 기타 신용카드 발급분 매수[%d]',res[0].numCnt);
                                        CALC['FA_CARD_COUNT'] = res[0].numCnt;
                                        CALC['FA_CARD_AMOUNT_TOTAL'] = res[0].TotAmount;
                                        CALC['FA_CARD_TAX_TOTAL'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 신용카드 및 직불카드 명세
                 * @param innerCallback
                 */
                function(innerCallback){
                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P180","P190","P200","P211","P212","P213","P214","P311","P312","P313","P314","P321","P322","P323","P324","P220",
                                    "P230","P240","P251","P252","P253","P254","P261","P262","P331","P332","P333","P334","P341","P342","P343","P344"]}
                            })
                            .group({
                                _id: {
                                    CardNo : "$BSE_Credit Card Number",
                                    BusNo : "$BSE_VAT Registration No_",
                                    BusName : "$BSE_VAT Name"
                                },
                                TotAmount: {  //공급가액
                                    $sum : "$BSE_Editable Tot Actual Amount"
                                },
                                VatAmount: {  //세액
                                    $sum : "$BSE_Editable Tot VAT Amount"
                                },
                                numCnt: {$sum : 1}  //매수
                            })
                            .exec(function(err,res){
                                var Seq = 0;

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('전자세금계산서 외 상세[%d]',res.length);
                                        for(var i in res){
                                            if(res.hasOwnProperty(i)){

                                                Seq = Seq +1;

                                                SUB_ARR = {};

                                                SUB_ARR['SEQN'] = Seq;
                                                SUB_ARR['CARD_NUMBER'] = res[i]._id.CardNo;
                                                SUB_ARR['BUSINESS_NO'] = res[i]._id.BusNo;
                                                SUB_ARR['BUSINESS_NAME'] = res[i]._id.BusName;
                                                SUB_ARR['CNT'] = res[i].numCnt;
                                                SUB_ARR['SUPPLY_AMOUNT'] = res[i].TotAmount;
                                                SUB_ARR['TAX_AMOUNT'] = res[i].VatAmount;
                                                CALC_SUB[i] = SUB_ARR;
                                            }
                                        }
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
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

                mongoModel['SUB'] = CALC_SUB;

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
