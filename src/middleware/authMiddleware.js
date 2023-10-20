// middleware/authMiddleware.js

module.exports = (req, res, next) => {
    if (!req.session.usuario) {
      return res.redirect('/login');
    }
    next();
  };

module.exports = (req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
};