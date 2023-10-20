// routes/auth.router.js
const express = require('express');
const userController = require('../controller/usuarioController');

const router = express.Router();

router.post('/create-user', userController.agregarUsuario);

module.exports = router;
