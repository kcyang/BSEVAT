/**
 * Created by Chris Park on 2014-11-23.
 */
var mongoose = require('mongoose');

var rawModel = function(){
    try{
        if(mongoose.model('v106raws')){
            return mongoose.model('v106raws');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });
            return mongoose.model('v106raws', modelSchema);
        }
    }
};

module.exports = rawModel();