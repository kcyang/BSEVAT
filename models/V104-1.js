/**
 * Created by Chris Park on 2014-11-26.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V104-1')){
            return mongoose.model('V104-1');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V104-1');
            return mongoose.model('V104-1',modelSchema);

        }
    }
};

module.exports = rawModel();