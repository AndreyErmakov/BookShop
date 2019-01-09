var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    image:{type: String},
    name:{type: String, required: true},
    price:{type: Number, required: true},
    sort:{type:Array},
    description:{type:String},
    otherDetalis:{type:String},
    comment:{type:Array}
});

module.exports = mongoose.model('Product', schema)