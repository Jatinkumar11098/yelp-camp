if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const campground = require('./models/campground');
const expressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Review = require('./models/review.js');
const { reviewSchema } = require('./schemas.js');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const User = require('./models/user.js');
const ExpressError = require('./utils/expressError');
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/user.js');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { MongoStore } = require('connect-mongo');
const db_url = process.env.mongodb_url || 'mongodb://127.0.0.1:27017/yelp-camp';
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

// 'mongodb://127.0.0.1:27017/yelp-camp'

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


// mongoose connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(db_url);
    console.log('Mongoose connection successfull!!')
}


const store = MongoStore.create({
    mongoUrl: db_url,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
const sessionConfig = {
    store,
    secret,
    name: 'campsites',
    esave: false,
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}
app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({
    replaceWith: '_',
}));


app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://fonts.google.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];



const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drwp4kmxm/",
                "https://images.unsplash.com/",
                "https://api.maptiler.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);












passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// providing flash messages to all ejs templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('./campgrounds/landing');
})

// router middlewares
app.use('/campgrounds', campgroundRoutes);
app.use('/', userRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.all(/(.*)/, (req, res, next) => {
    next(new expressError('Page not found', 404));
})

// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh! something went wrong!!!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('listening to port 3000!!');
});