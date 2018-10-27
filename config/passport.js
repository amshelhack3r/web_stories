const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");
const keys = require("./keys");
const User = require("../models/User");
module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.google_auth.clientID,
        clientSecret: keys.google_auth.clientSecret,
        callbackURL: keys.google_auth.callback
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ uid: profile.id })
          .then(user => {
            if (user) {
              done(null, user);
            } else {
              //remove the sive limitation
              const image = profile.photos[0].value.substring(
                0,
                profile.photos[0].value.indexOf("?")
              );
              new User({
                uid: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                avatar: image
              })
                .save()
                .then(user => done(null, user));
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
