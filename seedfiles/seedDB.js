const mongoose = require('mongoose');
const campground = require('../models/campground.js')
const cities = require('./cities.js')
const { descriptors, places } = require('./seedHelpers.js')


// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Mongoose connection and seeding successful!')
}


// function for random array values 
const arrayRand = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await campground.deleteMany();
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random()*30) +10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new campground({
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${arrayRand(descriptors)} ${arrayRand(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo voluptas dolores, ducimus error dolorem consequatur ex perferendis nesciunt maiores reiciendis quisquam nostrum deserunt fugiat similique voluptate voluptatibus asperiores dignissimos debitis.',
            image:`https://picsum.photos/400?random=${Math.random()}`,
            price
        })
        await camp.save()
    }
}

seedDB();