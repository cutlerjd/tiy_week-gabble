const express = require('express');
const router = express.Router();
const Post = require('../models/postsModel')
const Like = require('../models/likesModel')

router.get("/", function(req,res,next){
  Post.getAllPosts(req.user.id,function(results){
    let posts = {posts:results}
    console.dir(posts, {depth:null})
    res.render("messagesHome",posts)
  })
})

router.get("/submit", function(req,res,next){
  res.render("createPost")
})
router.post("/submit", function(req,res,next){
  Post.createPost(req.body.id,req.body.text,function(success, result){
    if(success){
      res.redirect("/messages")
    } else {
      res.send("EEEEEERRRRROOORR")
    }
  })
})
router.get("/like/:id", function(req,res,next){
  Like.attachLike(req.user.id,req.params.id,function(success,result){
    if(success){
      res.redirect("/messages")
    }else {
      res.send("ERROR attaching like")
    }
  })
})
router.get("/delete/:id", function(req,res,next){
  Post.deletePost(req.params.id,function(success,result){
    if(success){
      res.redirect("/messages")
    }else{
      res.send("Error")
    }
  })
})
module.exports = router;