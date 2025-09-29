const express = require("express");
const router = express.Router();

// Home page route
router.get("/", (req, res) =>{
    res.render("index");
 })

// About page route
router.get("/about", function (req, res) {
  res.render("about", { page: "about" });
});

// services page route
router.get("/services", function (req, res) {
  res.render("services");
});

// portfolio page route
router.get("/portfolio", function (req, res) {
  res.render("portfolio");
});

// contact page route
router.get("/contact", function (req, res) {
  res.render("contact");
});
// contact page route
router.get("/builder", function (req, res) {
  res.render("builder");
});

module.exports = router;