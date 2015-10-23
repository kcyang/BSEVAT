var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V120')){
            return mongoose.model('V120');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V120');
            return mongoose.model('V120',modelSchema);

        }
    }
};

module.exports = rawModel();