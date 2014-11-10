/**
 * Created by KC on 2014-09-23.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V104')){
            return mongoose.model('V104');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V104');
            return mongoose.model('V104',modelSchema);

        }
    }
};

module.exports = rawModel();