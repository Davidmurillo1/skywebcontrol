// controllers/usuarioController.js
const { Usuario } = require('../model/db');

exports.agregarUsuario = async (req, res) => {
  try {
    // Obtener datos del usuario desde el cuerpo de la solicitud
    const { usuario, contrasena, nombre, tel, rol } = req.body;
    console.log(req.body);

    // Verificar si el nombre de usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { usuario } });
    if (usuarioExistente) {
      return res.status(400).send('El nombre de usuario ya está en uso');
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      usuario,
      contrasena,
      nombre,
      tel,
      rol
    });

    // Enviar respuesta
    res.status(201).json(nuevoUsuario);  // 201 Created

  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
};
