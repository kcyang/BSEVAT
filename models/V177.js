/**
 * Created by Chris Park on 2014-11-24.
*/
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V177')){
            return mongoose.model('V177');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V177');
            return mongoose.model('V177',modelSchema);

        }
    }
};

module.exports = rawModel();