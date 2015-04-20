/**
 * Mongoose 의 모델이름의 불명확한 동작때문에, 직접 쿼리를 날리는 Function,
 * 바로 Open 해서 결과를 받아온 후에, Callback 으로 넘겨주고, DB는 바로 닫는다.
 * @type {exports.Db.connect|exports}
 */
var mongo = require('mongodb');

var server = new mongo.Server(serverConfig.servers.mongo.ip, 27017, {auto_reconnect: true});
var client = new mongo.MongoClient(server);
var instance_name = global.companyname.replace(/[^a-z|^A-Z|^0-9]/gi,'');

if (instance_name == null)
    instance_name = serverConfig.servers.mongo.instance;

exports.findAll = function(collectionName,callback) {

    var db = client.db(instance_name);
    db.open(function(err, db){
        console.error('DB가 열렸네요..');
        db.collection(collectionName, function(err, collection) {
            console.error('Collection 을 가져왔습니다...'+ collectionName);
            if(err) {
                console.error('Collection Error!! >'+err);
            }
            collection.find().toArray(function(err, items) {
                callback(err, items);
                db.close(function(){
                    console.error('DB가 닫혔네요..');
                });
            });
        });
    });
};

exports.findSet = function(collectionName,criteria,callback) {
    var db = client.db(instance_name);
    db.open(function(err, db){
        console.error('DB가 열렸네요..');
        db.collection(collectionName, function(err, collection) {
            console.error('Collection 을 가져왔습니다...'+ collectionName);
            if(err) {
                console.error('Collection Error!! >'+err);
            }
            collection.find(criteria).toArray(function(err, items) {
                console.error('뭔가를 찾았나요?...'+items.length);
                callback(err, items);
                db.close(function(){
                    console.error('DB가 닫혔네요..');
                });
            });
        });
    });
};