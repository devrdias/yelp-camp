var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    return res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        // require the comment with the provided Id
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                res.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                console.log("comment = " + comment);
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logeed in to do that");
        res.redirect("/login");
    }
};


// verify if user is logged in and if he's the author of the post
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        // require the campground with the provided Id
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                res.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                if (campground.createdBy.id.equals(req.user._id)) {
                    next();
                } else {
                    res.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logeed in to do that");
        res.redirect("/auth/login");
    }
};

module.exports = middlewareObj;