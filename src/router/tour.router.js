// routes/auth.router.js
const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();

router.get('/crear-tour', tourController.getCrearTour);
router.post('/crear-tour', tourController.postCrearTour);


module.exports = router;
