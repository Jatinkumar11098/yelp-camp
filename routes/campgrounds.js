const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds.js');
const { isLoggedin, isAuthor, validateCampgrounds } = require('../middlewares.js');


// routes 
// home route 
// router.get('/', (req, res) => {
//     res.send('Home will be soon here!!')
// })
// index route 
router.route('/')
.get(catchAsync(campgrounds.index))
.post(validateCampgrounds, isLoggedin, catchAsync(campgrounds.create));

// create route
router.get('/new', isLoggedin, campgrounds.newCreateForm);

// show route
router.route('/:id')
.get(catchAsync(campgrounds.show))
.put(isLoggedin, isAuthor, validateCampgrounds, catchAsync(campgrounds.update))
.delete(isLoggedin, catchAsync(campgrounds.delete));


// update route 
router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.newEditForm));

module.exports = router;
