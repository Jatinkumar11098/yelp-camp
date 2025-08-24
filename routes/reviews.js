const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const campground = require('../models/campground');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js');
const { isLoggedin } = require('../middlewares.js')



// middlewares

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(mes => mes.message).join(',');
        throw new ExpressError(message, 400);
    }
    else next();
}

// review create
router.post('/', isLoggedin, validateReview, catchAsync(async (req, res) => {
    const foundCamp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    foundCamp.reviews.push(review);
    await review.save();
    await foundCamp.save();
    req.flash('success', 'Review created successfully!!');
    res.redirect(`/campgrounds/${foundCamp._id}`);
}))
// review delete 
router.delete('/:reviewID', isLoggedin, catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review deleted successfully!!');
    res.redirect(`/campgrounds/${id}`);

}))


module.exports = router;