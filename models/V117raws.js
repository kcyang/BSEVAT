/**
 * Created by KC on 2014-10-08.
 */
var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });

module.exports = mongoose.model('V117raws',modelSchema);