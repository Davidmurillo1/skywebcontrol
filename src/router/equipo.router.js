// routes/equipo.router.js
const express = require('express');
const equipoController = require('../controller/equipoController');
const instanciaController = require('../controller/instanciaController');
const upload = equipoController.upload;

const router = express.Router();

router.get('/equipo', equipoController.getMostrarEquipos);

router.get('/agregarEquipo', equipoController.getAgregarEquipo);
router.post('/agregarEquipo', upload.single('imagen'), equipoController.postAgregarEquipo);

router.get('/editar-equipo/:id', equipoController.getEditarEquipo);
router.post('/editar-equipo', equipoController.postEditarEquipo);

router.post('/editar-imagen-equipo/:id', upload.single('file'), equipoController.postEditarImagenEquipo);

router.get('/crear-categoria', equipoController.getCrearCategoria);
router.post('/crear-categoria', equipoController.postCrearCategoria);

router.post('/eliminar-categoria', equipoController.postEliminarCategoria);

router.get('/categorias', equipoController.getCategorias);
router.get('/editar-categoria/:categoria', equipoController.getEditarCategoria);
router.post('/editar-categoria/:categoriaId', equipoController.postEditarCategoria);




// //INSTACIAS DE EQUIPO
router.get('/detalle-equipo/:id', equipoController.getDetalleEquipo);
router.get('/registrar-instancia/:id', equipoController.getNuevaInstanciaEquipo);
router.post('/registrar-instancia/:id', equipoController.postNuevaInstanciaEquipo);




module.exports = router;

