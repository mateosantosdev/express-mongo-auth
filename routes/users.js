var express = require('express');
var router = express.Router();

const {isLogged} = require('../auth')

var UserController = require('../controllers/UserController')

router.get('/', UserController.all)
router.post('/signup', UserController.signup)
router.post('/login', UserController.login);
router.post('/forgot', UserController.forgot);
router.post('/change-password', isLogged, UserController.changePassword);

module.exports = router;
