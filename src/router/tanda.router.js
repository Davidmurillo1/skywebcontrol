// routes/tanda.router.js
const express = require('express');
const tandaController = require('../controller/tandaController');

const router = express.Router();

//MOSTRAR TANDA PARA REGISTRAR EQUIPOS
router.get('/mostrar-tanda/:id', tandaController.getTanda);
//REGITRAR TANDA
router.get('/registrar-nueva-tanda/:id', tandaController.getRegistrarTanda);
router.post('/registrar-nueva-tanda/:id', tandaController.postRegistrarTanda);
//MOSTRAR TANDA REGISTRADA EXITOSAMENTE
router.get('/mostrar-tanda-registrada/:id', tandaController.getTandaRegistrada);



router.get('/api/equipos/:tandaId', tandaController.getEquiposPorTanda);

router.post('/actualizar-datos-tour/:id', tandaController.postActualizarDatosTour);

router.post('/registrar-equipo-tanda/:id', tandaController.registrarEquipoTanda);




module.exports = router;