const nodemailer = require('nodemailer');

module.exports.forgotPassword = (data) => {
    nodemailer.transporter.sendMail({
        from: 'soumyadeepsp@gmail.com',
        to: data.email,
        subject: 'Reset your password',
        html: '<h3>Click on the link to reset your password</h3>'
    }, function(err, data) {
        if (err) {console.log('Error in sending email: ', err); return;}
        console.log('Mail sent successfully');
        return;
    });
}