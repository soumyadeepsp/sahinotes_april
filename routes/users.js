const express = require('express');
const passport = require('passport');
const router = express.Router();// router instance

const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);
router.get('/signin', usersController.signin); //browser is calling
router.get('/signup', usersController.signup); //browser is calling

router.post('/create', usersController.create);
//called create during signup and then redirected to sign in page
router.post('/create_session', passport.authenticate('local', {failureRedirect: '/users/signin'}) ,usersController.createSession);
//called create session during signin and thenr edirected to profile page

router.get('/logout', usersController.logout);
router.get('/auth/google',  passport.authenticate('google', {scope: ['profile', 'email']}), usersController.createSession);
router.get('/auth/google/callback',  passport.authenticate('google', {failureRedirect: '/users/signin'}), usersController.createSession);
//in both signup and signin, we will call createsession and redirect to profile page

module.exports = router;