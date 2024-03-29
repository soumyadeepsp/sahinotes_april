const queue = require('../config/kue');

const createAccountMailer = require('../mailers/account_created_mailer');

queue.process('emails', function(job, done) {
    var user = job.data;
    createAccountMailer.accountCreated(user);
    done();
});

module.exports = queue;