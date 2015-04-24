'use strict';
/**
 * 각 화면에 따른 값을 셋업하는 곳, NAV 에서 가져와서 Mongo 에 넣은 값을
 * 여기서 꺼내서 합산 하거나 계산하여, 결과 값을 넣어준 후에, 해당 모델을
 * 리턴해 준다.
 * 여기 로직을 Config 에서 읽어서 자동화 할 수 있는 방안을 생각해 봐야 됨.(#TODO)
 */
var mongoclient = require('../MongoQry');
var async = require('async');
/**
 * 계산된 결과를 담아 놓는 JSON Array Object.
 * 왜 이런 형태로 해야만 하는지 검토해야 됨. (#TODO)
 *
 */
var CALC = {
    "DOC_CNT" : 0,
    "TOT_INTRO_FOR_AMT" : 0,
    "TOT_INTRO_WON_AMT" : 0,
    "TOT_SINGO_FOR_AMT" : 0,
    "TOT_SINGO_WON_AMT" : 0
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

        var model_name = VATNO.concat('raws').toLowerCase();

        var MODEL = models(VATNO+'raws');

        /**
         * Async Module 중에, Parallel 을 사용함.
         * 이 기능은, 나열된 Function 을 동시에 실행하되,
         * 모두 끝마치면, 마지막 Function 을 Call 하게 되어 있음.
         */

        // MSSQL 에서 가져온 Data 를 저장해 둔 raws collection 에서 결과값을 추출 할 것임.
        /**
         * >> Client's Field Name,
         ["DOC_SEQ","String"],            #일련번호
         ["DOC_NAME","String"],           #서류명
         ["ISSUE_MAN","String"],          #발급자
         ["ISSUE_DATE","String"],         #발급일자
         ["SHIP_DATE","String"],          #선적일자
         ["CURRENCY CODE","Number"],      #통화코드
         ["EXCHANGE RATE","Number"],      #환율
         ["THIS_INTRO_FOR_AMT","Number"],  #당기제출금액(외화)
         ["THIS_INTRO_WON_AMT","Number"],  #당기제출금액(원화)
         ["THIS_SINGO_FOR_AMT","Number"],  #당기신고해당분(외화)
         ["THIS_SINGO_WON_AMT","Number"],  #당기신고해당분(원화)
         ["REMARK","String"],             #비고

         >> Server Field Name
         "BSE_VAT Category Code" : "S130",
         "BSE_Editable Tot Total Amount" : 15000,
         "BSE_Document Name" : 0,
         "BSE_Document Issuing Officer" : "수입통관2",
         "BSE_Document Issuing Date" : ISODate("2014-03-02T00:00:00.000Z"),
         "BSE_Date of Shipment" : ISODate("2014-03-03T00:00:00.000Z"),
         "BSE_Currency Code" : "EUR",
         "BSE_Currency Factor" : 1500,
         "BSE_Amonut(FCY)" : 533.3299999999999,
         "BSE_Amount(LCY)" : 800000.0000000001,
         */
        async.parallel([
            function(innerCallback) {
                MODEL.find({},function(err){

                    //영세율 ..
                    MODEL.aggregate()
                        .match({})
                        .group({
                            _id: "",
                            TotAmountFCY: {     //외화 합계
                                $sum : "$BSE_Amonut(FCY)"
                            },
                            TotAmountLCY: {     //원화 합계
                                $sum : "$BSE_Amount(LCY)"
                            },
                            numCnt: {$sum : 1}  //매수
                        })
                        .exec(function(err,res){

                            if(err){
                                console.error('Aggregation ERROR ...'+err);
                            }else{
                                if(res.length !== 0) {
                                    console.error('영세율 건수[%d]',res[0].numCnt);
                                    CALC['DOC_CNT'] = res[0].numCnt;
                                    CALC['TOT_INTRO_FOR_AMT'] = res[0].TotAmountFCY;
                                    CALC['TOT_INTRO_WON_AMT'] = res[0].TotAmountLCY;
                                    CALC['TOT_SINGO_FOR_AMT'] = res[0].TotAmountFCY;
                                    CALC['TOT_SINGO_WON_AMT'] = res[0].TotAmountLCY;
                                }
                            }
                            innerCallback(null,false);
                        });
                });
            },
            function(innerCallback) {
                mongoclient.findSet(model_name,{},function(err,doc){
                    var Seq = 0;

                    if (err) {
                        console.error('Find ERROR ...' + err);
                    } else {
                        console.error('에러는 없고, 결과값은...%d',doc.length);
                        if (doc.length !== 0) {
                            console.error('영세율 첨부서류 제출명세서 [%d]', doc.length);
                            for (var i in doc) {

                                if (doc.hasOwnProperty(i)) {
                                    var sub_doc = doc[i];

                                    Seq = Seq + 1;
                                    SUB_ARR = {};

                                    SUB_ARR['DOC_SEQ'] = Seq;
                                    SUB_ARR['DOC_NAME'] = sub_doc['BSE_Document Name'];
                                    SUB_ARR['ISSUE_MAN'] = sub_doc['BSE_Document Issuing Officer'];
                                    SUB_ARR['ISSUE_DATE'] = sub_doc['BSE_Document Issuing Date'];
                                    SUB_ARR['SHIP_DATE'] = sub_doc['BSE_Date of Shipment'];
                                    SUB_ARR['CURRENCY CODE'] = sub_doc['BSE_Currency Code'];
                                    SUB_ARR['EXCHANGE RATE'] = sub_doc['BSE_Currency Factor'];
                                    SUB_ARR['THIS_INTRO_FOR_AMT'] = sub_doc['BSE_Amonut(FCY)'];
                                    SUB_ARR['THIS_INTRO_WON_AMT'] = sub_doc['BSE_Amount(LCY)'];
                                    SUB_ARR['THIS_SINGO_FOR_AMT'] = sub_doc['BSE_Amonut(FCY)'];
                                    SUB_ARR['THIS_SINGO_WON_AMT'] = sub_doc['BSE_Amount(LCY)'];
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
