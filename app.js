const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection successfull!!')
}



// routes 
// show route 
app.get('/campgrounds', (req, res) => {
    res.send('This will be the show route!!');
})

app.listen(3000, () => {
    console.log('listening to port 3000!!');
});