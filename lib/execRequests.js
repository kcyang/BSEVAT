/**
 * [Express.js]
 * router 에서 받은 요청을 실제 처리하는 Main Function. (from bsevat.js)
 *
 */
var mongoose = require('mongoose');
var async = require('async');
var mg = require('../lib/MDB.js');
var nav = require('../lib/getNav.js');
var helper = require('../lib/model/modelHelper.js');

var dummySchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var STREAM_STATUS = {
    START : '0',
    ERROR : '1',
    ON : '2',
    DONE : '3'
};

// 데이터를 키값을 주고, 가져오는 Function,
exports.get = function(criteria,callback) {

    console.log('Main call function start!');
    console.error(criteria.VATKEY);

    if(criteria === null || typeof criteria === 'undefined') {

        callback(true,'Undefined criteria !!!');

    }else{

        var DummyModel = mongoose.model(criteria.VATKEY,dummySchema);
        var dummy = new DummyModel();

        mg.exec('select',DummyModel,dummy,criteria,function(err,result){
            console.log('get Data from MongoDB!');
            callback(err,result);
        });
    }

    console.log('Main call function end!');
};

// 데이터를 새로 생성하는 Function,
exports.post = function(criteria,callback) {

    console.log('Main call function [post] start!');

    console.error(criteria.VATKEY);

    if(criteria === null || typeof criteria === 'undefined') {

        callback(true,'[execRequest.js].post 데이터를 가져오기 위한 KEY 값이 이상합니다. !!!');

    }else{
console.log('여긴 들어가냐?');
        //NAV 에서 Data를 가져오는 Function.

        var BulkModel = mongoose.model(criteria.VATKEY+'RAW',dummySchema);

        async.waterfall([

            function(inner){
console.log('여기도 들어가냐?????');
//                var RemoveModel = new BulkModel();
                BulkModel.remove({},function(err){

                    if(err){
console.log('Collection remove error!');
                        inner(null);
                    }else{
console.log('Collection removed!');
                        inner(null);
                    }
                });

            },
            function(inner) {
console.log('proceed .............get from navision database...');
                //navision 에서 가져올 VAT 값에 해당하는 KEY
                nav.exec(criteria.VATKEY, function (err, status, data) {

                    if (err) {
                        console.error('오류가 발생..' + data);
                    } else {

                        //집어넣는 중일 때,
                        //NAV 에서 값을 가져오고, 해당 값을 Mongo 에 하나씩 넣는다.
                        if (status === STREAM_STATUS.ON) {

                            //Bulk로 집어넣을 때에는, strict mode 를 disable 시켜준다.
                            // new Model(DATA,strict mode)
                            var ResultModel = new BulkModel(data, false);

                            mg.exec('insert', BulkModel, ResultModel, {}, function (err, message) {
                                if (err) {
                                    console.error('Mongo Insert ERROR[' + message + ']');
                                } else {
                                    //                            console.log('Inserted one row!');
                                }
                            });

                        } else if (status === STREAM_STATUS.DONE) {

                            //다 했다, Mongo 처리하고 데이터 넣자.
                            console.log('All items are inserted!');
                            //해당 VAT KEY 를 가지고 계산된 결과를 Mongo 에 집어넣는다.

                            //NAV 에서 가져온 데이터의 모델의 인스턴스
                            //#####                    var navInstance = new BulkModel(data);

                            helper.getVATModel(criteria.VATKEY, function (err, setFunc) {

                                if (err) {
                                    console.error('ERROR from getVATModel');
                                } else {

                                    //가져온 컨트롤 오브젝트를 통해서, 값을 셋팅한다.
                                    //여기 모델은, NAV 에서 가져온 모델이다.
                                    setFunc.setModel(criteria.VATKEY, /*BulkModel,*/ function (err, mongoModel) {
                                        if (err) {
                                            console.error('ERROR from setModel');
                                        } else {
                                            //모델 셋팅이 끝난 결과 모델을 몽고에 insert 하기.

                                            //모델,
                                            var M_ResultModel = mongoose.model(criteria.VATKEY);

                                            //여기는 Mongo 모델이다.
                                            mg.exec('insert', M_ResultModel, mongoModel, {}, function (err, message) {
                                                if (err) {
                                                    console.error('Insert Error');
                                                } else {
                                                    console.log('Item inserted to mongo database!');
                                                }
                                                callback(err, message);
                                            });

                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                inner(null);
            }
        ],function(err){
            if(err) {console.error('Job has not finished ...fetching from SQL..');}
            console.log('Job finished.... fetching from SQL.');
        });

    }
    console.log('Main call function [post] End!');
};

exports.exec = function(criteria,callback) {

};
