const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/home', { campgrounds });
}

module.exports.newCreateForm = (req, res) => {
    res.render('./campgrounds/new');
}

module.exports.create = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
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
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...images);
    if (req.body.deleteImgs) {
        for (let filename of req.body.deleteImgs) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImgs } } } });
    }
    await campground.save();
    req.flash('success', 'campground updated successfully!!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    for (let img of campground.images) {
        await cloudinary.uploader.destroy(img.filename);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'campground deleted successfully!!')
    res.redirect('/campgrounds');
}