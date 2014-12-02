/**
 * Created by Chris Park on 2014-11-26.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V112')){
            return mongoose.model('V112');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V112');
            return mongoose.model('V112',modelSchema);

        }
    }
};

module.exports = rawModel();