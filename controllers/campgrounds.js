const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/home', { campgrounds });
}

module.exports.newCreateForm = (req, res) => {
    res.render('./campgrounds/new');
}

module.exports.create = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'campground successfully created!!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: ({ path: 'author' })
    }).populate('author');
    if (!campground) {
        req.flash('error', 'campground not found!!!');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/show', { camp: campground });
}

module.exports.newEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('./campgrounds/edit', { camp: campground })
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'campground updated successfully!!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'campground deleted successfully!!')
    res.redirect('/campgrounds');
}