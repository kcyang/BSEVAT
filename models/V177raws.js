/**
 * Created by Chris Park on 2014-11-24.
 */
var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var rawModel = function(){
    try{
        if(mongoose.model('V177raws')){
            return mongoose.model('V177raws');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            return mongoose.model('V177raws',modelSchema);
        }
    }
};

module.exports = rawModel();