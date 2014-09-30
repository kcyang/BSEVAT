'use strict';

module.exports = function(modelName){
    return require('./'+modelName);
};