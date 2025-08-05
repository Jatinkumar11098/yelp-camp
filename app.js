const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const campground = require('./models/campground');
const expressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Review = require('./models/review.js');
const { reviewSchema } = require('./schemas.js');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError = require('./utils/expressError');
const campgrounds = require('./routes/campgrounds.js');
const reviews = require('./routes/reviews.js');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


const sessionConfig = {
    secret: 'ThisIsNotAGoodSecret',
    esave: false,
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}
app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection successfull!!')
}


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