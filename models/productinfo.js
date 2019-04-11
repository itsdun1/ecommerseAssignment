var mongoose  = require("mongoose")
var product = new mongoose.Schema({
    image:Buffer,
    name:String,
    info:String,
    price:Number,
    username:String

})

module.exports = mongoose.model("product",product);