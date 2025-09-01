const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('./users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerUser = await User.register(user, password);
        await registerUser.save();
        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}

module.exports.loginForm = (req, res) => {
    res.render('./users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((e) => {
        if (e) {
            return next(e);
        }
    });
    req.flash('success', 'Successfully logout')
    res.redirect('/campgrounds');
}