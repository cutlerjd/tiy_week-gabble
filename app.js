const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('express-flash-messages')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/usersModel')
const Post = require('./models/postsModel')
const Like = require('./models/likesModel')
const indexRouter = require('./routes/indexRoute')
const loginRouter = require('./routes/loginRoute')
const messageBoardRouter = require('./routes/messageBoardRoute')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Passport stuff (move)
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.authenticate(username, password, function (err, user) {
      if (err) {
        return done(err)
      }
      if (user) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: "There is no user with that username and password."
        })
      }
    })
  }));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login/');
  }
}
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/messages', requireLogin, messageBoardRouter)

app.listen(3000, function () {
  console.log("App running on port 3000")
})
