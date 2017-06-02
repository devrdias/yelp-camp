var express  = require("express");
var router   = express.Router();


// define routes
router.get("/", function (req, res) {
    res.render("landing");
});


// ========================
// deal with invalid routes
// ========================
router.get("*", function (req, res) {
    res.render("notfound");
});

module.exports = router;
