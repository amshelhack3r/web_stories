const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id }).then(stories => {
    res.render("index/dashboard", { stories });
  });
});

module.exports = router;
