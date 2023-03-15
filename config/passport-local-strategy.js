const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new localStrategy({usernameField: 'email'}, function(email, password, done) {
    console.log("starting middleware");
    User.findOne({email: email}, (err, user) => {
        if (err) {
            console.log('Error in finding user in passport: ', err);
            return done(err, false);
        }
        if (!user || password!=user.password) {
            console.log('Invalid email or password');
            // send notfication for signin failure
            return done(null, false);
        }
        console.log("end of middleware");
        return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    console.log("inside serialiser");
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log("inside deserialiser");
    User.findById(id, function(err, user) {
        if (err) {console.log('Error in deserializeUser: ', err);
            return done(err);
        }
        return done(null, user);
    });
});

passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/users/signin');
    }
}

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user.id;
    }
    return next();
}

module.exports = passport;