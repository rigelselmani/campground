const express= require("express");
var bodyParser = require('body-parser')
const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

const camps=[
    {name:"Sleepy Creek",image:"https://tse4.mm.bing.net/th?id=OIP.jrwU-gHETXJUz1GclxGKBwHaEU&pid=Api&P=0&w=292&h=171"},
    {name:"Sandy Point", image:"https://tse1.mm.bing.net/th?id=OIP.InmiafNwD18ZdE03e3duoQHaEm&pid=Api&P=0&w=276&h=172"},
    {name:"Sky Line",    image:"https://cdn.vox-cdn.com/thumbor/FMUIaXcnBaKK9YqdP8qtxUog150=/0x0:4741x3161/1200x800/filters:focal(1992x1202:2750x1960)/cdn.vox-cdn.com/uploads/chorus_image/image/59535149/shutterstock_625918454.0.jpg"},
    {name:"Sleepy Creek",image:"https://tse4.mm.bing.net/th?id=OIP.jrwU-gHETXJUz1GclxGKBwHaEU&pid=Api&P=0&w=292&h=171"},
    {name:"Sandy Point", image:"https://tse1.mm.bing.net/th?id=OIP.InmiafNwD18ZdE03e3duoQHaEm&pid=Api&P=0&w=276&h=172"},
    {name:"Sky Line",    image:"https://cdn.vox-cdn.com/thumbor/FMUIaXcnBaKK9YqdP8qtxUog150=/0x0:4741x3161/1200x800/filters:focal(1992x1202:2750x1960)/cdn.vox-cdn.com/uploads/chorus_image/image/59535149/shutterstock_625918454.0.jpg"},
    {name:"Sleepy Creek",image:"https://tse4.mm.bing.net/th?id=OIP.jrwU-gHETXJUz1GclxGKBwHaEU&pid=Api&P=0&w=292&h=171"},
    {name:"Sandy Point", image:"https://tse1.mm.bing.net/th?id=OIP.InmiafNwD18ZdE03e3duoQHaEm&pid=Api&P=0&w=276&h=172"},
    {name:"Sky Line",    image:"https://cdn.vox-cdn.com/thumbor/FMUIaXcnBaKK9YqdP8qtxUog150=/0x0:4741x3161/1200x800/filters:focal(1992x1202:2750x1960)/cdn.vox-cdn.com/uploads/chorus_image/image/59535149/shutterstock_625918454.0.jpg"}

]

app.get("/campgrounds",function(req,res){
    res.render("campgrounds.ejs",{camps:camps})
})

app.post("/campgrounds",function(req,res){
    const name=req.body.name;
    const image=req.body.image;
    const newCampground={name:name,image:image}
    camps.push(newCampground)
    res.redirect("campgrounds",);
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});

app.listen(3000,function(){
    console.log("server runing on port 3000");
});