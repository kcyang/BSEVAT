/**
 * Created by Chris Park on 2014-11-25.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V164')){
            return mongoose.model('V164');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V164');
            return mongoose.model('V164',modelSchema);

        }
    }
};

module.exports = rawModel();