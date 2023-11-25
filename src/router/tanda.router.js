// routes/tanda.router.js
const express = require('express');
const tandaController = require('../controller/tandaController');

const router = express.Router();

router.get('/mostrar-tanda/:id', tandaController.getTanda);
// //VERIFICAR SI EXISTE LA TANDA
// router.get('/verificar-tanda/:id', tandaController.getVerificarTanda);
//REGITRAR TANDA
router.get('/registrar-nueva-tanda/:id', tandaController.getRegistrarTanda);


router.get('/api/equipos/:tandaId', tandaController.getEquiposPorTanda);

router.post('/actualizar-datos-tour/:id', tandaController.postActualizarDatosTour);

router.post('/registrar-equipo-tanda/:id', tandaController.registrarEquipoTanda);




module.exports = router;