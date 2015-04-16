/**
 * Created by Chris Park on 2014-11-25.
 */
var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var rawModel = function(){
    try{
        if(mongoose.model('V174raws')){
            return mongoose.model('V174raws');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            return mongoose.model('V174raws',modelSchema);
        }
    }
};

module.exports = rawModel();