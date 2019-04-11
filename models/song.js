
var mongoose  = require("mongoose")
var song = new mongoose.Schema({
   
    song1:{
        
        type:Buffer
      
            
        
    },
    
})

module.exports = mongoose.model("song",song);