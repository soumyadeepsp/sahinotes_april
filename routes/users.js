const express = require('express');
const passport = require('passport');
const router = express.Router();// router instance

const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);
router.get('/signin', usersController.signin); //browser is calling
router.get('/signin_failure', usersController.signinFailure); //server is calling
router.get('/signup', usersController.signup); //browser is calling

router.post('/create', usersController.create);
//called create during signup and then redirected to sign in page
router.post('/create_session', passport.authenticate('local', {failureRedirect: '/users/signin', failureFlash: 'Signin is not successful'}) ,usersController.createSession);
//called create session during signin and thenr edirected to profile page

router.get('/logout', usersController.logout);
router.get('/auth/google',  passport.authenticate('google', {scope: ['profile', 'email']}), usersController.createSession);
router.get('/auth/google/callback',  passport.authenticate('google', {failureRedirect: '/users/signin'}), usersController.createSession);
//in both signup and signin, we will call createsession and redirect to profile page

router.get('/verify_mobile', usersController.verifyMobile);
router.get('/send_otp_message/:mobileNumber', usersController.sendOtpMessage);
router.get('/verify_otp/:obj', usersController.verifyOtp);

router.get('/update_password', usersController.update_password);
router.get('/forgot_password', usersController.forgot_password);
router.post('/update_password', usersController.update_password_post);
router.post('/forgot_password', usersController.forgot_password_post);
router.post('/upload_notes', usersController.uploadNotes);

router.get('/show_all_notes', usersController.show_all_notes);
router.get('/show_single_notes/:x', usersController.show_single_notes);
router.put('/like_notes/:noteName', usersController.likeNotes);
router.get('/get_number_of_likes/:noteName', usersController.numberOfLikes);

router.post('/new_note_comment', usersController.addNewComment);
router.get('/get_all_comments/:noteName', usersController.getComments);
module.exports = router;