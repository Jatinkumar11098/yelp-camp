const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection successfull!!')
}



// routes 
// home route 
app.get('/', (req,res)=>{
    res.send('Home will be soon here!!')
})
// index route 
app.get('/campgrounds', async(req, res) => {
    const campgrounds = await campground.find({});
    res.render('./campgrounds/home', {campgrounds});
})

// create route
app.get('/campgrounds/new', (req,res)=>{
    res.render('./campgrounds/new');
})
app.post('/campgrounds', async (req,res)=>{
    const newCamp = req.body.campground;
    const addedCamp= new campground(newCamp);
    await addedCamp.save();
    res.redirect(`/campgrounds/${addedCamp._id}`);
})

// show route
app.get('/campgrounds/:id', async(req, res) => {
    const{id} = await req.params;
    const foundCamp = await campground.findById(id)
    res.render('./campgrounds/show', {camp:foundCamp});
})

// update route 
app.get('/campgrounds/:id/edit' ,  async (req,res)=>{
    const {id} = req.params;
    const editCampground = await campground.findById(id);
    res.render('./campgrounds/edit', {camp:editCampground})
})

app.put('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    const updateCamp= await campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${updateCamp._id}`);
})

// delete route 
app.delete('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    const deleteCampground = await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// app.use((req,res,next)=>{
//     console.log('Oh boy, Error!!!');
// })

app.listen(3000, () => {
    console.log('listening to port 3000!!');
});





// copy paste 