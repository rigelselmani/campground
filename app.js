const express= require("express");
const app=express();

app.set("view engine","ejs");


app.get("/campground",function(req,res){
    res.render("campground")
})

app.listen(3000,function(){
    console.log("server runing on port 3000");
});