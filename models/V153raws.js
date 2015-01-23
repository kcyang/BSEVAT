var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

var rawModel = function(){
    try{
        if(mongoose.model('V153raws')){
            return mongoose.model('V153raws');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            return mongoose.model('V153raws',modelSchema);
        }
    }
};

module.exports = rawModel();