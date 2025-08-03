const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const expressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Review = require('./models/review.js');
const {reviewSchema } = require('./schemas.js');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError = require('./utils/expressError');
const router = require('./routes/campgrounds.js');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/campgrounds', router);
// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection successfull!!')
}

// middlewares

const validateReview = (req, res, next) => {
    const {error}= reviewSchema.validate(req.body); 
    if (error) {
        const message = error.details.map(mes => mes.message).join(',');
        throw new ExpressError(message, 400);
    }
    else next();
}

// review create
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const foundCamp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    foundCamp.reviews.push(review);
    await review.save();
    await foundCamp.save();
    res.redirect(`/campgrounds/${foundCamp._id}`);
}))
// review delete 
app.delete('/campgrounds/:id/reviews/:reviewID', catchAsync(async(req,res)=>{
    const {id, reviewID} = req.params;
    await campground.findByIdAndUpdate(id, {$pull:{reviews:reviewID}});
    Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);

}))

app.all(/(.*)/, (req, res, next) => {
    next(new expressError('Page not found', 404));
})

// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh! something went wrong!!!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('listening to port 3000!!');
});





// copy paste 