const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review.js');
const { isLoggedin, validateReview, isAuthorReview } = require('../middlewares.js');
const review = require('../models/review.js');
const reviews = require('../controllers/reviews.js');



// review create
router.post('/', isLoggedin, validateReview, catchAsync(reviews.create));
// review delete 
router.delete('/:reviewId', isLoggedin, isAuthorReview, catchAsync(reviews.delete))


module.exports = router;