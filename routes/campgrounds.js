var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');


// list campgrounds from DB
router.get("/", function (req, res) {
    // console.log(req.user);
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                page: "campgrounds"
            });
        }
    });
});

// INSERT campground
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var createdBy = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err) {
            req.flash("error", "Failed to get geolocation");
            res.redirect("/campgrounds/");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newCampground = {
                name: name,
                price: price,
                image: image,
                description: description,
                createdBy: createdBy,
                location: location,
                lat: lat,
                lng: lng
            };

            Campground.create(newCampground, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(campground)
                    res.redirect("/campgrounds");
                }
            });
        }
    });

});

// show INSERT form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/newCampground.ejs");
});

// show campground detail
router.get("/:id", function (req, res) {
    // require the campground with the provided Id
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(campground);
            res.render("campgrounds/showCampground", {
                campground: campground
            });
        }
    });
});

// show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    // require the campground with the provided Id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/editCampground", {
                campground: campground
            })
        };
    });
});
// update route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            price: req.body.price,
            location: location,
            lat: lat,
            lng: lng
        };
        Campground.findByIdAndUpdate(req.params.id, {
            $set: newData
        }, function (err, campground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});


// delete route
router.delete("/:id",  middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        res.flash("sucess", "Grampground deleted.");
        res.redirect("/campgrounds");
    });
});


module.exports = router;