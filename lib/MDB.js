/**
 * Database 에 값을 넣고 / 지우고 / 업데이트 / 가져오는 Function.
 */

//MONGO DB 에 접속하기 위한 모듈 불러오기.
var mongoose = require('mongoose');

//MONGO DB 접속 (이 부분은 설정파일에서 읽어오도록 변경할 것) #TODO
mongoose.connect('mongodb://localhost/test');

//object validation check 를 위한 값 선언.
var JsonObjectConstructor = {}.constructor;

//결과 값 전송을 위한 json object 선언.
var message = {
    error : 'false',
    msg : ''
};

//json object 에 값을 넣기 위한 function.
function setMessage(error,desc){
    message.error = error;
    message.msg = desc;
}

//callback function.
exports.exec = function(exec_type,MODEL,model,criteria,callback){

//console.info('MDB Function callback!!!!!!!!!!!!!!');

    //받은 데이터 Validate check! 실행 명령 타입 점검.
    if(exec_type === null || typeof exec_type === 'undefined' || typeof exec_type !== 'string') {

        setMessage(true,'[ERROR] Parameter exec_type is invalid ['+exec_type+']');
        console.error(message.msg);
        callback(message.error,message);
    //받아오는 model(값이 들어있는 Model) instance 점검.
    }else if(model === null || typeof model === 'undefined' || model.constructor.name !== 'model'){

        setMessage(true,'[ERROR] Parameter model is invalid ['+model+']');
        console.error(message.msg);
        callback(message.error,message);
    //받아오는 model > 모델 스키마 오브젝트 점검. (it's not instance)
    }else if(MODEL === null || typeof MODEL === 'undefined' || MODEL.prototype.constructor.name !== 'model'){

        setMessage(true,'[ERROR] Parameter MODEL is invalid ['+MODEL+']');
        console.error(message.msg);
        callback(message.error,message);

    //조회 조건을 점검.
    }else if(criteria === null || typeof criteria === 'undefined' || criteria.constructor !== JsonObjectConstructor){

        setMessage(true,'[ERROR] Parameter criteria is invalid ['+criteria+']');
        console.error(message.msg);
        callback(message.error,message);

    }else{ // 넘겨받은 parameter 는 OK,
//console.log('CRITERIA >> ['+criteria+']');
        //DB에 새 값을 입력하는 부분,
        //model 에 있는 그대로 새로 입력한다.
        if(exec_type === 'insert'){
//            console.info('INSERT function....');
            model.save(function(err){
                if(err){
                    setMessage(true,'ERROR save...'+err);
                }else{
                    setMessage(false,'Success');
                }
                callback(message.error,message);
            });
        //DB에 있는 값을 update 하는 부분,
        }else if(exec_type === 'update'){
            console.info('UPDATE function....');
            //업데이트 할 값이 들어있는 모델인스턴스를 통째로 json array 로 변경한다.
            //mongoose object 자체를 넘기면 안됨, 데이터가 있는 값만 넘겨야 된다.
            var updateModel = JSON.parse(JSON.stringify(model));

            //_id 값 또는 key값이 다른 경우, 무조건 새로 넣기 때문에 _id 는 삭제해 준다.
            if('_id' in updateModel) {
                delete updateModel._id;
            }

            //업데이트 구문.
            MODEL.update(criteria,updateModel,{overwrite : false},function(err,numberAffected){
                if(err || numberAffected === 0){
                    console.error('[ERROR] not found something...');
                    setMessage(true,'Did not updated...'+err);
                }else{
//                    console.info('Successfully updated...');
                    setMessage(false,'Success ['+numberAffected+']');
                }
                callback(message.error,message);
            });
        }else if(exec_type === 'updateall'){
            console.info('UPDATE function....');
            //업데이트 할 값이 들어있는 모델인스턴스를 통째로 json array 로 변경한다.
            //mongoose object 자체를 넘기면 안됨, 데이터가 있는 값만 넘겨야 된다.
            var updateModel = JSON.parse(JSON.stringify(model));

            //_id 값 또는 key값이 다른 경우, 무조건 새로 넣기 때문에 _id 는 삭제해 준다.
            if('_id' in updateModel) {
                delete updateModel._id;
            }

            //업데이트 구문.
            MODEL.update(criteria,updateModel,{overwrite : false,multi : true},function(err,numberAffected){
                if(err || numberAffected === 0){
                    console.error('[ERROR] not found something...');
                    setMessage(true,'Did not updated...'+err);
                }else{
//                    console.info('Successfully updated...');
                    setMessage(false,'Success ['+numberAffected+']');
                }
                callback(message.error,message);
            });
        //DB에 있는 값을 삭제하는 부분, 하나만 삭제..
        }else if(exec_type === 'delete'){
            console.info('DELETE function....');
            MODEL.findOne(criteria,function(err,result_document){
                if(err){
                    setMessage(true,'ERROR delete...'+err);
                    callback(message.error,message);
                }else{
                    if(result_document !== null){
                        result_document.remove(function(err){
                            if(err){
                                setMessage(true,'ERROR remove...'+err);
                            }else{
                                setMessage(false,'Success');
                            }
                            callback(message.error,message);
                        });
                    }else{
                        setMessage(true,'ERROR not found something...key | '+JSON.stringify(criteria));
                        callback(message.error,message);
                    }
                }
            });
        }else if(exec_type === 'deleteall'){
            console.info('DELETE All function....');
            MODEL.remove(criteria,function(err){
                if(err){
                    setMessage(true,'ERROR remove...'+err);
                }else{
                    setMessage(false,'Success');
                }
                callback(message.error,message);
            });
        //DB에 있는 값을 가져오는 부분, 하나만 가져옴. (전부 가져올 만한 게 있나?)
        }else if(exec_type === 'select') {
            console.info('SELECT function....');
            MODEL.findOne(criteria, function (err, result_document) {
                if (err) {
                    setMessage(true, 'ERROR select...' + err);
                    callback(message.error, message);
                } else {
                    if (result_document !== null) {
                        setMessage(false, 'Success');
                        callback(message.error, result_document);
                    } else {
                        setMessage(true, 'ERROR not found something...key | ' + JSON.stringify(criteria));
                        callback(message.error, message);
                    }
                }
            });
        }else if(exec_type === 'selectall'){
                console.info('SELECT function....');
                MODEL.find(criteria,function(err,result_document){
                    if(err){
                        setMessage(true,'ERROR select...'+err);
                        callback(message.error,message);
                    }else{
                        if(result_document !== null){
                            setMessage(false,'Success');
                            callback(message.error,result_document);
                        }else{
                            setMessage(true,'ERROR not found something...key | '+JSON.stringify(criteria));
                            callback(message.error,message);
                        }
                    }
                });
        //그 이외의 값이 나오면 사실 에러지..
        }else{
            setMessage(true,'Unknown execution type ...'+ exec_type);
            console.error(message.msg);
            callback(message.error,message);
        }
    }
//    console.info('MDB Function callback[END]');
};

