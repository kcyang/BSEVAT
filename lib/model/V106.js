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
var CALC = {};
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
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+VATROOTKEY.VATNO
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


                function(innerCallback) {

                    MODEL.find().exec(function(err,doc){
                        if (err) {
                            console.error('Aggregation ERROR ...' + err);
                        } else {
                            if (doc.length !== 0) {
                                console.error('전자세금계산서 외 상세[%d]', res.length);
                                for (var i in doc) {
                                    if (doc.hasOwnProperty(i)) {

                                        SUB_ARR = {};
                                        SUB_ARR['DOC_NAME'] = doc[i].DOC;
                                        SUB_ARR['THIS_INTRO_FOR_AMT'] = doc[i].FCY;
                                        SUB_ARR['THIS_INTRO_WON_AMT'] = doc[i].LCY;
                                        CALC_SUB[i] = SUB_ARR;
                                        /*
                                         if(res.length !== 0) {
                                         console.error('전자세금계산서 발급분 주민번호분 매수[%d]',res[0].numCnt);
                                         CALC['DOC_NAME'] = res[0].DOC;
                                         CALC['THIS_INTRO_FOR_AMT'] = res[0].FCY;
                                         CALC['ISSUE_MAN'] = res["$BSE_Document Issuing Officer"];
                                         CALC['ISSUE_DATE'] = res["$BSE_Document Issuing Date"];
                                         CALC['SHIP_DATE'] = res["$BSE_Date of Shipment"];
                                         CALC['CURRENCY CODE'] = res["$BSE_Currency Code"];
                                         CALC['EXCHANGE RATE'] = res["$BSE_Currency Factor"];
                                         CALC['THIS_INTRO_FOR_AMT'] = res["$BSE_Amonut(FCY)"];
                                         CALC['THIS_INTRO_WON_AMT'] = res["$BSE_Amount(LCY)"];
                                         CALC['THIS_SINGO_FOR_AMT'] = res["$BSE_Amonut(FCY)"];
                                         CALC['THIS_SINGO_WON_AMT'] = res["$BSE_Amount(LCY)"];
                                         */
                                    }
                                }
                            }
                        }
                        innerCallback(null, false);
                    });

/*
                        MODEL.aggregate()

                            .match({
                                "BSE_VAT Category Code": "S130",
                                "BSE_ZeroRating Type": 2,
                                "BSE_Closing": 1
                            })
                            .group({
                                _id: "",
                                DOC : {$push : "$BSE_Document Name"}

                            })

                            .exec(function (err, res) {

                                if (err) {
                                    console.error('Aggregation ERROR ...' + err);
                                } else {
                                    if (res.length !== 0) {
                                        console.error('전자세금계산서 외 상세[%d]', res.length);
                                        for (var i in res) {
                                            if (res.hasOwnProperty(i)) {

                                                SUB_ARR = {};
                                                SUB_ARR['DOC_NAME'] = res[i].DOC;
                                                SUB_ARR['THIS_INTRO_FOR_AMT'] = res[i].FCY;
                                                SUB_ARR['THIS_INTRO_WON_AMT'] = res[i].LCY;
                                                CALC_SUB[i] = SUB_ARR;

                                                 if(res.length !== 0) {
                                                 console.error('전자세금계산서 발급분 주민번호분 매수[%d]',res[0].numCnt);
                                                 CALC['DOC_NAME'] = res[0].DOC;
                                                 CALC['THIS_INTRO_FOR_AMT'] = res[0].FCY;
                                                 CALC['ISSUE_MAN'] = res["$BSE_Document Issuing Officer"];
                                                 CALC['ISSUE_DATE'] = res["$BSE_Document Issuing Date"];
                                                 CALC['SHIP_DATE'] = res["$BSE_Date of Shipment"];
                                                 CALC['CURRENCY CODE'] = res["$BSE_Currency Code"];
                                                 CALC['EXCHANGE RATE'] = res["$BSE_Currency Factor"];
                                                 CALC['THIS_INTRO_FOR_AMT'] = res["$BSE_Amonut(FCY)"];
                                                 CALC['THIS_INTRO_WON_AMT'] = res["$BSE_Amount(LCY)"];
                                                 CALC['THIS_SINGO_FOR_AMT'] = res["$BSE_Amonut(FCY)"];
                                                 CALC['THIS_SINGO_WON_AMT'] = res["$BSE_Amount(LCY)"];

                                            }
                                        }
                                    }
                                }
                                innerCallback(null, false);
                            });
                        */

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
