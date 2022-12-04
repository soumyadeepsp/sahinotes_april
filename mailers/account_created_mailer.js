const nodemailer = require('nodemailer');

module.exports.accountCreated = (data) => {
    nodemailer.transporter.sendMail({
        from: 'soumyadeepsp@gmail.com',
        to: data.email,
        subject: 'Reset your password',
        html: '<h3>Hello, welcome with your new account!</h3>'
    }, function(err, data) {
        if (err) {console.log('Error in sending email: ', err); return;}
        console.log('Mail sent successfully');
        return;
    });
}