const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { storeReturnTo } = require('../middlewares')
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('./users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerUser = await User.register(user, password);
        await registerUser.save();
        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}));

// login routes 
router.get('/login', (req, res) => {
    res.render('./users/login');
});
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
});

// logout routes 
router.get('/logout', (req, res, next) => {
    req.logout((e) => {
        if (e) {
            return next(e);
        }
    });
    req.flash('success', 'Successfully logout')
    res.redirect('/campgrounds');
})

module.exports = router;