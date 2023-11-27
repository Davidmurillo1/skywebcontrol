// routes/entrada.router.js
const express = require("express");
const entradaController = require("../controller/entradaController");

const router = express.Router();



router.get("/entrada", entradaController.getEntrada);
router.get("/mostrar-entrada/:id", entradaController.getMostrarEntrada);

router.post("/registrar-equipo-entrada/:id", entradaController.registrarEquipoEntrada);


router.get("/api/equipos-entrada/:entradaId", entradaController.getEquiposPorEntrada);

//ACTUALIZAR ESTADO DE LA ENTRADA SIN GUARDAR
router.post("/guardar-entrada/:id", entradaController.postguardarEntrada);

//MOSTRAR ENTRADA REGISTRADA EXITOSAMENTE
router.get("/mostrar-entrada-registrada/:id", entradaController.getEntradaRegistrada);


module.exports = router;

