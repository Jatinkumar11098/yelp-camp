const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { storeReturnTo } = require('../middlewares')
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.get('/register', users.registerForm);

router.post('/register', catchAsync(users.register));

// login routes 
router.get('/login', users.loginForm);
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// logout routes 
router.get('/logout', users.logout);

module.exports = router;