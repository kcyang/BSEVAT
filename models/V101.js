/**
 * Created by KC on 2014-09-23.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var rawModel = function(){
    try{
        if(mongoose.model('V101')){
            return mongoose.model('V101');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){

            var modelSchema = new modelGen('V101');
            return mongoose.model('V101',modelSchema);

        }
    }
};

module.exports = rawModel();