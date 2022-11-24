const express = require('express');
const router = express.Router();// router instance

const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);
router.get('/signin', usersController.signin); //browser is calling
router.get('/signup', usersController.signup); //browser is calling

router.post('/create', usersController.create);
router.post('/create_session', usersController.createSession);

module.exports = router;