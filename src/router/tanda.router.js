// routes/tanda.router.js
const express = require('express');
const tandaController = require('../controller/tandaController');

const router = express.Router();

router.get('/registrar-tanda/:id', tandaController.getCrearTanda);

router.post('/actualizar-datos-tour/:id', tandaController.postActualizarDatosTour);



module.exports = router;