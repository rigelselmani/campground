const express= require("express"),
      bodyParser = require('body-parser'),
      app=express(),
      mongoose=require("mongoose"),
      Campground=require("./models/campground"),
      Comment=require   ("./models/comments"),
      seedDB    =require("./seeds");
      
mongoose.connect('mongodb://localhost:27017/campground', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
seedDB();
app.use(express.static(__dirname+"/public"))

app.get("/",function(req,res){
    res.redirect("/campgrounds")
})

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/campgrounds",{camps:allCampgrounds})

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
            console.log(foundCamps)
            res.render("campgrounds/show",{campground:foundCamps})
        }
    });
});

//==========
//Coments route
//==========

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,foundCamps){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{campground:foundCamps})
        }
    })
})

app.post("/campgrounds/:id/comments",function(req,res){
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

app.listen(3000,function(){
    console.log("server runing on port 3000");
});