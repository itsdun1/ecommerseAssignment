var mongoose = require("./conn/conn")

var express= require("express")
var app = express()
var multer = require("multer")
var passport = require("passport")
var passportLocal = require("passport-local")
var passportLocalMongoose = require("passport-local-mongoose")
var bodyParser = require("body-parser")
var request = require('request');
var user = require("./models/user")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
var port = process.env.PORT  || 3000


app.use(require("express-session")({
    secret: "assignment eshopping",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
 
    
    next();
  })










app.get("/",(request,res)=>{
    res.render("a.ejs");

})


app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.post("/register",(req,res)=>{
    
    user.register(new user({username:req.body.username}),req.body.password,(err,data)=>{

        if(err)
        {
            console.log(err)
            // req.flash("error","user with same username already exist")
            return res.render("register.ejs")
        }
        passport.authenticate("local")(req,res,function(){
          
            
           
           
                    
            res.redirect("/home");
           
            
            
        })
    


})
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.post("/login",(req,res,next)=>{


    passport.authenticate("local",(err,User,info)=>{

        if(err)
        {   
        
            return(next(err))
        }
        if(!User)
        {   
          
            return res.redirect("/login")
        }
        req.logIn(User,function(err){
            if(err)
            {   
                
                return next(err)
            }
            user.find({username:User.username}).then((data)=>{
                if(data)
                {
                    // console.log(data)
                     
                    return res.redirect('/home');
                }
            }).catch((e)=>{
                
                return next(e)
            })
            
        })
    
    })(req,res,next);
    });


app.get("/home",(req,res)=>{

    res.render("home.ejs")
})




















app.listen( 3000,()=>
{
    console.log("server has started");
})