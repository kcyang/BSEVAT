/**
 * Created by KC on 2014-09-23.
 */
var mongoose = require('mongoose');
var modelGen = require('../lib/getSchema');

var modelSchema = new modelGen('V117');

module.exports = mongoose.model('V117',modelSchema);