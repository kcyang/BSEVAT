/**
 * Created by Chris Park on 2014-11-23.
 */
var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var rawModel = function(){
    try{
        if(mongoose.model('V106raws')){
            return mongoose.model('V106raws');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            return mongoose.model('V106raws',modelSchema);
        }
    }
};

module.exports = rawModel();