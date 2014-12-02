/**
 * Created by Chris Park on 2014-11-26.
 */
var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var rawModel = function(){
    try{
        if(mongoose.model('V104-1raws')){
            return mongoose.model('V104-1raws');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            return mongoose.model('V104-1raws',modelSchema);
        }
    }
};

module.exports = rawModel();