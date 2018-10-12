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
        User.findOne({ uid: profile.id }).then(user => {
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
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: image
            })
              .save()
              .then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: keys.facebook_auth.clientID,
        clientSecret: keys.facebook_auth.clientSecret,
        callbackURL: keys.facebook_auth.callback,
        profileFields: ["id", "displayName", "photos", "email"]
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        // console.log(profile.photos[0].value);
        User.findOne({ oauth_id: profile.id })
          .then(user => {
            if (user) {
              done(null, user);
            } else {
              new User({
                uid: profile.id,
                name: profile.displayName,
                avatar: profile.photos[0].value
              })
                .save()
                .then(user => done(null, user));
            }
          })
          .catch(err => console.log(err));
      }
    )
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email"
      },
      (email, password, done) => {
        User.findOne({
          email
        })
          .then(user => {
            if (!user) {
              return done(null, false, {
                message: "Email not found."
              });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, {
                  message: "Incorrect password"
                });
              }
            });
          })
          .catch(err => {
            return done(err);
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
