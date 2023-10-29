// routes/equipo.router.js
const express = require('express');
const equipoController = require('../controller/equipoController');
const upload = equipoController.upload;

const router = express.Router();

router.get('/equipo', equipoController.getMostrarEquipos);

router.get('/agregarEquipo', equipoController.getAgregarEquipo);
router.post('/agregarEquipo', upload.single('imagen'), equipoController.postAgregarEquipo);

router.get('/crear-categoria', equipoController.getCrearCategoria);
router.post('/crear-categoria', equipoController.postCrearCategoria);


module.exports = router;

