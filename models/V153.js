var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V153')){
            return mongoose.model('V153');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V153');
            return mongoose.model('V153',modelSchema);

        }
    }
};

module.exports = rawModel();