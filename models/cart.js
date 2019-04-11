var mongoose = require("mongoose");

var cart = new mongoose.Schema({
    name:[{type:String}],
    price:[{type:Number}],
    username:String

})

module.exports = mongoose.model("cart",cart);