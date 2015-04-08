/**
 * [Express.js]
 * router 에서 받은 요청을 실제 처리하는 Main Function. (from bsevat.js)
 * Main Control 이라고 생각하면 됨.
 *
 */
var path = require('path');
var async = require('async');
var nav = require('../lib/getNav.js');
var helper = require('../lib/model/modelHelper.js');

/**
 * MSSQL 에서 데이터를 가져와서, Mongo 에 넣을 때, Stream 방식으로 처리하는 데,
 * 처리 방식을 정의하기 위함.
 * #TODO 꼭 이방식으로 하지 않아도 되지 않을까?
 * @type {{START: string, ERROR: string, ON: string, DONE: string}}
 */
var STREAM_STATUS = {
    START : '0',
    ERROR : '1',
    ON : '2',
    DONE : '3'
};

exports.list = function(callback){
    console.log('GET LIST of Company');

    nav.list(function (err, data) {
        callback(err,data);
    });
};

// 데이터를 키값을 주고, 가져오는 Function,
exports.get = function(criteria,callback) {

    if(criteria === null || typeof criteria === 'undefined') {

        callback(true,'Undefined criteria !!!');

    }else{
        var mongoModel = models(criteria.KEY);

        mongoModel.findOne({ VATKEY: criteria.VATKEY }, function (err, result_document) {

            if(err){
                console.error('데이터를 가져오지 못했습니다. ',err);
                callback(err, 'ERROR');
            }else {
                callback(err, result_document);
            }

        });

    }

};
// 데이터를 키값을 주고, Excel 을 만들어서 넘겨주는 놈.
exports.excel = function(criteria,VATROOTKEY,callback) {

    if(criteria === null || typeof criteria === 'undefined') {

        callback(true,'Undefined criteria !!!');

    }else{
/* Excel 만들기 */
        var KEY = VATROOTKEY.YEAR+VATROOTKEY.VATQT+VATROOTKEY.VATTYPE+VATROOTKEY.VATNO+VATROOTKEY.VATCP;

        var spawn = require('child_process').spawn;

        var template = serverConfig.excel.template_path + criteria.VATKEY + '.xlsx';

        var xls_value = models(criteria.VATKEY+'XLS');
        /**
         * Python 호출하는 부분, Excel 내려받기를 하기 위함.
         */
        var src = spawn('python',[
            path.join(__dirname,'../py/buildExcel.py'),
            template,serverConfig.excel.result_path,
            criteria.VATKEY,
            KEY,
            xls_value.limit_no,
            xls_value.page_no
        ]);

        src.stdout.on('data',function(data){
            console.log("STDOUT >> "+data);
        });

        src.stderr.on('data',function(data){
            console.error("STDERR >> "+data);
        });

        src.on('exit',function(code){
            if(code === 1){
                console.log("ERROR >>"+code);
                callback(true,'Python Exception!');
                return;
            }
            console.log("엑셀을 정상적으로 생성하였습니다.");
            callback(false,serverConfig.excel.result_path+KEY+'.xlsx');
        });

    }

};

