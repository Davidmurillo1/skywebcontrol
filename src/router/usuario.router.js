// routes/auth.router.js
const express = require("express");
const userController = require("../controller/usuarioController");

const router = express.Router();

router.get("/create-user", userController.getAgregarUsuario);
router.post("/create-user", userController.agregarUsuario);
router.get("/usuarios", userController.getUsuarios);

router.get("/editar-usuario/:usuario", userController.getEditarUsuario);
router.post("/editar-usuario/:usuario", userController.postEditarUsuario);

router.post("/eliminar-usuario", userController.postEliminarUsuario);

module.exports = router;
