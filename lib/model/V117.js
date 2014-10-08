'use strict';
/**
 * 각 화면에 따른 값을 셋업하는 곳, NAV 에서 가져와서 Mongo 에 넣은 값을
 * 여기서 꺼내서 합산 하거나 계산하여, 결과 값을 넣어준 후에, 해당 모델을
 * 리턴해 준다.
 * 여기는, 새로운 값을 넣을 때 필요한 곳.
 * #DONE 20141002 '이 부분은 후에 설정파일에서 읽어와서 값을 대체해서 진행되도록 할 것'
 */
var async = require('async');
//var mongoose = require('mongoose');
var models = require('../../models');

var CALC = [{
    TAX_CARD_AMOUNT: 0,
    TAX_CASH_AMOUNT: 0,
    NOTAX_CARD_AMOUNT: 0,
    NOTAX_CASH_AMOUNT: 0
}];

exports.setValue = function(VATNO,callback){

    if(VATNO === 'undefined' || VATNO === null){
        console.error('ERROR VATNO undefined');
        callback(true,'ERROR VATNO undefined');
    }else{

    var modelClass = models(VATNO+'raws');
    var MODEL = new modelClass();


    MODEL.findOne(function(err,doc){
       console.error(doc);
    });
    //Mongoose Aggregate.#TODO Aggregate 부분을 좀 더 구조화 할 것.

    async.parallel([

        function(innerCallback){

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
                    }else{
                        console.error('결과 값이 없는데?!');
                    }
                }
                innerCallback(null,false);
            });
/*
            MODEL.aggregate()
                .match({
                    "BSE_VAT Category Code": { $in:["S060","S070"]} //신용카드 과세분
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
console.error('result >>'+res[0]);
                            CALC[0].TAX_CARD_AMOUNT = res[0].result;
                        }
                    }
                    innerCallback(null,false);
                });
*/
        },
        function(innerCallback){

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
                            console.error('result 2>>'+res[0]);
                            CALC[0].TAX_CASH_AMOUNT = res[0].result;
                        }
                    }
                    innerCallback(null,false);
                });
        },
        function(innerCallback){

            MODEL.aggregate()
                .match({
                    "BSE_VAT Category Code": "S080" //신용카드 면세분
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
                            console.error('result 3>>'+res[0]);
                            CALC[0].NOTAX_CARD_AMOUNT = res[0].result;
                        }
                    }

                    innerCallback(null,false);
                });
        },
        function(innerCallback){

            MODEL.aggregate()
                .match({
                    "BSE_VAT Category Code": "S110" //현금영수증 면세분
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
                            console.error('result 4>>'+res[0]);
                            CALC[0].NOTAX_CASH_AMOUNT = res[0].result;
                        }
                    }
                    innerCallback(null,false);
                });
        }],

        function(err){

            if(err){ console.error('mongo aggregate error occurred'); }

            var ModelClass = models(VATNO);

            var mongoModel = new ModelClass();

            for(var key in CALC[0]){
                if(CALC[0].hasOwnProperty(key)){
                    mongoModel[key] = CALC[0][key];
                }
            }
            callback(false,mongoModel);

        }
    );
  }
};
