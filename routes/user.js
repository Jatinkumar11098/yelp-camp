const express = require('express');
const router = express.Router();
const User = require('../models/user');
const user = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('./users/register');
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerUser = await User.register(user, password);
    await registerUser.save();
    req.flash('success', 'Welcome to Yelpcamp');
    res.redirect('/campgrounds');
});

router.get('/login', (req, res) => {
    res.render('./users/login');
});
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),(req,res)=>{
    req.flash('success', 'Welcome back!!');
    res.redirect('/campgrounds');
})

module.exports = router;