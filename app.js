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

mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true,useUnifiedTopology: true});
//udit

var commentRoutes = require("./routes/comments");
var campgroundRoutes= require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
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

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
    console.log("Server has started");
});