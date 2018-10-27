const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const Story = require("../models/Story");

router.get("/", (req, res) => {
  Story.find({ status: "public" }).then(stories => {
    res.render("stories/index", { stories });
  });
});
/* GET home page. */
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

router.post("/add", (req, res) => {
  let allowComments;

  if (req.body.comment) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  story = {
    title: req.body.title,
    status: req.body.status,
    allowComments,
    body: req.body.body
  };

  new Story(story).save().then(story => {
    res.redirect("/");
  });
});

module.exports = router;
