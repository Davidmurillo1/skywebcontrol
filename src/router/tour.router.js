// routes/auth.router.js
const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();

router.get('/crear-tour', tourController.getCrearTour);
router.post('/crear-tour', tourController.postCrearTour);
router.get('/inicio', tourController.getTours);
router.get('/tours', tourController.getTours);

router.get('/lista-tours', tourController.getMostrarTours);


module.exports = router;
