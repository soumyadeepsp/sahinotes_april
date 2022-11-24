const User = require('../models/users');

module.exports.profile = (req, res) => {
    res.render('profile');
}

module.exports.signup = (req, res) => {
    res.render('signup');
}

module.exports.signin = (req, res) => {
    res.render('signin');
}

module.exports.create = (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    //search if this is a new user or an old one
    // if new user -> create user -> send to sign in page
    // if old user -> send to sign in page
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {console.log('Error in finding user in create controller: ', err);
            return res.redirect('back')
        }
        // if condition is true if user==null/undefined which means no prevous entry
        if (!user) {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }, function(err, user) {
                if (err) {console.log('Error in creating user in create controller: ', err);
                    return res.redirect('back')
                }
                return res.redirect('/users/signin');
            });
        } else {
            return res.redirect('/users/signin');
        }
    });
}

module.exports.createSession = (req, res) => {

}