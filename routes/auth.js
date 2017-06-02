var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var router = express.Router();

// ============
// AUTH ROUTES
// ============
// show register form
router.get("/register", function (req, res) {
    res.render("auth/register", {
        page: "register"
    });
});
// handle sign in logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    // console.log("newUser = " + newUser);
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.render("auth/register", {
                error: err.message
            });
        }
        // console.log("saved User = " + user);
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    })
});

// show login form
router.get("/login", function (req, res) {
    res.render("auth/login", {
        page: "login"
    });
});

// handle the login logic
// needs to add a middleware to authenticate the user
// app.post ("/login", middleware , callback)
// passport.authenticate ( strategy , { options } , callback )
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}), function (req, res) {});


// logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;