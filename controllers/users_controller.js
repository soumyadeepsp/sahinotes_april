const User = require('../models/users');
const accountCreatedMailer = require('../mailers/account_created_mailer');
const forgotPasswordMailer = require('../mailers/forgot_password_mailer');

module.exports.profile = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('profile');
    } else {
        return res.render('signin');
    }
}

module.exports.signup = (req, res) => {
    res.render('signup');
}

module.exports.signin = (req, res) => {
    res.render('signin');
}

module.exports.forgot_password = (req, res) => {
    res.render('forgot_password');
}

module.exports.update_password = (req, res) => {
    res.render('update_password');
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
                // i should send the email(user.email)
                accountCreatedMailer.accountCreated(user);
                return res.redirect('/users/signin');
            });
        } else {
            return res.redirect('/users/signin');
        }
    });
}
// notes and notelists schemas dont have any records till now

module.exports.createSession = (req, res) => {
    return res.redirect('/users/profile');
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) {console.log('Error in logging out: ', err); return;}
    });
    return res.redirect('/users/signin');
}

module.exports.verifyMobile = (req, res) => {
    return res.render('verify_mobile');
}

module.exports.sendOtpMessage = (req, res) => {
    // send the otp message
    const mobilenumber = req.params.mobileNumber;
    console.log(req.params);
    const userEmail = req.user.email;
    API_KEY = "SVZdWQo2lMrjBcaughGY5Aey4CKtxqRiTnJ0m7IU6wvkDL8H3p3MvyUhaGzpqkRxrwY8iTQK649l7JOS"

    const fast2sms = require('fast-two-sms');
    const otp = Math.floor(Math.random()*9000) + 1000;

    var options = {
        authorization : API_KEY ,
        message : `Your OTP is ${otp}` , 
        numbers : [mobilenumber]
    } 

    async function sendOtpMessage() {
        var res = await fast2sms.sendMessage(options);
        if (res) {
            console.log(res);
            User.findOneAndUpdate({email: userEmail}, {mobileOtp: otp}, function(err, user) {
                if (err) {console.log('Error in saving otp: ', err); return;}
                user.save();
                var id = setTimeout(function(otp) {
                    User.findOne({email: userEmail}, function(err, user){
                        if (err) {return;}
                        if (user.mobileOtp==otp) {
                            User.findOneAndUpdate({email: userEmail, mobileOtp: ""}, function(err, user) {});
                        }
                    });
                }, 1*60*1000);
            });
        } else {
            console.log('balance over');
        }
    }
    sendOtpMessage();
    console.log('hello world');
}

module.exports.verifyOtp = (req, res) => {
    var obj = JSON.parse(req.params.obj);
    var mobileNumber = obj.mobileNumber;
    var otp = obj.otp;
    const userEmail = req.user.email;
    if (otp==req.user.mobileOtp) {
        User.findOneAndUpdate({email: userEmail}, {mobile: mobileNumber, mobileOtp: ""}, function(err, user) {
            if (err) {console.log('Error in verifying otp: ', err); return;}
            user.save();
        });
    } else {
        User.findOneAndUpdate({email: userEmail}, {mobileOtp: ""}, function(err, user){});
        console.log("otp invalid");

    }
    console.log('mobile number verified');
    return;
}

module.exports.forgot_password_post = (req, res) => {
    var email = req.body.email;
    var token = Math.floor(Math.random()*9000) + 1000;
    var accessToken = email + token;
    User.findOneAndUpdate({email: email}, {accessToken: accessToken}, function(err, user) {
        if (err) {console.log('Error in finding user in forgot password post: ', err); return;}
        if (!user) {
            console.log('User not found');
        } else {
            user.save();
            var obj = {};
            obj.email = user.email;
            obj.url = `http://localhost:8000/users/update_password?accessToken=${accessToken}`
            forgotPasswordMailer.forgotPassword(obj);
        }
    })
}

module.exports.update_password_post = (req, res) => {
    //extract email id and accessToken
    //check if accessToken is present in the user with that email id
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var accessToken = req.body.accessToken;
    console.log(password, confirm_password, accessToken);
    if (password!=confirm_password) {
        console.log('passwords dont match');
        return res.redirect('back');
    } else {
        var email = accessToken.substring(0, accessToken.length-4);
        console.log(email);
        User.findOne({email: email}, function(err, user) {
            if (err) {console.log('Error in finding user: ', err); return;}
            if (accessToken==user.accessToken) {
                User.findOneAndUpdate({email: email}, {password: password, accessToken: null}, function(err, user) {
                    if (err) {console.log('Error in finding user: ', err); return;}
                    user.save();
                });
            }
        });
        return res.redirect('/users/signin');
    }
}

module.exports.uploadNotes = (req, res) => {
    
}