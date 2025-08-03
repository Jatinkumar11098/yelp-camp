const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const campground = require('../models/campground');
const { campgroundSchema} = require('../schemas.js');


// middleware
const validateCampgrounds = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const message = result.error.details.map(mes => mes.message).join(',');
        throw new ExpressError(message, 400);
    }
    else next();
}


// routes 
// home route 
// router.get('/', (req, res) => {
//     res.send('Home will be soon here!!')
// })
// index route 
router.get('/', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('./campgrounds/home', { campgrounds });
})

// create route
router.get('/new', (req, res) => {
    res.render('./campgrounds/new');
})
router.post('/', validateCampgrounds, catchAsync(async (req, res, next) => {
    const addedCamp = new campground(req.body.campground);
    await addedCamp.save();
    res.redirect(`/campgrounds/${addedCamp._id}`);
}))

// show route
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = await req.params;
    const foundCamp = await campground.findById(id).populate('reviews');
    res.render('./campgrounds/show', { camp: foundCamp });
}))

// update route 
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const editCampground = await campground.findById(id);
    res.render('./campgrounds/edit', { camp: editCampground })
}))

router.put('/:id', validateCampgrounds, catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const updateCamp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    console.log(updateCamp);
    res.redirect(`/campgrounds/${updateCamp._id}`);
}))

// delete route 
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))
module.exports = router;
