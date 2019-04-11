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
var sharp = require("sharp")
var product = require("./models/productinfo")
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


    product.find({}).then((data)=>{
        console.log(data.length)

        res.render("home.ejs",{data})
    })


    
})

app.get("/addproducts",isLoggedIn,(req,res)=>{

    res.render("addproduct.ejs");
})

var upload = multer({
    
   
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return  cb(new Error("file must be a image type"))
        }

       
        cb(undefined,true,)
       
    }
}) 




app.post("/addproducts",upload.single('proimage'),isLoggedIn, async(req,res)=>{


    const buffer = await sharp(req.file.buffer).png().toBuffer()
    console.log(req.body);
    console.log(buffer);
   

    product.insertMany({name:req.body.name,
    info:req.body.info,
price:req.body.price,
image:buffer,
username:res.locals.currentUser.username}).then((data)=>{
    if(data)
    {
        console.log(data)
        res.redirect("/home")
    }
}).catch((e)=>{

    console.log(e)
})




})


app.get('/api/images/:name', async (req, res) => {
    console.log(req.params,req.params.name)
    try {
        const user = await product.findOne({name:req.params.name,
            })

        if (!user || !user.image) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.image)
    } catch (e) {
        res.status(404).send()
    }
})



app.post("/viewpro",(req,res)=>{

    console.log(req.body);
    var name = req.body
    product.find({name:req.body.name}).then((data)=>{
        console.log(data)
        res.render("productpage.ejs",{data:data[0]})

    })
    
  
// console.log(info);
    

})




function isLoggedIn(req ,res ,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}













app.listen( 3000,()=>
{
    console.log("server has started");
})