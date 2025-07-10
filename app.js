const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const expressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Review = require('./models/review.js')
const { campgroundSchema } = require('./schemas.js');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError = require('./utils/expressError');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection successfull!!')
}

// middlewares

const validateCampgrounds = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const message = result.error.details.map(mes => mes.message).join(',');
        throw new ExpressError(message);
    }
    else next();
}

// routes 
// home route 
app.get('/', (req, res) => {
    res.send('Home will be soon here!!')
})
// index route 
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('./campgrounds/home', { campgrounds });
})

// create route
app.get('/campgrounds/new', (req, res) => {
    res.render('./campgrounds/new');
})
app.post('/campgrounds', validateCampgrounds, catchAsync(async (req, res, next) => {
    const addedCamp = new campground(req.body.campground);
    await addedCamp.save();
    res.redirect(`/campgrounds/${addedCamp._id}`);
}))

// show route
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = await req.params;
    const foundCamp = await campground.findById(id)
    res.render('./campgrounds/show', { camp: foundCamp });
}))

// update route 
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const editCampground = await campground.findById(id);
    res.render('./campgrounds/edit', { camp: editCampground })
}))

app.put('/campgrounds/:id', validateCampgrounds, catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateCamp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${updateCamp._id}`);
}))

// delete route 
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

// review form 
app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const foundCamp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    foundCamp.reviews.push(review);
    await review.save();
    await foundCamp.save();
    res.redirect(`/campgrounds/${foundCamp._id}`);
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