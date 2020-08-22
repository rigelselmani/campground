const express= require("express"),
      bodyParser = require('body-parser'),
      app=express(),
      mongoose=require("mongoose")

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost:27017/campground', {useNewUrlParser: true, useUnifiedTopology: true});

var campground = new mongoose.Schema({
   name:String,
   image:String
});
var Campground = mongoose.model('Campground', campground);

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds.ejs",{camps:allCampgrounds})

        }
    })
})

app.post("/campgrounds",function(req,res){
    const name=req.body.name;
    const image=req.body.image;
    const newCampground={name:name,image:image}
    Campground.create(newCampground,function(err,newCampground){
        if(err){
            console.log(err)
        }else{
            res.redirect("campgrounds");
        }
    })
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});

app.listen(3000,function(){
    console.log("server runing on port 3000");
});