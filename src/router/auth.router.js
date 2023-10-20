// routes/auth.router.js
const express = require('express');
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authController.getLogin);
// router.get('/inicio', authController.getInicio);

router.get('/login', authController.getLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/config', authController.getConfig);


module.exports = router;
