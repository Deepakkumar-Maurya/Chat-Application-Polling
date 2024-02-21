const express = require('express')
const authController = require('../controller/authenticate')

const router = express.Router();

// routes
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/logout', authController.logout)


module.exports = router;