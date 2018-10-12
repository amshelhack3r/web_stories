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
    failureRedirect: "/login"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/register", (req, res) => {
  //get the data fro the form
  res.render("users/register");
});

router.post("/register", (req, res) => {
  //do some serve side validation
  let errors = [];

  if (req.body.password != req.body.password2) {
    const msg = "PASSWORD DONT MATCH";
    errors.push({
      msg
    });
  }
  if (req.body.password.length < 6) {
    const msg = "PASSWORD CANNOT BE LESS THAN 6 CHARACTERS";
    errors.push({
      msg
    });
  }

  if (errors.length > 0) {
    console.log(errors);

    res.render("users/register", {
      errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    const new_user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    //hash the password
    bcrypt.hash(new_user.password, 8, (err, hash) => {
      if (err) {
        console.log(err);
      }
      new_user.password = hash;
      new_user
        .save()
        .then(() => res.redirect("/users/login"))
        .catch(err => console.log(err));
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
