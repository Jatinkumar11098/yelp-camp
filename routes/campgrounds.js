const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedin, isAuthor, validateCampgrounds } = require('../middlewares.js');


// routes 
// home route 
// router.get('/', (req, res) => {
//     res.send('Home will be soon here!!')
// })
// index route 
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/home', { campgrounds });
})

// create route
router.get('/new', isLoggedin, (req, res) => {
    res.render('./campgrounds/new');
})
router.post('/', validateCampgrounds, isLoggedin, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'campground successfully created!!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

// show route
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:({path:'author'})
        }).populate('author');
    if (!campground) {
        req.flash('error', 'campground not found!!!');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/show', { camp: campground });
}))

// update route 
router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('./campgrounds/edit', { camp: campground })
}))

router.put('/:id', isLoggedin, isAuthor, validateCampgrounds, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'campground updated successfully!!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

// delete route 
router.delete('/:id', isLoggedin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'campground deleted successfully!!')
    res.redirect('/campgrounds');
}))
module.exports = router;
