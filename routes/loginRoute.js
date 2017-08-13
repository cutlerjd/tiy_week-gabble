const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/usersModel')

router.get('/', function (req, res) {
    res.render("login", {
        messages: res.locals.getMessages()
    });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/messages',
    failureRedirect: '/login/',
    failureFlash: true
}))
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get("/register", function (req, res, next) {
    res.render("register")
})
router.post("/register", function (req, res, next) {
    User.createUser(req.body.username.toLowerCase(), req.body.password, req.body.displayName, function (success, result) {
        if (success) {
            console.log("Success registration", result)
            res.redirect("/login")
        } else {
            //todo: add error handling
            res.send("eeeeeerrrrrrooooorr")
        }
    })
})
module.exports = router;