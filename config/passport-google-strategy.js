const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');

passport.use(new googleStrategy({
    clientID: '1011703805644-0bd3gm5uo9unqsvk3aaepqehr8nntunk.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
    User.find({email: profile.emails[0].value}, function(err, user) {
        if (err) {console.log('Error in finding user in google strategy: ', err); return done(err, false);}
        if (user) {
            return done(null, user);
        } else {
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user) {
                if (err) {console.log('Error in creating user in google strategy: ', err); return done(err, false);}
                return done(null, user);
            });
        }

    });
}));