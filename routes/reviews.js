const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review.js');
const { isLoggedin, validateReview, isAuthorReview } = require('../middlewares.js');
const review = require('../models/review.js');



// review create
router.post('/', isLoggedin, validateReview, catchAsync(async (req, res) => {
    const { id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created successfully!!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// review delete 
router.delete('/:reviewId', isLoggedin, isAuthorReview, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!!');
    res.redirect(`/campgrounds/${id}`);

}))


module.exports = router;