const express                 = require("express"),
      bodyParser              = require('body-parser'),
      app                     =express(),          
      mongoose                =require("mongoose"),
      passport                =require("passport"),
      localStrategy           =require("passport-local"),
      methodOverride          =require("method-override");
      Campground              =require("./models/campground"),
      Comment                 =require("./models/comments"),
      User                    =require("./models/user"),
      seedDB                  =require("./seeds");
       
      var commentRoutes  =require("./routes/comments"),
          authRoutes     =require("./routes/auth"),
          campRoutes     =require("./routes/campground");

mongoose.connect('mongodb://localhost:27017/campground', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false}).then(res=>{
    console.log("DB Connected!")
}).catch(err => {
console.log(Error, err.message);
})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
// seedDB();

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

app.use(commentRoutes);
app.use(campRoutes);
app.use(authRoutes);

app.listen(3000,function(){
    console.log("server runing on port 3000");
});