const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const user = require('./models/usersModel')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))


app.get("/", function (req, res, next) {
  res.render("index", { appType: "Express" })
})

app.get("/register", function (req, res, next) {
  res.render("register")
})
app.post("/register", function (req, res, next) {
  user.createUser(req.body.username, req.body.password, req.body.displayName, function (success, result) {
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
app.get("/login", function (req, res, next) {
  res.render("login")
})

app.post("/login", function (req, res, next) {
  user.checkPassword(req.body.username, req.body.password, function (success, result) {
    if (success) {
      console.log(result)
      res.redirect("/")
    } else {
      console.log(result)
      res.redirect("login")
    }
  })
})

app.listen(3000, function () {
  console.log("App running on port 3000")
})
