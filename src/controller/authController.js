// controllers/authController.js
const { Usuario } = require('../model/db');

exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};


exports.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    const user = await Usuario.findOne({ where: { usuario } });
    if (user && await user.validarContrasena(contrasena)) {
      req.session.usuario = {
        usuario: user.usuario,
        nombre: user.nombre,
      };
      res.redirect('/inicio');
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

exports.getInicio = (req, res) => {
  if (req.session && req.session.usuario) {
    res.render('inicio', { usuario: req.session.usuario, error: null });
  } else {
    res.redirect('/login');  // redirige al usuario a la página de login si no ha iniciado sesión
  }
};
