/**
 * Created by Chris Park on 2014-11-23.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V106')){
            return mongoose.model('V106');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V106');
            return mongoose.model('V106',modelSchema);

        }
    }
};

module.exports = rawModel();