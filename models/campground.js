const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const campgroundSchema = new Schema({
    title: String,
    location: String,
    description: String,
    price: String

});

module.exports = mongoose.model('Campground', campgroundSchema);
