API_KEY = "SVZdWQo2lMrjBcaughGY5Aey4CKtxqRiTnJ0m7IU6wvkDL8H3p3MvyUhaGzpqkRxrwY8iTQK649l7JOS"

const fast2sms = require('fast-two-sms');

var options = {
    authorization : API_KEY ,
    message : 'Your OTP is 6535' , 
    numbers : ['78308760031']
} 

async function sendOtpMessage() {
    var res = await fast2sms.sendMessage(options);
    if (res) {
        console.log(res);
    } else {
        console.log('balance over');
    }
}
sendOtpMessage();