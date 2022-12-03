var sendOtpButton = document.getElementById('sendOtpButton');
var mobileNumber = document.getElementById('mobileNumber');
console.log(mobileNumber);
sendOtpButton.addEventListener('click', function(e) {
    //call a GET API
    e.preventDefault();
    console.log(mobileNumber);
    fetch(`/users/send_otp_message`);
    console.log('otp sent');
});