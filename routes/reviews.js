const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review.js');
const { isLoggedin, validateReview } = require('../middlewares.js');



// review create
router.post('/', isLoggedin, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created successfully!!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// review delete 
router.delete('/:reviewID', isLoggedin, catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review deleted successfully!!');
    res.redirect(`/campgrounds/${id}`);

}))


module.exports = router;