exports.put = function(criteria,mg,callback){
    if(criteria === null || typeof criteria === 'undefined') {

        callback(true,'Undefined criteria !!!');

    }else if(mg === null || typeof mg === 'undefined'){
        console.error('클라이언트로부터 넘어온 값이 없습니다.!!!');
        callback(true,'클라이언트로부터 넘어온 값이 없습니다.!!!');

    }else{
        var mongoModel = models(criteria.KEY);
/*
        mongoModel.findOneAndUpdate({VATKEY:mg.VATKEY},mg,{upsert:true},function(err){

            if(err){
                console.error('데이터를 저장하지 못했거나 대상이 없습니다. ',err);
                callback(err, 'ERROR');
            }else {
                callback(err, 1);
            }

        });
*/
        mongoModel.update({ VATKEY: mg.VATKEY },mg,{overwrite : false}, function (err, numberAffected) {

            if(err || numberAffected === 0){
                console.error('데이터를 저장하지 못했거나 대상이 없습니다. ',err);
                callback(err, 'ERROR');
            }else {
                callback(err, numberAffected);
            }

        });
    }
};
// 데이터를 새로 생성하는 Function,
exports.post = function(criteria,VATROOTKEY,callback) {

    if(criteria === null || typeof criteria === 'undefined') {

        callback(true,'[execRequest.js].post 데이터를 가져오기 위한 KEY 값이 이상합니다. !!!');

    }else if(VATROOTKEY === null || typeof VATROOTKEY === 'undefined'){

        callback(true,'[execRequest.js].post 데이터를 가져오기 위한 VAT ROOT KEY 값이 이상합니다. !!!');

    }else{

        //NAV 에서 Data를 가져오는 Function.
        var BulkModel = models((criteria.VATKEY).concat('raws'));

        //순서대로 실행되야 하기 때문에, 삭제가 먼저 실행되도록 한다. (Async Function 사용함)
        async.waterfall([

            function(inner){
                BulkModel.remove({},function(err){

                    if(err){
                        console.error('기존 RAW Data 값을 삭제하는 중에 에러가 발생함!['+criteria.VATKEY+']');
                        inner(null);
                    }else{
                        console.log('기존 RAW Data 가 삭제되었음.['+criteria.VATKEY+']');
                        inner(null);
                    }
                });
            },

            function(inner) {

                //navision 에서 가져올 VAT 값에 해당하는 KEY
                nav.exec(criteria.VATKEY,VATROOTKEY, function (err, status, data) {

                    if (err) {
                        console.error('MSSQL 에서 데이터를 가져오는 중에 오류가 발생하였습니다.' + data);
                    } else {

                        //집어넣는 중일 때,
                        //NAV 에서 값을 가져오고, 해당 값을 Mongo 에 하나씩 넣는다.
                        if (status === STREAM_STATUS.ON) {

                            //Bulk로 집어넣을 때에는, strict mode 를 disable 시켜준다.
                            // new Model(DATA,strict mode)
                            var ResultModel = new BulkModel(data, false);

                            // 바로 Insert 한다.  #1001  --ADD
                            ResultModel.save(function(err){
                                if (err) {
                                    console.error('Mongo Insert ERROR[' + err + ']');
                                } else {
//                                    console.log('Inserted one row!');
                                }
                            });

                        } else if (status === STREAM_STATUS.DONE) {

                            //다 했다, Mongo 처리하고 데이터 넣자.
                            console.log('MSSQL 에서 가져온 결과가 모두 Mongo 에 Insert 되었습니다.');

                            //해당 VAT KEY 를 가지고 계산된 결과를 Mongo 에 집어넣는다.

                            var setFunc = helper(criteria.VATKEY);

                            if (err) {
                                console.error('ERROR from getVATModel');
                            } else {

                                //가져온 컨트롤 오브젝트를 통해서, 값을 셋팅한다.
                                //여기 모델은, NAV 에서 가져온 모델이다.

                                setFunc.setValue(criteria.VATKEY,VATROOTKEY,function (err, mongoModel) {

                                    if (err) {
                                        console.error('ERROR from setModel');
                                    } else {
                                        //모델 셋팅이 끝난 결과 모델을 몽고에 insert 하기.
                                        //모델 저장,
                                        //이미 해당 Key 값이 있으면, 삭제 후에 Insert 하도록 변경 #TODO


                                        var ModelClass = models(criteria.VATKEY);

                                        ModelClass.findOneAndUpdate({VATKEY:mongoModel.VATKEY},mongoModel.toObject(),{upsert:true},function(err){
                                            if (err) {
                                                console.error('Insert Error',err);
                                            } else {
                                                console.log('계산된 결과가 Mongo 에 저장되었습니다.');
                                            }
                                            callback(err, mongoModel.toJSON());
                                        });
/*
                                        mongoModel.findOneAndUpdate({VATKEY:mongoModel.VATKEY},mongoModel,{upsert:true},function(err){
                                            if (err) {
                                                console.error('Insert Error');
                                            } else {
                                                console.log('계산된 결과가 Mongo 에 저장되었습니다.');
                                            }
                                            callback(err, mongoModel.toJSON());
                                        });
*/
                                    }
                                });
                            }
                        }
                    }
                });
                inner(null);
            }
        ],function(err){
            if(err) {console.error('Job has not finished ...fetching from SQL..');}
            console.log('MSSQL 에서 데이터를 가져오고, Mongo 로 이전하는 모든 과정이 끝남.');
        });

    }
};