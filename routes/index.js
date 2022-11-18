const express = require('express');
const router = express.Router();// router instance

const homeController = require('../controllers/home_controller');
const usersController = require('../controllers/users_controller');
//SRS
router.get('/', homeController.home);
router.get('/profile', usersController.profile);
router.get('/signup', usersController.signup);

console.log('router is running');

module.exports = router;