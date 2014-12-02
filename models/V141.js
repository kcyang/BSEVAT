/**
 * Created by Chris on 2014-11-18.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V141')){
            return mongoose.model('V141');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V141');
            return mongoose.model('V141',modelSchema);

        }
    }
};

module.exports = rawModel();