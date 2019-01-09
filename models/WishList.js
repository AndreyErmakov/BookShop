var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
     userID: {type:String, required:true},
     product: {type: Array, required:true}
}); 

module.exports = mongoose.model('WishList', schema) 