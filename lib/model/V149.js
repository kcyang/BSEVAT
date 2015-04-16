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
    "BID_COUNT" : 0,
    "BID_AMOUNT" : 0,
    "BID_TAX" : 0,
    "MAC_COUNT" : 0,
    "MAC_AMOUNT" : 0,
    "MAC_TAX" : 0,
    "CAR_COUNT" : 0,
    "CAR_AMOUNT" : 0,
    "CAR_TAX" : 0,
    "ETC_COUNT" : 0,
    "ETC_AMOUNT" : 0,
    "ETC_TAX" : 0
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
                 *  건물.구출물 공급가액/세액.
                  * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        //건물.구출물 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P051","P271","P281","P291","P301","P311","P321","P331","P341"]}
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
                                        console.error('건물.구축물 건수[%d]',res[0].numCnt);
                                        CALC['BID_COUNT'] = res[0].numCnt;
                                        CALC['BID_AMOUNT'] = res[0].TotAmount;
                                        CALC['BID_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 기계장치 공급가액/세액
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        //기계장치 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P052","P272","P282","P292","P302","P312","P322","P332","P342"]}
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
                                        console.error('기계장치 건수[%d]',res[0].numCnt);
                                        CALC['MAC_COUNT'] = res[0].numCnt;
                                        CALC['MAC_AMOUNT'] = res[0].TotAmount;
                                        CALC['MAC_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 차량운반구 공급가액/세액.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        //차량운반구 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P053","P273","P283","P293","P303","P313","P323","P333","P343"]}
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
                                        console.error('차량운반구 건수[%d]',res[0].numCnt);
                                        CALC['CAR_COUNT'] = res[0].numCnt;
                                        CALC['CAR_AMOUNT'] = res[0].TotAmount;
                                        CALC['CAR_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 그 밖의 감가상각자산 공급가액/세액
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        //그 밖의 감가상각자산 ..
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P054","P274","P284","P294","P304","P314","P324","P334","P344"]}
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
                                        console.error('그 밖의 감가상각자산 건수[%d]',res[0].numCnt);
                                        CALC['ETC_COUNT'] = res[0].numCnt;
                                        CALC['ETC_AMOUNT'] = res[0].TotAmount;
                                        CALC['ETC_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
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
