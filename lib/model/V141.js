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
var mongoclient = require('../MongoQry');
var async = require('async');

/**
 * 계산된 결과를 담아 놓는 JSON Array Object.
 * 왜 이런 형태로 해야만 하는지 검토해야 됨. (#TODO)
 *
 */
var CALC = {
    "JAE_CNT_TOTAL" : "0",
    "JAE_CURRENCY_AMOUNT_TOTAL" : "0",
    "JAE_AMOUNT_TOTAL" : "",

    "ETC_CNT_TOTAL" : "0",
    "ETC_CURRENCY_AMOUNT_TOTAL" : "0",
    "ETC_AMOUNT_TOTAL" : "0"
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
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+VATROOTKEY.VATNO
        };

        // MSSQL 에서 가져온 Data 를 저장해 둔 raws collection 에서 결과값을 추출 할 것임.
        var model_name = VATNO.concat('raws').toLowerCase();

        var MODEL = models(model_name);

        //Mongoose Aggregate.#TODO Aggregate 부분을 좀 더 구조화 할 것.

        /**
         * Async Module 중에, Parallel 을 사용함.
         * 이 기능은, 나열된 Function 을 동시에 실행하되,
         * 모두 끝마치면, 마지막 Function 을 Call 하게 되어 있음.
         */
        async.parallel([

            function(innerCallback){
                MODEL.find({},function(err) {
                    MODEL.aggregate()
                        .match(
                            {"BSE_ZeroRating Type" : 1}
                        )
                        .group({
                            _id: "",
                            JaeFCY: {  //수출재화 외화금액
                                $sum : "$BSE_Amonut(FCY)"
                            },
                            JaeLCY: {  //수출재화 원화금액
                                $sum : "$BSE_Amount(LCY)"
                            },
                            numCnt: {$sum : 1}  //매수
                        })
                        .exec(function (err, res) {
                            if (err) {
                                console.error('Aggregation ERROR ...' + err);
                            } else {
                                if (res.length !== 0) {
                                    console.error('재화수출 건수 [%d]',res[0].numCnt);
                                    CALC['JAE_CNT_TOTAL'] = res[0].numCnt;
                                    CALC['JAE_CURRENCY_AMOUNT_TOTAL'] = res[0].JaeFCY;
                                    CALC['JAE_AMOUNT_TOTAL'] = res[0].JaeLCY;
                                }
                            }

                            innerCallback(null, false);
                        });
                });
            },

            function(innerCallback){
                MODEL.find({},function(err) {
                    MODEL.aggregate()
                        .match(
                            {"BSE_ZeroRating Type" : 2}
                        )
                        .group({
                            _id: "",
                            ETCFCY: {  //기타수출 외화금액
                                $sum : "$BSE_Amonut(FCY)"
                            },
                            ETCLCY: {  //기타수출 원화금액
                                $sum : "$BSE_Amount(LCY)"
                            },
                            numCnt: {$sum : 1}  //매수
                        })
                        .exec(function (err, res) {

                            if (err) {
                                console.error('Aggregation ERROR ...' + err);
                            } else {
                                if (res.length !== 0) {
                                    console.error('기타 외화 금액 [%d]',res[0].numCnt);
                                    CALC['ETC_CNT_TOTAL'] = res[0].numCnt;
                                    CALC['ETC_CURRENCY_AMOUNT_TOTAL'] = res[0].ETCFCY;
                                    CALC['ETC_AMOUNT_TOTAL'] = res[0].ETCLCY;
                                }
                            }

                            innerCallback(null, false);
                        });
                });
            },
            function(innerCallback) {

                /**
                 *
                 ["EXPORT REPORT NO","String"],         #수출신고번호
                 ["SHIP_DATE","Date"],          #선적일자
                 ["CURRENCY CODE","String"],          #수출통화코드
                 ["EXCHANGE RATE","Number"],          #환율
                 ["CURRENCY AMOUNT","Number"],          #외화금액
                 ["AMOUNT","Number"],          #원화금액
                 *
                 *
                 */
                mongoclient.findSet(model_name,{"BSE_ZeroRating Type" : 1},function(err,doc){
                    var Seq = 0;
                    if (err) {
                        console.error('Find ERROR ...' + err);
                    } else {
                        console.error('에러는 없고, 결과값은...%d',doc.length);
                        if (doc.length !== 0) {
                            console.error('수출실적 명세서 기타영세건 [%d]', doc.length);
                            for (var i in doc) {
                                if (doc.hasOwnProperty(i)) {
                                    var sub_doc = doc[i];

                                    Seq = Seq + 1;
                                    SUB_ARR = {};
                                    SUB_ARR['SEQN'] = Seq;
                                    SUB_ARR['EXPORT REPORT NO'] = sub_doc['BSE_Export Declaration No'];
                                    SUB_ARR['SHIP_DATE'] = sub_doc['BSE_Date of Shipment'];
                                    SUB_ARR['CURRENCY CODE'] = sub_doc['BSE_Currency Code'];
                                    SUB_ARR['EXCHANGE RATE'] = sub_doc['BSE_Currency Factor'];
                                    SUB_ARR['CURRENCY AMOUNT'] = sub_doc['BSE_Amonut(FCY)'];
                                    SUB_ARR['AMOUNT'] = sub_doc['BSE_Amount(LCY)'];
                                    CALC_SUB[i] = SUB_ARR;
                                }
                            }
                        }
                    }
                    innerCallback(null,false);
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
