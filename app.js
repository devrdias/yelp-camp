// require dependencies
var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override");

// require database schemas
var seedDB = require("./seeds"),
    User = require("./models/user");

// require routes
var campgroundsRoutes = require("./routes/campgrounds"),
    commentsRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index"),
    authRoutes = require("./routes/auth");

// create the database
mongoose.connect("mongodb://localhost/yelpcamp");

// configure the app
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); // override PUT nad DELETE actions
app.use(flash());

// seedDB(); // populate the database 

// ==================================
// configure passporte local strategy
// ================================== 
app.use(require("express-session")({
    secret: "adkhflakjshdflakjsdhfquehriquwhdfalsjhfpqiuwehfak;jsdhfiquwehf;kajshdf;akdhjsfkjahsdlfaiuwqehf",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use moment js for date
app.locals.moment = require('moment');

// ===================
// define middlewares
// ===================
// inject parms to any template/route 
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});


// ===================
// configure app routes
// ===================
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/", authRoutes);
app.use("/", indexRoutes);

// ===================
// start the server
// ===================
app.listen(3000, "localhost", function () {
    console.log("============================");
    console.log("YelpCamp server has started.");
    console.log("============================");
});