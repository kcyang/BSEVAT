/**
 * Created by Chris Park on 2014-11-25.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V174')){
            return mongoose.model('V174');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V174');
            return mongoose.model('V174',modelSchema);

        }
    }
};

module.exports = rawModel();