var mongoose=require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");

var data=[
    {name:"Cloud rest", image:"https://tse3.mm.bing.net/th?id=OIP.m9TNW4Cvs9GDpf7wPzJtYwHaEK&pid=Api&P=0&w=291&h=164",description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content"},
    {name:"Cloud rest", image:"https://tse3.mm.bing.net/th?id=OIP.m9TNW4Cvs9GDpf7wPzJtYwHaEK&pid=Api&P=0&w=291&h=164",description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content"},
    {name:"Cloud rest", image:"https://tse3.mm.bing.net/th?id=OIP.m9TNW4Cvs9GDpf7wPzJtYwHaEK&pid=Api&P=0&w=291&h=164",description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content"}
]

function seedDB(){
    Campground.deleteMany({},function(err){
        if(err){
            console.log(err)
        }
        console.log("removed campgrounds")
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err)
                }else{
                    console.log("Aded campground");
                    //create comment
                    Comment.create(
                        {
                         text:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.",
                         author:"Homer"   
                        },function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment)
                                campground.save();
                                console.log("Created new comment")
                            }
                        }
                    )
                }
            })
         })
    });
}

module.exports = seedDB;