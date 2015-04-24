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
    "ELEC_BUS_SALES_CNT":"0",
    "ELEC_BUS_SALES_QTY":"0",
    "ELEC_BUS_SALES_ACT_AMT":"0",
    "ELEC_BUS_SALES_TAX_AMT":"0",

    "ELEC_PSN_SALES_CNT":"0",
    "ELEC_PSN_SALES_QTY":"0",
    "ELEC_PSN_SALES_ACT_AMT":"0",
    "ELEC_PSN_SALES_TAX_AMT":"0",

    "NON_ELEC_BUS_SALES_CNT":"0",
    "NON_ELEC_BUS_SALES_QTY":"0",
    "NON_ELEC_BUS_SALES_ACT_AMT":"0",
    "NON_ELEC_BUS_SALES_TAX_AMT":"0",

    "NON_ELEC_PSN_SALES_CNT":"0",
    "NON_ELEC_PSN_SALES_QTY":"0",
    "NON_ELEC_PSN_SALES_ACT_AMT":"0",
    "NON_ELEC_PSN_SALES_TAX_AMT":"0"
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
                 * 전자세금 계산서 발급분 / 사업자 등록번호 발급분.
                  * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 0, //사업자 등록번호,
                                "BSE_ETAX Complete issue": 1      //전자세금계산서 발급분 (발행완료)
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
                                        console.error('전자세금계산서 발급분 매수[%d]',res[0].numCnt);
                                        CALC['ELEC_BUS_SALES_QTY'] = res[0].numCnt;
                                        CALC['ELEC_BUS_SALES_ACT_AMT'] = res[0].TotAmount;
                                        CALC['ELEC_BUS_SALES_TAX_AMT'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 0, //사업자 등록번호,
                                "BSE_ETAX Complete issue": 1      //전자세금계산서 발급분 (발행완료)
                            })
                            .group({
                                _id: "$BSE_VAT Registration No_"
                            })
                            .group({
                                _id: "",
                                numCnt: {$sum : 1}  //매출처수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('전자세금계산서 발급분 매출처수 [%d]',res[0].numCnt);
                                        CALC['ELEC_BUS_SALES_CNT'] = res[0].numCnt;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 전자세금계산서 발급분 / 주민등록번호 발행분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 1, //주민 등록번호,
                                "BSE_ETAX Complete issue": 1      //전자세금계산서 발급분 (발행완료)
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
                                        console.error('전자세금계산서 발급분 주민번호분 매수[%d]',res[0].numCnt);
                                        CALC['ELEC_PSN_SALES_QTY'] = res[0].numCnt;
                                        CALC['ELEC_PSN_SALES_ACT_AMT'] = res[0].TotAmount;
                                        CALC['ELEC_PSN_SALES_TAX_AMT'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 1, //주민 등록번호,
                                "BSE_ETAX Complete issue": 1      //전자세금계산서 발급분 (발행완료)
                            })
                            .group({
                                _id: "$BSE_VAT Registration No_"
                            })
                            .group({
                                _id: "",
                                numCnt: {$sum : 1}  //매출처수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('전자세금계산서 발급분 주민 등록번호 매출처수 [%d]',res[0].numCnt);
                                        CALC['ELEC_PSN_SALES_CNT'] = res[0].numCnt;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 전자세금계산서 외 발급분 / 사업자 등록번호 발급분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 0, //사업자 등록번호,
                                "BSE_ETAX Complete issue": {
                                    $in : [0,2]
                                }      //전자세금계산서 외 발급분 (미처리/지연발행)
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
                                        console.error('전자세금계산서 외 발급분 사업자 등록번호 매수[%d]',res[0].numCnt);
                                        CALC['NON_ELEC_BUS_SALES_QTY'] = res[0].numCnt;
                                        CALC['NON_ELEC_BUS_SALES_ACT_AMT'] = res[0].TotAmount;
                                        CALC['NON_ELEC_BUS_SALES_TAX_AMT'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 0, //사업자 등록번호,
                                "BSE_ETAX Complete issue": {
                                    $in : [0,2]
                                }      //전자세금계산서 외 발급분 (미처리/지연발행)
                            })
                            .group({
                                _id: "$BSE_VAT Registration No_"
                            })
                            .group({
                                _id: "",
                                numCnt: {$sum : 1}  //매출처수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('전자세금계산서 외 발급분 사업자 등록번호 매출처수 [%d]',res[0].numCnt);
                                        CALC['NON_ELEC_BUS_SALES_CNT'] = res[0].numCnt;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 전자세금계산서 외 발급분 / 주민번호 발급분
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 1, //주민 등록번호,
                                "BSE_ETAX Complete issue": {
                                    $in : [0,2]
                                }      //전자세금계산서 외 발급분 (미처리/지연발행)
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
                                        console.error('전자세금계산서 외 주민 등록번호 발급분[%d]',res[0].numCnt);
                                        CALC['NON_ELEC_PSN_SALES_QTY'] = res[0].numCnt;
                                        CALC['NON_ELEC_PSN_SALES_ACT_AMT'] = res[0].TotAmount;
                                        CALC['NON_ELEC_PSN_SALES_TAX_AMT'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_Pay_Bill CorpIndv Type": 1, //주민등록번호,
                                "BSE_ETAX Complete issue": {
                                    $in : [0,2]
                                }      //전자세금계산서 외 발급분 (미처리/지연발행)
                            })
                            .group({
                                _id: "$BSE_VAT Registration No_"
                            })
                            .group({
                                _id: "",
                                numCnt: {$sum : 1}  //매출처수
                            })
                            .exec(function(err,res){

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('전자세금계산서 외 주민등록번호 발급분 매출처수 [%d]',res[0].numCnt);
                                        CALC['NON_ELEC_PSN_SALES_CNT'] = res[0].numCnt;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 전자세금계산서 외의 발급분에 대한 매출처별 명세
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_ETAX Complete issue": {
                                    $in : [0,2]
                                }      //전자세금계산서 외 발급분 (미처리/지연발행)
                            })
                            .group({
                                _id: {
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

                                if(err){
                                    console.error('Aggregation ERROR ...'+err);
                                }else{
                                    if(res.length !== 0) {
                                        console.error('전자세금계산서 외 상세[%d]',res.length);
                                        for(var i in res){
                                            if(res.hasOwnProperty(i)){
                                                SUB_ARR = {};
                                                SUB_ARR['NON_ELEC_NO'] = i+1;
                                                SUB_ARR['NON_ELEC_BUS_NO'] = res[i]._id.BusNo;
                                                SUB_ARR['NON_ELEC_BUS_NAME'] = res[i]._id.BusName;
                                                SUB_ARR['NON_ELEC_QTY'] = res[i].numCnt;
                                                SUB_ARR['NON_ELEC_ACT_AMT'] = res[i].TotAmount;
                                                SUB_ARR['NON_ELEC_TAX_AMT'] = res[i].VatAmount;
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
