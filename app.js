var express= require("express");
const { render } = require("ejs");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var flash=require("connect-flash");
var methodOverride=require("method-override");
var LocalStrategy=require("passport-local");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
mongoose.connect("mongodb://localhost:27017/yelp_camp",({useNewUrlParser:true,useUnifiedTopology: true}));
//mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true,useUnifiedTopology: true});
// console.log(process.env.DATABASEURL);


// mongoose.connect("mongodb+srv://UDIT:udit123@cluster0.bkwum.mongodb.net/<yelp_camp>?retryWrites=true&w=majority",{
//     useNewUrlParser:true,
//     useUnifiedTopology: true,
//     useCreateIndex:true
// }).then(() => {
//     console.log("Db started");
// }).catch(err => {
//     console.log("err"+err.message);
// });

var commentRoutes = require("./routes/comments");
var campgroundRoutes= require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var seedDB=require("./seeds");
// seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret:"once again i won",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
   
    next();
});

// Campground.create({
//     name:"Ground7",
//     image:"https://www.switchbacktravel.com/sites/default/files/images/articles/Camping%20Tent%20%28REI%20Kingdom%29.jpg",
//     description:"This is a beautiful campground",
//     imag:"kkkk"
// }, function(err,campground){
//     if(err){
//         console.log("some error");
//     }
//     else{
//         console.log("Successfully added");
//         console.log(campground);
//     }
// });
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
    console.log("Server has started");
});