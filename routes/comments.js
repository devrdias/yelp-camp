var express = require("express");
// Preserve the req.params values from the parent router. 
// If the parent and the child have conflicting param names, the child’s value take precedence.
var router = express.Router({
    mergeParams: true
});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ===============
// INSERT NEW COMMENT 
// ===============
router.post("", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            req.flash("error", "Something whent wrong.");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                if (err) {
                    req.flash("error", "Something whent wrong.");
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("sucess", "Comment insert successfuly.");
                }
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });
});

// ==============
// EDIT COMMENT ROUTE
// ==============
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/editComment", {
                campground_id: req.params.id,
                comment: comment
            });
        }
    })
});

// ====================
// UPDATE COMMENT ROUTE
// ====================
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log(comment);
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// ============
// DELETE ROUTE 
// ============
router.delete("/:comment_id/", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.flash("sucess", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;