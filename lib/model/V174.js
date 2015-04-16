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
    "TOT_COUNT" : 0,
    "TOT_AMOUNT" : 0,
    "LC_COUNT" : 0,
    "LC_AMOUNT" : 0,
    "PUR_COUNT" : 0,
    "PUR_AMOUNT" : 0
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
        var model_name = VATNO.concat('raws').toLowerCase();

        var MODEL = models(VATNO+'raws');

        //Mongoose Aggregate.#TODO Aggregate 부분을 좀 더 구조화 할 것.

        /**
         * Async Module 중에, Parallel 을 사용함.
         * 이 기능은, 나열된 Function 을 동시에 실행하되,
         * 모두 끝마치면, 마지막 Function 을 Call 하게 되어 있음.
         */
        async.parallel([
            /**
             * 합계 건수/금액(원)
             * @param innerCallback
             */
                function(innerCallback){

                MODEL.find({},function(err){

                    //내국신용장+구매확인서 ..
                    MODEL.aggregate()
                        .match({
                            "BSE_Document Name":
                            { $in : [4,5]}  //내국신용장+구매확인서
                        })
                        .group({
                            _id: "",
                            TotAmount: {  //합계금액
                                $sum : "$BSE_Editable Tot Total Amount"
                            },
                            numCnt: {$sum : 1}  //매수
                        })
                        .exec(function(err,res){

                            if(err){
                                console.error('Aggregation ERROR ...'+err);
                            }else{
                                if(res.length !== 0) {
                                    console.error('합계 건수[%d]',res[0].numCnt);
                                    CALC['TOT_COUNT'] = res[0].numCnt;
                                    CALC['TOT_AMOUNT'] = res[0].TotAmount;
                                }
                            }
                            innerCallback(null,false);
                        });
                });
            },
            /**
             * 내국신용장 건수/금액(원)
             * @param innerCallback
             */
                function(innerCallback){

                MODEL.find({},function(err){

                    //내국신용장 ..
                    MODEL.aggregate()
                        .match({
                            "BSE_Document Name":
                            { $in : [4]}  //내국신용장 LC
                        })
                        .group({
                            _id: "",
                            TotAmount: {  //합계금액
                                $sum : "$BSE_Editable Tot Total Amount"
                            },
                            numCnt: {$sum : 1}  //매수
                        })
                        .exec(function(err,res){

                            if(err){
                                console.error('Aggregation ERROR ...'+err);
                            }else{
                                if(res.length !== 0) {
                                    console.error('내국신용장 건수[%d]',res[0].numCnt);
                                    CALC['LC_COUNT'] = res[0].numCnt;
                                    CALC['LC_AMOUNT'] = res[0].TotAmount;
                                }
                            }
                            innerCallback(null,false);
                        });
                });
            },
            /**
             * 구매확인서 건수/금액
             * @param innerCallback
             */
            function(innerCallback){

                MODEL.find({},function(err){

                    //구매확인서 ..
                    MODEL.aggregate()
                        .match({
                            "BSE_Document Name":
                            { $in : [5]}  //구매확인서
                        })
                        .group({
                            _id: "",
                            TotAmount: {  //합계금액
                                $sum : "$BSE_Editable Tot Total Amount"
                            },
                            numCnt: {$sum : 1}  //매수
                        })
                        .exec(function(err,res){

                            if(err){
                                console.error('Aggregation ERROR ...'+err);
                            }else{
                                if(res.length !== 0) {
                                    console.error('구매확인서 건수[%d]',res[0].numCnt);
                                    CALC['PUR_COUNT'] = res[0].numCnt;
                                    CALC['PUR_AMOUNT'] = res[0].TotAmount;
                                }
                            }
                            innerCallback(null,false);
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
                mongoclient.findSet(model_name,{},function(err,doc){
                    var Seq = 0;

                    if (err) {
                        console.error('Find ERROR ...' + err);
                    } else {
                        console.error('에러는 없고, 결과값은...%d',doc.length);
                        if (doc.length !== 0) {
                            console.error('내국신용장.구매확인서에 의한 공급실적 명세서 [%d]', doc.length);
                            for (var i in doc) {

                                if (doc.hasOwnProperty(i)) {
                                    var sub_doc = doc[i];

                                    Seq = Seq + 1;
                                    SUB_ARR = {};
                                    SUB_ARR['LINE_SEQN'] = Seq;

                                    if (sub_doc['BSE_Document Name']===4) {
                                        SUB_ARR['LINE_TYPE'] = '내국신용장';
                                    } else {
                                        SUB_ARR['LINE_TYPE'] = '구매확인서';
                                    };
                                    SUB_ARR['LINE_DOC_NO'] = sub_doc['BSE_Export Declaration No'];
                                    SUB_ARR['LINE_ISSUE_DATE'] = sub_doc['BSE_Document Issuing Date'];
                                    SUB_ARR['LINE_VAT_REG_NO'] = sub_doc['BSE_VAT Registration No_'];
                                    SUB_ARR['LINE_AMOUNT'] = sub_doc['BSE_Editable Tot Total Amount'];
                                    SUB_ARR['LINE_REMARK'] = sub_doc['BSE_Zero Rating VAT Remark'];
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
