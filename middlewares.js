const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/expressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'login required!');
        return res.redirect('/login');
    }
    next();
};
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();

}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author._id.equals(req.user._id)) {
        req.flash('error', 'Permission denied!!');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}
module.exports.isAuthorReview = async (req, res, next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(req.user._id)) {
        req.flash('error', 'Permission denied!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateCampgrounds = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const message = result.error.details.map(mes => mes.message).join(',');
        throw new ExpressError(message, 400);
    }
    else next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(mes => mes.message).join(',');
        throw new ExpressError(message, 400);
    }
    else next();
}