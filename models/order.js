var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Object ,ref: "User"},
    cart: {type: Object, required:true},
    name: {type: String, required: true},  
    address: {type: String, required:true},
    phone: {type: String, required:true}
}); 

module.exports = mongoose.model('Order', schema) 