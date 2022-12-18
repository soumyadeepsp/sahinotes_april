const nodemailer = require('nodemailer');
const ejs = require('ejs');

let transporter = nodemailer.createTransport({
    //configurations for sending email
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'soumyadeepsp@gmail.com',
        pass: 'wvxftpzliwdtyjsa'
        //app password is servcie specific
    }
});

let renderTemplate = function(data, path) {
    // data is any user specific data that you want to send to the mailer template
    // relativePath is the name of the template file inside mailers folder in the views folder
    var templateToBeReturned;
    ejs.renderFile(path, data, function(err, template) {
        if (err) {console.log('Error in rendering email: ', err); return;}
        templateToBeReturned = template;
    });
    return templateToBeReturned;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}