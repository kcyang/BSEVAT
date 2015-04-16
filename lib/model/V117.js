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
var CALC = [{
    TAX_CARD_AMOUNT: 0,
    TAX_CASH_AMOUNT: 0,
    NOTAX_CARD_AMOUNT: 0,
    NOTAX_CASH_AMOUNT: 0,
    SVC_CARD_AMOUNT : 0,
    SVC_CASH_AMOUNT : 0,
    TAX_BILL_AMOUNT : 0,
    BILL_AMOUNT : 0
}];

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

            function(innerCallback){

                MODEL.find({},function(err){
                    //Style #1 몽고에 직접 Query 하는 형식.
                    MODEL.aggregate(
                        [
                            { //match pipeline
                                $match :{
                                    "BSE_VAT Category Code" :{
                                        $in: [ "S060", "S070" ]
                                    }
                                }
                            },
                            { //group pipeline
                                $group :{
                                    _id    : "",
                                    result : {
                                        $sum : "$BSE_Editable Tot Total Amount"
                                    },
                                    numCategory: {$sum:1}
                                }
                            }
                        ]
                    )
                        .exec(function(err,res){
                            if(err){
                                console.error('Aggregation ERROR ...'+err);
                            }else{
                                if(res.length !== 0) {
                                    CALC[0].TAX_CARD_AMOUNT = res[0].result;
                                    console.error('신용카드 과세분 [%d]',res[0].result);
                                }else{
                                    console.error('결과 값이 없는데?!');
                                }
                            }
                            innerCallback(null,false);
                        });
                });
            },
            function(innerCallback){
                MODEL.find({},function(err){
                    //#Style 2  몽구스의 파이프라인 빌더 API 를 이용한 경우,
                    MODEL.aggregate()
                        .match({
                            "BSE_VAT Category Code": {$in:["S090","S100"]} //현금영수증 과세분
                        })
                        .group({
                            _id: "",
                            result: {
                                $sum : "$BSE_Editable Tot Total Amount"
                            },
                            numCategory: {$sum : 1}
                        })
                        .exec(function(err,res){

                            if(err){
                                console.error('Aggregation ERROR ...'+err);
                            }else{
                                if(res.length !== 0) {
                                    console.error('현금영수증 과세분 [%d]',res[0].result);
                                    CALC[0].TAX_CASH_AMOUNT = res[0].result;
                                }
                            }
                            innerCallback(null,false);
                        });
                });
            },
            function(innerCallback){
                MODEL.find({},function(err) {
                    MODEL.aggregate()
                        .match({
                            "BSE_VAT Category Code": "S080" //신용카드 면세분
                        })
                        .group({
                            _id: "",
                            result: {
                                $sum: "$BSE_Editable Tot Total Amount"
                            },
                            numCategory: {$sum: 1}
                        })
                        .exec(function (err, res) {

                            if (err) {
                                console.error('Aggregation ERROR ...' + err);
                            } else {
                                if (res.length !== 0) {
                                    console.error('신용카드 면세분 [%d]',res[0].result);
                                    CALC[0].NOTAX_CARD_AMOUNT = res[0].result;
                                }
                            }

                            innerCallback(null, false);
                        });
                });
            },
            function(innerCallback){
                MODEL.find({},function(err) {
                    MODEL.aggregate()
                        .match({
                            "BSE_VAT Category Code": "S110" //현금영수증 면세분
                        })
                        .group({
                            _id: "",
                            result: {
                                $sum: "$BSE_Editable Tot Total Amount"
                            },
                            numCategory: {$sum: 1}
                        })
                        .exec(function (err, res) {

                            if (err) {
                                console.error('Aggregation ERROR ...' + err);
                            } else {
                                if (res.length !== 0) {
                                    console.error('현금영수증 면세분 [%d]',res[0].result);
                                    CALC[0].NOTAX_CASH_AMOUNT = res[0].result;
                                }
                            }
                            innerCallback(null, false);
                        });
                });
            },
                //세금계산서 교부금액
                function(innerCallback){
                    MODEL.find({},function(err) {
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code": {
                                    $in : ["S090","S100","S060","S070","S080","S110"]
                                },
                                "BSE_Payment Credit Card" : 1
                            })
                            .group({
                                _id: "",
                                result: {
                                    $sum: "$BSE_Editable Tot Total Amount"
                                },
                                numCategory: {$sum: 1}
                            })
                            .exec(function (err, res) {

                                if (err) {
                                    console.error('Aggregation ERROR ...' + err);
                                } else {
                                    if (res.length !== 0) {
                                        console.error('세금계산서 교부금액[%d]',res[0].result);
                                        CALC[0].TAX_BILL_AMOUNT = res[0].result;
                                    }
                                }
                                innerCallback(null, false);
                            });
                    });
                },
                //계산서 교부금액.
                function(innerCallback){
                    MODEL.find({},function(err) {
                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code": {
                                    $in : ["S090","S100","S060","S070","S080","S110"]
                                },
                                "BSE_Payment Credit Card" : 2
                            })
                            .group({
                                _id: "",
                                result: {
                                    $sum: "$BSE_Editable Tot Total Amount"
                                },
                                numCategory: {$sum: 1}
                            })
                            .exec(function (err, res) {

                                if (err) {
                                    console.error('Aggregation ERROR ...' + err);
                                } else {
                                    if (res.length !== 0) {
                                        console.error('계산서 교부금액[%d]',res[0].result);
                                        CALC[0].BILL_AMOUNT = res[0].result;
                                    }
                                }
                                innerCallback(null, false);
                            });
                    });
                }
            ],

            function(err){

                if(err){ console.error('mongo aggregate error occurred'); }

                var ModelClass = models(VATNO);

                var mongoModel = new ModelClass();

                for(var key in CALC[0]){
                    if(CALC[0].hasOwnProperty(key)){
                        mongoModel[key] = CALC[0][key];
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
