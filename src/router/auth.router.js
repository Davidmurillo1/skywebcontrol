// routes/auth.router.js
const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/', authController.getLogin);

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
