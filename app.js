const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campgrounds')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection successfull!!')
}



// routes 
// show route 
app.get('/campgrounds', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log('listening to port 3000!!');
});