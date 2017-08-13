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
  successRedirect: '/home',
  failureRedirect: '/login/',
  failureFlash: true
}))
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get("/home", requireLogin, function(req,res,next){
  Post.getAllPosts(req.user.id,function(results){
    let posts = {posts:results}
    console.dir(posts, {depth:null})
    res.render("messagesHome",posts)
  })
  
})

app.get("/submit",requireLogin, function(req,res,next){
  res.render("createPost")
})
app.post("/submit", requireLogin, function(req,res,next){
  Post.createPost(req.body.id,req.body.text,function(success, result){
    if(success){
      res.redirect("/home")
    } else {
      res.send("EEEEEERRRRROOORR")
    }
  })
})
app.get("/posts/like/:id", function(req,res,next){
  Like.attachLike(req.user.id,req.params.id,function(success,result){
    if(success){
      res.redirect("/home")
    }else {
      res.send("ERROR attaching like")
    }
  })
})
app.get("/posts/delete/:id", function(req,res,next){
  Post.deletePost(req.params.id,function(success,result){
    if(success){
      res.redirect("/home")
    }else{
      res.send("Error")
    }
  })
})
app.listen(3000, function () {
  console.log("App running on port 3000")
})
