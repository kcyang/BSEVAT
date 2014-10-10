/**
 * Created by KC on 2014-09-23.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var modelSchema = new modelGen('V117');

var rawModel = function(){
    try{
        if(mongoose.model('V117')){
            return mongoose.model('V117');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            return mongoose.model('V117',modelSchema);
        }
    }
};

module.exports = rawModel();