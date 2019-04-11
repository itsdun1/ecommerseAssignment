var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var x = "mongodb://itsdun:Aditya99@ds135796.mlab.com:35796/asse"
mongoose.connect( x, { useNewUrlParser: true });
module.exports = {mongoose};    