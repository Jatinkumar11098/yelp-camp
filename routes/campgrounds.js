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
router.get('/', catchAsync(campgrounds.index));

// create route
router.get('/new', isLoggedin, campgrounds.newCreateForm);
router.post('/', validateCampgrounds, isLoggedin, catchAsync(campgrounds.create));

// show route
router.get('/:id', catchAsync(campgrounds.show));

// update route 
router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.newEditForm));

router.put('/:id', isLoggedin, isAuthor, validateCampgrounds, catchAsync(campgrounds.update));

// delete route 
router.delete('/:id', isLoggedin, catchAsync(campgrounds.delete));

module.exports = router;
