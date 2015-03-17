'use strict';
/**
 * 공제받지 못할 매입세액
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
    "PURCH_TAX_1_CNT" : "0",
    "PURCH_TAX_2_CNT" : "0",
    "PURCH_TAX_3_CNT" : "0",
    "PURCH_TAX_4_CNT" : "0",
    "PURCH_TAX_5_CNT" : "0",
    "PURCH_TAX_6_CNT" : "0",
    "PURCH_TAX_7_CNT" : "0",
    "PURCH_TAX_8_CNT" : "0",
    "PURCH_TAX_TOTAL_CNT" : "0",
    "PURCH_TAX_1_AMT" : "0",
    "PURCH_TAX_2_AMT" : "0",
    "PURCH_TAX_3_AMT" : "0",
    "PURCH_TAX_4_AMT" : "0",
    "PURCH_TAX_5_AMT" : "0",
    "PURCH_TAX_6_AMT" : "0",
    "PURCH_TAX_7_AMT" : "0",
    "PURCH_TAX_8_AMT" : "0",
    "PURCH_TAX_TOTAL_AMT" : "0",
    "PURCH_TAX_1_TAX" : "0",
    "PURCH_TAX_2_TAX" : "0",
    "PURCH_TAX_3_TAX" : "0",
    "PURCH_TAX_4_TAX" : "0",
    "PURCH_TAX_5_TAX" : "0",
    "PURCH_TAX_6_TAX" : "0",
    "PURCH_TAX_7_TAX" : "0",
    "PURCH_TAX_8_TAX" : "0",
    "PURCH_TAX_TOTAL_TAX" : "0",
    "PURCH_AN_1_ACT" : "0",
    "PURCH_AN_2_ACT" : "0",
    "PURCH_AN_3_ACT" : "0",
    "PURCH_AN_4_ACT" : "0",
    "PURCH_AN_5_ACT" : "0",
    "PURCH_AN_TOTAL_ACT" : "0",
    "PURCH_AN_1_TAX" : "0",
    "PURCH_AN_2_TAX" : "0",
    "PURCH_AN_3_TAX" : "0",
    "PURCH_AN_4_TAX" : "0",
    "PURCH_AN_5_TAX" : "0",
    "PURCH_AN_TOTAL_TAX" : "0",
    "PURCH_AN_1_AMT" : "0",
    "PURCH_AN_2_AMT" : "0",
    "PURCH_AN_3_AMT" : "0",
    "PURCH_AN_4_AMT" : "0",
    "PURCH_AN_5_AMT" : "0",
    "PURCH_AN_TOTAL_AMT" : "0",
    "PURCH_AN_1_NOTAX" : "0",
    "PURCH_AN_2_NOTAX" : "0",
    "PURCH_AN_3_NOTAX" : "0",
    "PURCH_AN_4_NOTAX" : "0",
    "PURCH_AN_5_NOTAX" : "0",
    "PURCH_AN_TOTAL_NOTAX" : "0",
    "PURCH_AN_1_BULTAX" : "0",
    "PURCH_AN_2_BULTAX" : "0",
    "PURCH_AN_3_BULTAX" : "0",
    "PURCH_AN_4_BULTAX" : "0",
    "PURCH_AN_5_BULTAX" : "0",
    "PURCH_AN_TOTAL_BULTAX" : "0",
    "PURCH_COM_1_TAX" : "0",
    "PURCH_COM_2_TAX" : "0",
    "PURCH_COM_TOTAL_TAX" : "0",
    "PURCH_COM_1_RATE" : "0",
    "PURCH_COM_2_RATE" : "0",
    "PURCH_COM_TOTAL_RATE" : "0",
    "PURCH_COM_1_BULTOT" : "0",
    "PURCH_COM_2_BULTOT" : "0",
    "PURCH_COM_TOTAL_BULTOT" : "0",
    "PURCH_COM_1_BULTAX" : "0",
    "PURCH_COM_2_BULTAX" : "0",
    "PURCH_COM_TOTAL_BULTAX" : "0",
    "PURCH_COM_1_GONTAX" : "0",
    "PURCH_COM_2_GONTAX" : "0",
    "PURCH_COM_TOTAL_GONTAX" : "0",
    "PURCH_ASST_1_TAX" : "0",
    "PURCH_ASST_2_TAX" : "0",
    "PURCH_ASST_TOTAL_TAX" : "0",
    "PURCH_NEG_1_RATE" : "0",
    "PURCH_NEG_2_RATE" : "0",
    "PURCH_NEG_TOTAL_RATE" : "0",
    "PURCH_POS_1_RATE" : "0",
    "PURCH_POS_2_RATE" : "0",
    "PURCH_POS_TOTAL_RATE" : "0",
    "PURCH_GON_1_TAX" : "0",
    "PURCH_GON_2_TAX" : "0",
    "PURCH_GON_TOTAL_TAX" : "0"
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
            VATKEY : VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+VATROOTKEY.VATNO
        };

        // MSSQL 에서 가져온 Data 를 저장해 둔 raws collection 에서 결과값을 추출 할 것임.
        var MODEL = models(VATNO+'raws');

        /**
         * Async Module 중에, Parallel 을 사용함.
         * 이 기능은, 나열된 Function 을 동시에 실행하되,
         * 모두 끝마치면, 마지막 Function 을 Call 하게 되어 있음.
         */
        async.parallel([

                /**
                 * 필요적기재사항누락.
                 * @param innerCallback
                 */
                function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P060","P351","P352","P353","P354"]}
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
                                        console.error('필요적기재사항누락 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_1_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_1_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_1_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 사업과 직접 관련업는 지출.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P070","P361","P362","P363","P364"]}
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
                                        console.error('사업과 직접 관련업는 지출 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_2_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_2_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_2_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 비영업용 소형승용자동차 구입유지 및 임차.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P080","P371","P372","P373","P374"]}
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
                                        console.error('비영업용 소형승용자동차 구입유지 및 임차 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_3_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_3_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_3_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 접대비 및 이와 유사항 비용 관련.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P120","P411","P412","P413","P414"]}
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
                                        console.error('접대비 및 이와 유사항 비용 관련 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_4_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_4_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_4_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 면세사업등 관련.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P090","P381","P382","P383","P384"]}
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
                                        console.error('면세사업등 관련 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_5_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_5_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_5_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 토지의 자본적 지출 관련.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P130"]}
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
                                        console.error('토지의 자본적 지출 관련 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_6_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_6_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_6_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 사업자등록전 매입세액.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P110","P401","P402","P403","P404"]}
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
                                        console.error('사업자등록전 매입세액 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_7_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_7_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_7_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 금.구리 스크랩 거래 계좌 미사용관련 매입세액.
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P140"]}
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
                                        console.error('금.구리 스크랩 거래 계좌 미사용관련 매입세액 [%d]',res[0].numCnt);
                                        CALC['PURCH_TAX_8_CNT'] = res[0].numCnt;
                                        CALC['PURCH_TAX_8_AMT'] = res[0].TotAmount;
                                        CALC['PURCH_TAX_8_TAX'] = res[0].VatAmount;
                                    }
                                }
                                innerCallback(null,false);
                            });
                    });
                },
                /**
                 * 총공급가액 등 부분에 공급가액 합계 표시
                 * @param innerCallback
                 */
                    function(innerCallback){

                    MODEL.find({},function(err){

                        MODEL.aggregate()
                            .match({
                                "BSE_VAT Category Code":
                                { $in : ["P140"]}
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
                                        console.error('총공급가액 등 부분에 공급가액 합계 표시 [%d]',res[0].numCnt);
                                        CALC['PURCH_AN_1_AMT'] = res[0].TotAmount;
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
