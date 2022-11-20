const { application } = require('express');
const express = require('express');
const router = express.Router();// router instance

const homeController = require('../controllers/home_controller');
const usersController = require('../controllers/users_controller');

router.get('/', homeController.home);
router.use('/users', require('./users'));

console.log('router is running');

module.exports = router;