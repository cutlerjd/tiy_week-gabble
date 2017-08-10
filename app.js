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
        console.log("User was sent in to local strategy")
        console.log(user)
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

app.get("/", function (req, res, next) {
  res.render("index", { appType: "Express" })
})

app.get("/register", function (req, res, next) {
  res.render("register")
})
app.post("/register", function (req, res, next) {
  User.createUser(req.body.username, req.body.password, req.body.displayName, function (success, result) {
    if (success) {
      console.log("Success registration", result)
      res.redirect("/login")
    } else {
      //todo: add error handling
      console.log(result)
      res.send("eeeeeerrrrrrooooorr")
    }
  })
})
app.get('/login/', function (req, res) {
  res.render("login", {
    messages: res.locals.getMessages()
  });
});

app.post('/login/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login/',
  failureFlash: true
}))

// app.get("/login", function (req, res, next) {
//   res.render("login")
// })

// app.post("/login", function (req, res, next) {
//   User.authenticate(req.body.username, req.body.password, function (success, result) {
//     if (success) {
//       console.log(result)
//       res.redirect("/")
//     } else {
//       console.log(result)
//       res.redirect("login")
//     }
//   })
// })

app.listen(3000, function () {
  console.log("App running on port 3000")
})
