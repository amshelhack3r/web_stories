const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const keys = require("./config/keys");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const strategy = require("./config/passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
//bring in the handlebars helpers
const {
  truncate,
  stripTags,
  formatDate,
  editIcon,
  rootpath
} = require("./helpers/hbs");

const app = express();

//connect to mong db

mongoose
  .connect(
    keys.mlabURI,
    {
      useNewUrlParser: true
    }
  )
  .then(
    () => {
      console.log("connected to mlabs");
    },
    err => {
      console.log(err);
    }
  );

//handlebars middlewares
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate,
      stripTags,
      formatDate,
      editIcon,
      rootpath
    },
    defaultLayout: "template"
  })
);
app.set("view engine", "handlebars");

//method override middleware
app.use(methodOverride("_method"));

//body parser middlewares
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// parse application/json
app.use(bodyParser.json());

//set the path to the public directory
app.use(express.static(path.join(__dirname, "public")));
//sessions middlewares
app.use(
  session({
    secret: keys.secret,
    resave: true,
    saveUninitialized: true
  })
);

strategy(passport);

app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//require the routes we have created
const root = require("./routes/index");
const about = require("./routes/about");
const stories = require("./routes/stories");
const auth = require("./routes/auth");

app.use(`${rootpath}/dev_stories`, root);
app.use(`${rootpath}/dev_stories/about`, about);
app.use(`${rootpath}/dev_stories/stories`, stories);
app.use(`${rootpath}/dev_stories/auth`, auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
