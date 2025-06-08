const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campground')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection successfull!!')
}



// routes 
// index route 
app.get('/campgrounds', async(req, res) => {
    const campgrounds = await campground.find({});
    res.render('./campgrounds/home', {campgrounds});
})
// show route
app.get('/campgrounds/:id', async(req, res) => {
    const{id} = await req.params;
    const foundCamp = await campground.findById(id)
    res.render('./campgrounds/show', {camp:foundCamp});
})


app.listen(3000, () => {
    console.log('listening to port 3000!!');
});