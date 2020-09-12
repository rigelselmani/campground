const { Console } = require("console");
var express = require("express");
const campground = require("../models/campground");
var router = express.Router();
var Campground=require("../models/campground");
const { findById } = require("../models/comments");

router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/campgrounds",{camps:allCampgrounds, currentUser:req.user})

        }
    })
})

router.post("/campgrounds",isLoggedIn,function(req,res){
    const name=req.body.name;
    const image=req.body.image;
    const description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    const newCampground={name:name,image:image,description:description,author:author}
    Campground.create(newCampground,function(err,newCampground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds");
        }
    })
});

router.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamps){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show",{campground:foundCamps})
        }
    });
});

//  Edit campground route
router.get("/campgrounds/:id/edit",checkCmpgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground})
    });
})

router.put("/campgrounds/:id",checkCmpgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedCampground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})
// delete campground route

router.delete("/campgrounds/:id",checkCmpgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }
        res.redirect("/campgrounds")
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

function checkCmpgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back")
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                   next()
                }else{
                   res.redirect("back");
                }
            }
         });
    }else{
        res.redirect("back");    }
}

module.exports=router;