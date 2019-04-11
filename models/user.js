var mongoose  = require("mongoose")
var passort_local_mongoose = require("passport-local-mongoose")
var user = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    password:String
})

user.plugin(passort_local_mongoose);

module.exports = mongoose.model("user",user);