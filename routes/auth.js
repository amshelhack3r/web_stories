const express = require("express");
const router = express.Router();
const passport = require("passport");
/* GET home page. */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/dev_stories/auth/google"
  }),
  (req, res) => {
    // // Successful authentication, redirect home.
    res.redirect("/dev_stories/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/dev_stories");
});

module.exports = router;
