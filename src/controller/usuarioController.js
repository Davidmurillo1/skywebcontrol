// controllers/usuarioController.js
const { Usuario } = require("../model/db");

exports.getAgregarUsuario = (req, res) => {
  res.render("crear-usuario", { error: null });
};

exports.agregarUsuario = async (req, res) => {
  try {
    // Obtener datos del usuario desde el cuerpo de la solicitud
    const { usuario, contrasena, nombre, tel, rol } = req.body;
    console.log(req.body);

    // Verificar si el nombre de usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { usuario } });
    if (usuarioExistente) {
      return res.status(400).send("El nombre de usuario ya está en uso");
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      usuario,
      contrasena,
      nombre,
      tel,
      rol,
    });

    if (nuevoUsuario) {
      // Enviar respuesta
      req.flash("success", "Usuario registrado exitosamente.");
      res.redirect("/usuarios");
    } else {
      // Enviar respuesta
      req.flash("error", "Usuario no se pudo registrar");
      res.redirect("/usuarios");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const usuarios = await Usuario.findAll();

    // Renderizar la vista de usuarios y pasar los datos de usuarios a la vista
    res.render("usuarios", { usuarios: usuarios, messages: req.flash() });
  } catch (error) {
    console.error(error);
    // En caso de un error, enviar un mensaje de error al cliente
    res.status(500).send("Hubo un error al obtener los usuarios");
  }
};

exports.getEditarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { usuario: req.params.usuario },
    });
    if (usuario) {
      res.render("editar-usuario", {
        usuario: usuario,
        usuarioSesion: req.session.usuario,
      });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al obtener el usuario");
  }
};

exports.postEditarUsuario = async (req, res) => {
  try {
    await Usuario.update(
      {
        nombre: req.body.nombre,
        tel: req.body.tel,
        rol: req.body.rol,
      },
      {
        where: { usuario: req.params.usuario },
      }
    );
    res.redirect("/usuarios");
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al editar el usuario");
  }
};

exports.postEliminarUsuario = async (req, res) => {
  const { usuario } = req.body;

  try {
    const resultado = await Usuario.destroy({
      where: { usuario: usuario },
    });

    if (resultado) {
      req.flash("success", "Usuario eliminado exitosamente.");
      res.redirect("/usuarios");
    } else {
      req.flash("error", "Usuario no encontrado.");
      res.redirect("/usuarios");
    }
  } catch (error) {
    req.flash("error", "Error al eliminar el usuario.");
    res.redirect("/usuarios");
  }
};

