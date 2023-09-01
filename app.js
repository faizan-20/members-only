require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const compression = require('compression');
const helmet = require('helmet');

const User = require('./models/user');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { log } = require("console");

const app = express();

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user); 
  } catch(err) {
    done(err);
  };
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get("/sign-up", (req, res) => res.render("sign_up_form"));
app.post("/sign-up", async(req, res, next) => {
  try {

    const checkUsername = await User.findOne({username: req.body.username});
    console.log(checkUsername);

    if (checkUsername === null) {
      const user = new User({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        username: req.body.username,
        password: req.body.password,
        subscribed: req.body.subscribed,
      });
      const result = await user.save();
      res.redirect("/log-in");
    } else {
      res.render("sign_up_form", {error: "error"});
    }

  } catch(err) {
    return next(err);
  }
});
app.get("/log-in", (req, res) => res.render("log_in_form"));
app.post("/log-in", 
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
  })
);
app.get("/log-out", (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
