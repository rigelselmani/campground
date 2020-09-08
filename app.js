const express                 = require("express"),
      bodyParser              = require('body-parser'),
      app                     =express(),          
      mongoose                =require("mongoose"),
      passport                =require("passport"),
      localStrategy           =require("passport-local"),
      Campground              =require("./models/campground"),
      Comment                 =require("./models/comments"),
      User                    =require("./models/user"),
      seedDB                  =require("./seeds");
      
mongoose.connect('mongodb://localhost:27017/campground', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname+"/public"))
seedDB();

app.use(require("express-session")({
    secret: "Once aggain Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
})

app.get("/",function(req,res){
    res.redirect("/campgrounds")
})

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/campgrounds",{camps:allCampgrounds, currentUser:req.user})

        }
    })
})

app.post("/campgrounds",function(req,res){
    const name=req.body.name;
    const image=req.body.image;
    const description=req.body.description;
    const newCampground={name:name,image:image,description:description}
    Campground.create(newCampground,function(err,newCampground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds");
        }
    })
});

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamps){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show",{campground:foundCamps})
        }
    });
});

//==========
//Coments route
//==========

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamps){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{campground:foundCamps})
        }
    })
})

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            console.log(req.body.comment)
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    })
})

//=============
//Auth Routes
//=============

//signup logic
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    var newUser= new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//loggin logic
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",   
    failureRedirect:"/login"   
 }),function(req,res){
});

//logOut logic
app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}
app.listen(3000,function(){
    console.log("server runing on port 3000");
});