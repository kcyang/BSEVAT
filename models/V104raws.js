/**
 * Created by KC on 2014-10-08.
 */
var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var rawModel = function(){
    try{
        if(mongoose.model('V104raws')){
            return mongoose.model('V104raws');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            return mongoose.model('V104raws',modelSchema);
        }
    }
};

module.exports = rawModel();