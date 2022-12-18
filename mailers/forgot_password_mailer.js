const nodemailer = require('nodemailer');
const nodemailerObject = require('../config/nodemailer');

module.exports.forgotPassword = (data) => {
    //fetching user from controller
    nodemailerObject.transporter.sendMail({
        from: 'soumyadeepsp@gmail.com',
        to: data.email,
        subject: 'Reset your password',
        html: `<p>Click on this <a href="${data.url}">link</a> to reset password!</p>`
    }, function(err, data) {
        if (err) {console.log('Error in sending email: ', err); return;}
        console.log('Mail sent successfully');
        return;
    });
    return res.redirect('/users/signin');
}