const express = require('express');
const router = express.Router();
const Post = require('../models/postsModel')
const Like = require('../models/likesModel')
const expressValidator = require('express-validator')

router.use(expressValidator())

router.get("/", function (req, res, next) {
  Post.getAllPosts(req.user.id, function (results) {
    let posts = { posts: results }
    // console.dir(posts, {depth:null})
    res.render("messagesHome", posts)
  })
})
router.get("/test", function (req, res, next) {
  Post.getAllPosts(req.user.id, function (results) {
    let posts = { posts: results }
    res.render("templateHome", posts)
  })
})
router.get("/submit", function (req, res, next) {
  res.render("createPost")
})

router.post("/submit", function (req, res, next) {
  req.checkBody('text', "Length is too long!").isLength(0, 140)
  let validationErrors = req.validationErrors()
  if (!validationErrors) {
    Post.createPost(req.body.id, req.body.text, function (success, result) {
      if (success) {
        res.redirect("/messages")
      } else {
        res.send("EEEEEERRRRROOORR")
      }
    })
  } else {
    res.send("Too many characters!")
  }
})
router.get("/like/:id", function (req, res, next) {
  Like.attachLike(req.user.id, req.params.id, function (success, result) {
    if (success) {
      res.redirect("/messages")
    } else {
      res.send("ERROR attaching like")
    }
  })
})
router.get("/delete/:id", function (req, res, next) {
  Post.deletePost(req.params.id, function (success, result) {
    if (success) {
      res.redirect("/messages")
    } else {
      res.send("Error")
    }
  })
})
module.exports = router;