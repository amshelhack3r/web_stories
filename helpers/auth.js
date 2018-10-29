module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dev_stories");
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/dev_stories/dashboard");
    } else {
      return next();
    }
  }
};
