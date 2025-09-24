const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');


const opts = { toJSON: { virtuals: true } };
const Schema = mongoose.Schema;
const campgroundSchema = new Schema({
    title: String,
    location: String,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

}, opts);

campgroundSchema.virtual('properties.popUpMarker').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', campgroundSchema);
