'use strict';
/**
 * 각 화면에 따른 값을 셋업하는 곳, NAV 에서 가져와서 Mongo 에 넣은 값을
 * 여기서 꺼내서 합산 하거나 계산하여, 결과 값을 넣어준 후에, 해당 모델을
 * 리턴해 준다.
 * 여기는, 새로운 값을 넣을 때 필요한 곳.
 * @TODO '이 부분은 후에 설정파일에서 읽어와서 값을 대체해서 진행되도록 할 것'
 * @TODO 'Schema 를 가져와서, 그 놈을 가지고 셋업하는 것도 나쁘지 않음'
 */
var async = require('async');
var mongoose = require('mongoose');
var models = require('../../models');

//var schemaConfig = require('../../lib/createSchema.js');
//var dummySchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var CALC = [{
    TAX_CARD_AMOUNT: 0,
    TAX_CASH_AMOUNT: 0,
    NOTAX_CARD_AMOUNT: 0,
    NOTAX_CASH_AMOUNT: 0
}];

exports.setModel = function(VATNO,/*MODEL,*/callback){

    var MODEL = {};

    if(mongoose.model(VATNO)){
        MODEL = mongoose.model(VATNO);
    }else{
        MODEL = models(VATNO); //#0929
    }


    console.log('call setModel function');
//    console.error('Parameter VATNO['+VATNO+'] MODEL Object['+MODEL+']');

    if(MODEL === null || typeof MODEL === 'undefined'){

        console.error('ERROR Model undefined or not a mongo model.');
        callback(true,'ERROR Model undefined or not a mongo model.');

    }else{

        //Mongoose Aggregate...

        async.parallel([

            function(innerCallback){
                MODEL.aggregate()
                    .match({
                        "BSE_VAT Category Code": { $in:["S060","S070"]} //신용카드 과세분
                    })
                    .group({
                        _id: "$BSE_VAT Category Code",
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
                                CALC[0].TAX_CARD_AMOUNT = res[0].result;
                            }
                        }
                        innerCallback(null,false);
                    });
            },
            function(innerCallback){

                MODEL.aggregate()
                    .match({
                        "BSE_VAT Category Code": {$in:["S090","S100"]} //현금영수증 과세분
                    })
                    .group({
                        _id: "$BSE_VAT Category Code",
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
                        _id: "$BSE_VAT Category Code",
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
                        _id: "$BSE_VAT Category Code",
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
                                CALC[0].NOTAX_CASH_AMOUNT = res[0].result;
                            }
                        }
                        innerCallback(null,false);
                    });
            }],

            function(err){

                if(err){console.error('mongo aggregate error occurred');}
//#0929   START
                //var mongoModel = new MODEL();
                var mongoModel = models(VATNO);

                for(var key in CALC[0]){
                    if(CALC[0].hasOwnProperty(key)){
                        mongoModel[key] = CALC[0][key];
                    }
                }
                callback(false,mongoModel);
//#0929   END

/*
                if(mongoose.model(VATNO)){

                    var ModelResult = mongoose.model(VATNO);
                    var mongoModel = new ModelResult();

                    for(var key in CALC[0]){
                        if(CALC[0].hasOwnProperty(key)){
                            mongoModel[key] = CALC[0][key];
                        }
                    }
                    callback(false,mongoModel);

                }else{

                    schemaConfig.makeMSchema(VATNO,function(err,mongoose_schema){
                        if(err) {
                            console.error('오류가 발생..'+mongoose_schema);
                            callback(true,'Schema creation error!');
                        }else {
                            var ModelResult = mongoose.model(VATNO,mongoose_schema);
                            var mongoModel = new ModelResult();

                            for(var key in CALC[0]){
                                if(CALC[0].hasOwnProperty(key)){
                                    mongoModel[key] = CALC[0][key];
                                }
                            }
                            callback(false,mongoModel);
                        }
                    });
                }
*/
            }
        //and, callback.
        );
    }
};
