const mongoose = require('mongoose');

const schema = mongoose.schema;
const campgroundSchema = new schema({
    title: String,
    location: String,
    description: String,
    price: String

})

module.exports.Campground = mongoose.model('Campground', campgroundSchema);
