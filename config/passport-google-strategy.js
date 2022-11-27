const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');

passport.use(new googleStrategy({
    clientID: '1048626114643-ikmsqg0j9pdlf2dkhcmavv7soo7oh03d.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/user/auth/google/callback'
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