const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const Story = require("../models/Story");

router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .populate("user")
    .sort({ published_on: "desc" })
    .then(stories => {
      res.render("stories/index", { stories });
    });
});

router.get("/my", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate("user")
    .sort({ published_on: "desc" })
    .then(stories => {
      res.render("stories/index", { stories });
    });
});
/* GET home page. */
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

router.post("/add", ensureAuthenticated, (req, res) => {
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
    body: req.body.body,
    user: req.user.id
  };

  new Story(story).save().then(story => {
    res.redirect(`${rootpath}/stories`);
  });
});

//show a story
router.get("/show/:id", (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      res.render("stories/show", { story });
    });
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findById(req.params.id).then(story => {
    res.render("stories/edit", { story });
  });
});

router.put("/edit/:id", ensureAuthenticated, (req, res) => {
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
    body: req.body.body,
    user: req.user.id
  };

  Story.findByIdAndUpdate(req.params.id, story).then(() => {
    res.redirect(`${rootpath}/dashboard`);
  });
});
router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  Story.findByIdAndRemove(req.params.id).then(() => {
    res.redirect(`${rootpath}/dashboard`);
  });
});

router.post("/comment/:id", ensureAuthenticated, (req, res) => {
  Story.findById(req.params.id)
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      };

      //add comment to array use unshift to add it to the beginning of an array
      story.comments.unshift(newComment);

      story.save().then(story => {
        res.redirect(`${rootpath}/stories/show/${story.id}`);
      });
    })
    .catch(err => {
      console.log(err);
    });
});
module.exports = router;
