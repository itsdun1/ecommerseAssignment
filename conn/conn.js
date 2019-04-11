var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var l ="mongodb://127.0.0.1:27017/asse";
mongoose.connect( l, { useNewUrlParser: true });
module.exports = {mongoose};    