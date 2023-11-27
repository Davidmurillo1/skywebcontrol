// controllers/authController.js
const { Usuario } = require("../model/db");

exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    const user = await Usuario.findOne({ where: { usuario } });
    if (user && (await user.validarContrasena(contrasena))) {
      req.session.usuario = {
        usuario: user.usuario,
        nombre: user.nombre,
        role: user.rol,
      };
      res.redirect("/inicio");
    } else {
      req.flash("error", "Usuario o contraseña incorrecta");
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

exports.getConfig = (req, res) => {
  res.render("configuraciones", { error: null });
};
