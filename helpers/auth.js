module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect(rootpath);
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect(`${rootpath}/dashboard`);
    } else {
      return next();
    }
  }
};
